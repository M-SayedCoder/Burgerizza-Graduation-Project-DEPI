const mongoose = require('mongoose');
const { sendError } = require('../utils/responseHandler');

const validateCreateOrder = (req, res, next) => {
  const { items } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return sendError(res, 'Items array is required and cannot be empty.', null, 400);
  }

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (!item.menuItem || !mongoose.Types.ObjectId.isValid(item.menuItem)) {
      return sendError(res, `Item at index ${i} has an invalid or missing menuItem ID.`, null, 400);
    }
    if (!item.quantity || typeof item.quantity !== 'number' || item.quantity <= 0 || !Number.isInteger(item.quantity)) {
      return sendError(res, `Item at index ${i} must have a positive integer quantity.`, null, 400);
    }
  }

  next();
};

const validateUpdateStatus = (req, res, next) => {
  const { status } = req.body;
  const allowedStatuses = ['Pending', 'Confirmed', 'Preparing', 'Ready', 'Delivered', 'Cancelled'];

  if (!status) {
    return sendError(res, 'Status is required.', null, 400);
  }

  if (!allowedStatuses.includes(status)) {
    return sendError(res, `Invalid status. Must be one of: ${allowedStatuses.join(', ')}`, null, 400);
  }

  next();
};

module.exports = {
  validateCreateOrder,
  validateUpdateStatus
};
