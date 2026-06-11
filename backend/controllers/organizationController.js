const { validationResult } = require('express-validator');
const Organization = require('../models/Organization');
const Opportunity = require('../models/Opportunity');
const Application = require('../models/Application');
const { sendSuccess, sendError } = require('../utils/response');
const { uploadImage, deleteFile } = require('../services/uploadService');
const { getPaginationParams, getPaginationMeta } = require('../utils/pagination');

exports.getAllOrganizations = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query);
    const filter = { isActive: true };
    if (req.query.verified === 'true') filter.isVerified = true;
    if (req.query.type) filter.type = req.query.type;

    const total = await Organization.countDocuments(filter);
    const organizations = await Organization.find(filter)
      .populate('user', 'email fullName')
      .sort('-createdAt').skip(skip).limit(limit);

    return sendSuccess(res, 200, 'Organizations retrieved', organizations, getPaginationMeta(total, page, limit));
  } catch (err) {
    next(err);
  }
};

exports.getOrganizationById = async (req, res, next) => {
  try {
    const org = await Organization.findById(req.params.id).populate('user', 'email fullName');
    if (!org) return sendError(res, 404, 'Organization not found');
    return sendSuccess(res, 200, 'Organization retrieved', org);
  } catch (err) {
    next(err);
  }
};

exports.createOrganizationProfile = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return sendError(res, 400, 'Validation failed', errors.array());

    const existing = await Organization.findOne({ user: req.user._id });
    if (existing) return sendError(res, 409, 'Organization profile already exists');

    const org = await Organization.create({ ...req.body, user: req.user._id });
    return sendSuccess(res, 201, 'Organization profile created', org);
  } catch (err) {
    next(err);
  }
};

exports.updateOrganizationProfile = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return sendError(res, 400, 'Validation failed', errors.array());

    const allowedFields = ['organizationName', 'description', 'type', 'website', 'contactEmail', 'contactPhone', 'address', 'country', 'socialLinks'];
    const updates = {};
    allowedFields.forEach((f) => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

    const org = await Organization.findOneAndUpdate({ user: req.user._id }, updates, { new: true, runValidators: true });
    if (!org) return sendError(res, 404, 'Organization profile not found');

    return sendSuccess(res, 200, 'Organization profile updated', org);
  } catch (err) {
    next(err);
  }
};

exports.uploadLogo = async (req, res, next) => {
  try {
    if (!req.file) return sendError(res, 400, 'No image file provided');

    const org = await Organization.findOne({ user: req.user._id });
    if (!org) return sendError(res, 404, 'Organization profile not found');

    if (org.logo?.publicId) await deleteFile(org.logo.publicId);

    const { url, publicId } = await uploadImage(req.file.buffer, 'opportunity-hub/logos');
    org.logo = { url, publicId };
    await org.save();

    return sendSuccess(res, 200, 'Logo uploaded', { logo: org.logo });
  } catch (err) {
    next(err);
  }
};

exports.getMyOrganizationProfile = async (req, res, next) => {
  try {
    const org = await Organization.findOne({ user: req.user._id });
    if (!org) return sendError(res, 404, 'Organization profile not found. Please create one first.');
    return sendSuccess(res, 200, 'Organization profile retrieved', org);
  } catch (err) {
    next(err);
  }
};

exports.getDashboardStats = async (req, res, next) => {
  try {
    const org = await Organization.findOne({ user: req.user._id });
    if (!org) return sendError(res, 404, 'Organization profile not found');

    const [totalOpps, activeOpps, totalApplicants, recentApplications] = await Promise.all([
      Opportunity.countDocuments({ organization: org._id }),
      Opportunity.countDocuments({ organization: org._id, status: 'active' }),
      Application.countDocuments({ opportunity: { $in: await Opportunity.find({ organization: org._id }).distinct('_id') } }),
      Application.find({ opportunity: { $in: await Opportunity.find({ organization: org._id }).distinct('_id') } })
        .populate('applicant', 'fullName email profilePicture')
        .populate('opportunity', 'title category')
        .sort('-createdAt').limit(5),
    ]);

    return sendSuccess(res, 200, 'Dashboard stats', {
      totalOpportunities: totalOpps,
      activeOpportunities: activeOpps,
      totalApplicants,
      recentApplications,
      organization: org,
    });
  } catch (err) {
    next(err);
  }
};
