const Notification = require('../models/Notification');
const { sendSuccess, sendError } = require('../utils/responseHandler');

// @desc    Get all notifications
// @route   GET /api/notifications
// @access  Manager, Admin
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    sendSuccess(res, 'Success', notifications);
  } catch (error) {
    sendError(res, error.message || 'Error fetching notifications.', null, 500);
  }
};

// @desc    Mark specific notification as read
// @route   PUT /api/notifications/:id/read
// @access  Manager, Admin
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    if (!notification) {
      return sendError(res, 'Notification not found.', null, 404);
    }
    sendSuccess(res, 'Success', notification);
  } catch (error) {
    sendError(res, error.message || 'Error marking notification as read.', null, 500);
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Manager, Admin
exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ isRead: false }, { isRead: true });
    sendSuccess(res, 'Success');
  } catch (error) {
    sendError(res, error.message || 'Error marking all notifications as read.', null, 500);
  }
};

// @desc    Delete a notification
// @route   DELETE /api/notifications/:id
// @access  Manager, Admin
exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);
    if (!notification) {
      return sendError(res, 'Notification not found.', null, 404);
    }
    sendSuccess(res, 'Success');
  } catch (error) {
    sendError(res, error.message || 'Error deleting notification.', null, 500);
  }
};

// @desc    Clear all notifications
// @route   DELETE /api/notifications
// @access  Manager, Admin
exports.clearAllNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({});
    sendSuccess(res, 'Success');
  } catch (error) {
    sendError(res, error.message || 'Error clearing notifications.', null, 500);
  }
};
