const { validationResult } = require('express-validator');
const Application = require('../models/Application');
const Opportunity = require('../models/Opportunity');
const Organization = require('../models/Organization');
const Notification = require('../models/Notification');
const User = require('../models/User');
const { sendSuccess, sendError } = require('../utils/response');
const { uploadDocument } = require('../services/uploadService');
const emailService = require('../services/emailService');
const { getPaginationParams, getPaginationMeta } = require('../utils/pagination');

exports.createApplication = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return sendError(res, 400, 'Validation failed', errors.array());

    if (req.user.role !== 'refugee') return sendError(res, 403, 'Only refugees can apply for opportunities');

    const { opportunityId, coverLetter } = req.body;
    const opportunity = await Opportunity.findById(opportunityId).populate('organization');
    if (!opportunity) return sendError(res, 404, 'Opportunity not found');
    if (opportunity.status !== 'active') return sendError(res, 400, 'This opportunity is no longer accepting applications');
    if (opportunity.externalLink) return sendError(res, 400, 'This opportunity uses an external application link. Please apply through the external site.');
    if (new Date(opportunity.deadline) < new Date()) return sendError(res, 400, 'The deadline for this opportunity has passed');

    const existing = await Application.findOne({ applicant: req.user._id, opportunity: opportunityId });
    if (existing) return sendError(res, 409, 'You have already applied for this opportunity');

    let cvData = {};
    if (req.file) {
      const uploaded = await uploadDocument(req.file.buffer, req.file.originalname, 'opportunity-hub/application-cvs');
      cvData = uploaded;
    } else if (req.user.cv?.url) {
      cvData = req.user.cv;
    }

    const application = await Application.create({
      applicant: req.user._id,
      opportunity: opportunityId,
      coverLetter,
      cv: cvData,
    });

    // Increment application count
    await Opportunity.findByIdAndUpdate(opportunityId, { $inc: { applicationCount: 1 } });

    // Create notification for the org user
    const orgUser = await User.findById(opportunity.organization.user);
    if (orgUser) {
      await Notification.create({
        recipient: orgUser._id,
        type: 'application_submitted',
        title: 'New Application Received',
        message: `${req.user.fullName || req.user.email} applied for ${opportunity.title}`,
        data: { opportunityId: opportunity._id, applicationId: application._id },
      });
    }

    // Send confirmation email
    emailService.sendApplicationSubmittedEmail(req.user, opportunity).catch(console.error);

    await application.populate([
      { path: 'applicant', select: 'fullName email profilePicture' },
      { path: 'opportunity', select: 'title category organization', populate: { path: 'organization', select: 'organizationName' } },
    ]);

    return sendSuccess(res, 201, 'Application submitted successfully', application);
  } catch (err) {
    next(err);
  }
};

exports.getApplications = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query);
    let filter = {};

    if (req.user.role === 'refugee') {
      filter.applicant = req.user._id;
      if (req.query.status) filter.status = req.query.status;
    } else if (req.user.role === 'organization') {
      const org = await Organization.findOne({ user: req.user._id });
      if (!org) return sendError(res, 404, 'Organization profile not found');
      const orgOpportunities = await Opportunity.find({ organization: org._id }).distinct('_id');
      filter.opportunity = { $in: orgOpportunities };
      if (req.query.opportunityId) filter.opportunity = req.query.opportunityId;
      if (req.query.status) filter.status = req.query.status;
    }

    const total = await Application.countDocuments(filter);
    const applications = await Application.find(filter)
      .populate('applicant', 'fullName email profilePicture countryOfOrigin skills cv')
      .populate({ path: 'opportunity', select: 'title category location deadline', populate: { path: 'organization', select: 'organizationName logo' } })
      .sort('-createdAt').skip(skip).limit(limit);

    return sendSuccess(res, 200, 'Applications retrieved', applications, getPaginationMeta(total, page, limit));
  } catch (err) {
    next(err);
  }
};

exports.getApplicationById = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('applicant', 'fullName email profilePicture skills languages education bio cv')
      .populate({ path: 'opportunity', populate: { path: 'organization', select: 'organizationName logo contactEmail' } });

    if (!application) return sendError(res, 404, 'Application not found');

    // Check ownership
    const isOwner = application.applicant._id.toString() === req.user._id.toString();
    const isOrgOwner = req.user.role === 'organization';
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isOrgOwner && !isAdmin) return sendError(res, 403, 'Access denied');

    return sendSuccess(res, 200, 'Application retrieved', application);
  } catch (err) {
    next(err);
  }
};

exports.updateApplicationStatus = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return sendError(res, 400, 'Validation failed', errors.array());

    const { status, notes } = req.body;
    const application = await Application.findById(req.params.id)
      .populate('applicant', 'fullName email')
      .populate({ path: 'opportunity', populate: { path: 'organization' } });

    if (!application) return sendError(res, 404, 'Application not found');

    // Verify org ownership
    if (req.user.role === 'organization') {
      const org = await Organization.findOne({ user: req.user._id });
      if (!org || application.opportunity.organization._id.toString() !== org._id.toString()) {
        return sendError(res, 403, 'You are not authorized to update this application');
      }
    }

    application.status = status;
    application.statusUpdatedAt = new Date();
    application.statusUpdatedBy = req.user._id;
    if (notes) application.notes = notes;
    await application.save();

    // Create notification for applicant
    await Notification.create({
      recipient: application.applicant._id,
      type: status === 'accepted' ? 'application_accepted' : status === 'rejected' ? 'application_rejected' : 'application_reviewed',
      title: status === 'accepted' ? 'Application Accepted!' : status === 'rejected' ? 'Application Update' : 'Application Reviewed',
      message: status === 'accepted'
        ? `Congratulations! Your application for ${application.opportunity.title} has been accepted.`
        : status === 'rejected'
        ? `Your application for ${application.opportunity.title} was not selected.`
        : `Your application for ${application.opportunity.title} has been reviewed.`,
      data: { opportunityId: application.opportunity._id, applicationId: application._id },
    });

    // Send email
    if (status === 'accepted') {
      emailService.sendApplicationAcceptedEmail(application.applicant, application.opportunity, notes).catch(console.error);
    } else if (status === 'rejected') {
      emailService.sendApplicationRejectedEmail(application.applicant, application.opportunity, notes).catch(console.error);
    }

    return sendSuccess(res, 200, 'Application status updated', application);
  } catch (err) {
    next(err);
  }
};

exports.withdrawApplication = async (req, res, next) => {
  try {
    const application = await Application.findOne({ _id: req.params.id, applicant: req.user._id });
    if (!application) return sendError(res, 404, 'Application not found');
    if (application.status !== 'pending') return sendError(res, 400, 'Cannot withdraw a processed application');

    await Application.findByIdAndDelete(req.params.id);
    await Opportunity.findByIdAndUpdate(application.opportunity, { $inc: { applicationCount: -1 } });

    return sendSuccess(res, 200, 'Application withdrawn');
  } catch (err) {
    next(err);
  }
};
