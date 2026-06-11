const User = require('../models/User');
const Organization = require('../models/Organization');
const Opportunity = require('../models/Opportunity');
const Application = require('../models/Application');
const Notification = require('../models/Notification');
const { sendSuccess, sendError } = require('../utils/response');
const { getPaginationParams, getPaginationMeta } = require('../utils/pagination');
const emailService = require('../services/emailService');

exports.getDashboard = async (req, res, next) => {
  try {
    const [totalUsers, totalOrgs, verifiedOrgs, totalOpps, activeOpps, totalApps, pendingApps, recentUsers, pendingOrgs] = await Promise.all([
      User.countDocuments({ isActive: true }),
      Organization.countDocuments({ isActive: true }),
      Organization.countDocuments({ isVerified: true }),
      Opportunity.countDocuments(),
      Opportunity.countDocuments({ status: 'active' }),
      Application.countDocuments(),
      Application.countDocuments({ status: 'pending' }),
      User.find({ isActive: true }).sort('-createdAt').limit(5).select('fullName email role createdAt'),
      Organization.find({ isVerified: false, isActive: true }).populate('user', 'email fullName').limit(5),
    ]);

    const usersByRole = await User.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$role', count: { $sum: 1 } } },
    ]);

    const oppsByCategory = await Opportunity.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    return sendSuccess(res, 200, 'Admin dashboard data', {
      stats: { totalUsers, totalOrgs, verifiedOrgs, totalOpportunities: totalOpps, activeOpportunities: activeOpps, totalApplications: totalApps, pendingApplications: pendingApps },
      usersByRole,
      opportunitiesByCategory: oppsByCategory,
      recentUsers,
      pendingOrganizations: pendingOrgs,
    });
  } catch (err) {
    next(err);
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query);
    const filter = {};
    if (req.query.role) filter.role = req.query.role;
    if (req.query.search) filter.$or = [{ email: { $regex: req.query.search, $options: 'i' } }, { fullName: { $regex: req.query.search, $options: 'i' } }];
    if (req.query.active !== undefined) filter.isActive = req.query.active === 'true';

    const total = await User.countDocuments(filter);
    const users = await User.find(filter).sort('-createdAt').skip(skip).limit(limit);

    return sendSuccess(res, 200, 'Users retrieved', users.map(u => u.toPublicJSON()), getPaginationMeta(total, page, limit));
  } catch (err) {
    next(err);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return sendError(res, 404, 'User not found');
    return sendSuccess(res, 200, 'User retrieved', user.toPublicJSON());
  } catch (err) {
    next(err);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const allowedFields = ['isActive', 'role', 'isEmailVerified'];
    const updates = {};
    allowedFields.forEach((f) => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!user) return sendError(res, 404, 'User not found');
    return sendSuccess(res, 200, 'User updated', user.toPublicJSON());
  } catch (err) {
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { isActive: false });
    return sendSuccess(res, 200, 'User deactivated');
  } catch (err) {
    next(err);
  }
};

exports.getOrganizations = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query);
    const filter = {};
    if (req.query.verified !== undefined) filter.isVerified = req.query.verified === 'true';
    if (req.query.type) filter.type = req.query.type;

    const total = await Organization.countDocuments(filter);
    const orgs = await Organization.find(filter).populate('user', 'email fullName createdAt').sort('-createdAt').skip(skip).limit(limit);

    return sendSuccess(res, 200, 'Organizations retrieved', orgs, getPaginationMeta(total, page, limit));
  } catch (err) {
    next(err);
  }
};

exports.verifyOrganization = async (req, res, next) => {
  try {
    const org = await Organization.findById(req.params.id).populate('user', 'email fullName');
    if (!org) return sendError(res, 404, 'Organization not found');

    const { action } = req.body; // 'verify' or 'unverify'
    org.isVerified = action !== 'unverify';
    org.verifiedAt = action !== 'unverify' ? new Date() : undefined;
    org.verifiedBy = action !== 'unverify' ? req.user._id : undefined;
    await org.save();

    if (action !== 'unverify') {
      await Notification.create({
        recipient: org.user._id,
        type: 'organization_verified',
        title: 'Organization Verified',
        message: `${org.organizationName} has been verified on Opportunity Hub`,
        data: { organizationId: org._id },
      });
      emailService.sendOrganizationVerifiedEmail(org.user, org.organizationName).catch(console.error);
    }

    return sendSuccess(res, 200, `Organization ${action === 'unverify' ? 'unverified' : 'verified'} successfully`, org);
  } catch (err) {
    next(err);
  }
};

exports.adminGetOpportunities = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query);
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.category) filter.category = req.query.category;

    const total = await Opportunity.countDocuments(filter);
    const opps = await Opportunity.find(filter)
      .populate('organization', 'organizationName isVerified')
      .populate('postedBy', 'email fullName')
      .sort('-createdAt').skip(skip).limit(limit);

    return sendSuccess(res, 200, 'Opportunities retrieved', opps, getPaginationMeta(total, page, limit));
  } catch (err) {
    next(err);
  }
};

exports.updateOpportunityStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const opp = await Opportunity.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!opp) return sendError(res, 404, 'Opportunity not found');
    return sendSuccess(res, 200, 'Opportunity status updated', opp);
  } catch (err) {
    next(err);
  }
};

exports.adminDeleteOpportunity = async (req, res, next) => {
  try {
    await Opportunity.findByIdAndDelete(req.params.id);
    return sendSuccess(res, 200, 'Opportunity deleted');
  } catch (err) {
    next(err);
  }
};

exports.getReports = async (req, res, next) => {
  try {
    const [
      userGrowth,
      applicationsByStatus,
      topOpportunities,
      topOrganizations,
    ] = await Promise.all([
      User.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, count: { $sum: 1 } } },
        { $sort: { '_id.year': -1, '_id.month': -1 } },
        { $limit: 12 },
      ]),
      Application.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Opportunity.find({ status: 'active' }).sort('-applicationCount').limit(5).select('title category applicationCount views').populate('organization', 'organizationName'),
      Organization.aggregate([
        { $lookup: { from: 'opportunities', localField: '_id', foreignField: 'organization', as: 'opportunities' } },
        { $project: { organizationName: 1, opportunityCount: { $size: '$opportunities' } } },
        { $sort: { opportunityCount: -1 } },
        { $limit: 5 },
      ]),
    ]);

    return sendSuccess(res, 200, 'Reports data', { userGrowth, applicationsByStatus, topOpportunities, topOrganizations });
  } catch (err) {
    next(err);
  }
};
