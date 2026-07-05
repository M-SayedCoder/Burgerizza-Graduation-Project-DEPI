const mongoose = require('mongoose');

const validateCreateOrder = (req, res, next) => {
  const { items } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Items array is required and cannot be empty.'
    });
  }

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (!item.menuItem || !mongoose.Types.ObjectId.isValid(item.menuItem)) {
      return res.status(400).json({
        success: false,
        message: `Item at index ${i} has an invalid or missing menuItem ID.`
      });
    }
    if (!item.quantity || typeof item.quantity !== 'number' || item.quantity <= 0 || !Number.isInteger(item.quantity)) {
      return res.status(400).json({
        success: false,
        message: `Item at index ${i} must have a positive integer quantity.`
      });
    }
  }

  next();
};

const validateUpdateStatus = (req, res, next) => {
  const { status } = req.body;
  const allowedStatuses = ['Pending', 'Confirmed', 'Preparing', 'Ready', 'Delivered', 'Cancelled'];

  if (!status) {
    return res.status(400).json({
      success: false,
      message: 'Status is required.'
    });
  }

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: `Invalid status. Must be one of: ${allowedStatuses.join(', ')}`
    });
  }

  next();
};

module.exports = {
  validateCreateOrder,
  validateUpdateStatus
};
