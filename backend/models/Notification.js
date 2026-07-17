const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['order', 'reservation', 'system', 'alert'],
    required: true
  },
  isRead: {
    type: Boolean,
    default: false
  },
  link: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Notification', notificationSchema);
