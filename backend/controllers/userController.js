const { validationResult } = require('express-validator');
const User = require('../models/User');
const SavedOpportunity = require('../models/SavedOpportunity');
const Notification = require('../models/Notification');
const { sendSuccess, sendError } = require('../utils/response');
const { uploadImage, uploadDocument, deleteFile } = require('../services/uploadService');
const { getPaginationParams, getPaginationMeta } = require('../utils/pagination');

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    return sendSuccess(res, 200, 'Profile retrieved', user.toPublicJSON());
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return sendError(res, 400, 'Validation failed', errors.array());

    const allowedFields = ['fullName', 'gender', 'dateOfBirth', 'countryOfOrigin', 'currentLocation', 'refugeeStatus', 'bio', 'skills', 'languages', 'education'];
    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
    return sendSuccess(res, 200, 'Profile updated successfully', user.toPublicJSON());
  } catch (err) {
    next(err);
  }
};

exports.uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) return sendError(res, 400, 'No image file provided');

    const user = await User.findById(req.user._id);

    // Delete old avatar
    if (user.profilePicture?.publicId) {
      await deleteFile(user.profilePicture.publicId);
    }

    const { url, publicId } = await uploadImage(req.file.buffer, 'opportunity-hub/avatars');
    user.profilePicture = { url, publicId };
    await user.save({ validateBeforeSave: false });

    return sendSuccess(res, 200, 'Profile picture updated', { profilePicture: user.profilePicture });
  } catch (err) {
    next(err);
  }
};

exports.uploadCV = async (req, res, next) => {
  try {
    if (!req.file) return sendError(res, 400, 'No PDF file provided');

    const user = await User.findById(req.user._id);

    // Delete old CV
    if (user.cv?.publicId) {
      await deleteFile(user.cv.publicId, 'raw');
    }

    const { url, publicId, filename } = await uploadDocument(req.file.buffer, req.file.originalname, 'opportunity-hub/cvs');
    user.cv = { url, publicId, filename: req.file.originalname, uploadedAt: new Date() };
    await user.save({ validateBeforeSave: false });

    return sendSuccess(res, 200, 'CV uploaded successfully', { cv: user.cv });
  } catch (err) {
    next(err);
  }
};

exports.deleteCV = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (user.cv?.publicId) {
      await deleteFile(user.cv.publicId, 'raw');
    }
    user.cv = undefined;
    await user.save({ validateBeforeSave: false });
    return sendSuccess(res, 200, 'CV deleted successfully');
  } catch (err) {
    next(err);
  }
};

exports.getSavedOpportunities = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query);
    const total = await SavedOpportunity.countDocuments({ user: req.user._id });
    const saved = await SavedOpportunity.find({ user: req.user._id })
      .populate({ path: 'opportunity', populate: { path: 'organization', select: 'organizationName logo isVerified' } })
      .sort('-createdAt').skip(skip).limit(limit);

    return sendSuccess(res, 200, 'Saved opportunities retrieved', saved, getPaginationMeta(total, page, limit));
  } catch (err) {
    next(err);
  }
};

exports.saveOpportunity = async (req, res, next) => {
  try {
    const { opportunityId } = req.params;
    const existing = await SavedOpportunity.findOne({ user: req.user._id, opportunity: opportunityId });
    if (existing) return sendError(res, 409, 'Opportunity already saved');

    await SavedOpportunity.create({ user: req.user._id, opportunity: opportunityId });
    return sendSuccess(res, 201, 'Opportunity saved');
  } catch (err) {
    next(err);
  }
};

exports.unsaveOpportunity = async (req, res, next) => {
  try {
    await SavedOpportunity.findOneAndDelete({ user: req.user._id, opportunity: req.params.opportunityId });
    return sendSuccess(res, 200, 'Opportunity removed from saved');
  } catch (err) {
    next(err);
  }
};

exports.getNotifications = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query);
    const total = await Notification.countDocuments({ recipient: req.user._id });
    const unreadCount = await Notification.countDocuments({ recipient: req.user._id, isRead: false });
    const notifications = await Notification.find({ recipient: req.user._id })
      .sort('-createdAt').skip(skip).limit(limit);

    return sendSuccess(res, 200, 'Notifications retrieved', notifications, { ...getPaginationMeta(total, page, limit), unreadCount });
  } catch (err) {
    next(err);
  }
};

exports.markNotificationRead = async (req, res, next) => {
  try {
    await Notification.findOneAndUpdate({ _id: req.params.id, recipient: req.user._id }, { isRead: true });
    return sendSuccess(res, 200, 'Notification marked as read');
  } catch (err) {
    next(err);
  }
};

exports.markAllNotificationsRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ recipient: req.user._id, isRead: false }, { isRead: true });
    return sendSuccess(res, 200, 'All notifications marked as read');
  } catch (err) {
    next(err);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return sendError(res, 400, 'Validation failed', errors.array());

    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.comparePassword(req.body.currentPassword);
    if (!isMatch) return sendError(res, 401, 'Current password is incorrect');

    user.password = req.body.newPassword;
    user.refreshToken = undefined;
    await user.save();

    return sendSuccess(res, 200, 'Password changed successfully');
  } catch (err) {
    next(err);
  }
};

exports.deleteAccount = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { isActive: false });
    return sendSuccess(res, 200, 'Account deactivated successfully');
  } catch (err) {
    next(err);
  }
};
