const Notification = require("../models/Notification");
const { sendSuccess, sendError } = require("../utils/response");
const {
  getPaginationParams,
  getPaginationMeta,
} = require("../utils/pagination");
const { emailService } = require("../services/emailService"); // <-- Brevo/SMTP wrapper

// Get notifications
exports.getNotifications = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query);
    const filter = { recipient: req.user._id };
    if (req.query.unread === "true") filter.isRead = false;

    const [total, unreadCount, notifications] = await Promise.all([
      Notification.countDocuments(filter),
      Notification.countDocuments({ recipient: req.user._id, isRead: false }),
      Notification.find(filter).sort("-createdAt").skip(skip).limit(limit),
    ]);

    return sendSuccess(res, 200, "Notifications retrieved", notifications, {
      ...getPaginationMeta(total, page, limit),
      unreadCount,
    });
  } catch (err) {
    next(err);
  }
};

// Mark single notification as read
exports.markAsRead = async (req, res, next) => {
  try {
    await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user._id },
      { isRead: true },
    );
    return sendSuccess(res, 200, "Notification marked as read");
  } catch (err) {
    next(err);
  }
};

// Mark all notifications as read
exports.markAllAsRead = async (req, res, next) => {
  try {
    const result = await Notification.updateMany(
      { recipient: req.user._id, isRead: false },
      { isRead: true },
    );
    return sendSuccess(
      res,
      200,
      `${result.modifiedCount} notifications marked as read`,
    );
  } catch (err) {
    next(err);
  }
};

// Delete notification
exports.deleteNotification = async (req, res, next) => {
  try {
    await Notification.findOneAndDelete({
      _id: req.params.id,
      recipient: req.user._id,
    });
    return sendSuccess(res, 200, "Notification deleted");
  } catch (err) {
    next(err);
  }
};

// 🔔 Create notification + send email (for signup / org verification)
exports.createNotification = async ({ recipient, type, message, link }) => {
  try {
    const notification = await Notification.create({
      recipient,
      type, // e.g. "organization_verification", "signup_welcome"
      message,
      link, // optional: frontend route to redirect user
      isRead: false,
    });

    // Send email alongside notification
    await emailService.sendMail({
      to: recipient.email,
      subject: "Opportunity Hub Notification",
      html: `<p>${message}</p>
             ${link ? `<p><a href="${link}">View details</a></p>` : ""}`,
    });

    return notification;
  } catch (err) {
    console.error("Failed to create notification:", err);
  }
};
