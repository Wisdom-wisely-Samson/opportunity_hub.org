const Notification = require('../models/Notification');
const { sendSuccess, sendError } = require('../utils/response');
const { getPaginationParams, getPaginationMeta } = require('../utils/pagination');

exports.getNotifications = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query);
    const filter = { recipient: req.user._id };
    if (req.query.unread === 'true') filter.isRead = false;

    const [total, unreadCount, notifications] = await Promise.all([
      Notification.countDocuments(filter),
      Notification.countDocuments({ recipient: req.user._id, isRead: false }),
      Notification.find(filter).sort('-createdAt').skip(skip).limit(limit),
    ]);

    return sendSuccess(res, 200, 'Notifications retrieved', notifications, { ...getPaginationMeta(total, page, limit), unreadCount });
  } catch (err) {
    next(err);
  }
};

exports.markAsRead = async (req, res, next) => {
  try {
    await Notification.findOneAndUpdate({ _id: req.params.id, recipient: req.user._id }, { isRead: true });
    return sendSuccess(res, 200, 'Notification marked as read');
  } catch (err) {
    next(err);
  }
};

exports.markAllAsRead = async (req, res, next) => {
  try {
    const result = await Notification.updateMany({ recipient: req.user._id, isRead: false }, { isRead: true });
    return sendSuccess(res, 200, `${result.modifiedCount} notifications marked as read`);
  } catch (err) {
    next(err);
  }
};

exports.deleteNotification = async (req, res, next) => {
  try {
    await Notification.findOneAndDelete({ _id: req.params.id, recipient: req.user._id });
    return sendSuccess(res, 200, 'Notification deleted');
  } catch (err) {
    next(err);
  }
};
