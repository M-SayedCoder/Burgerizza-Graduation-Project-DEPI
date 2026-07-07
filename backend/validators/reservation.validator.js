const mongoose = require('mongoose');
const { sendError } = require('../utils/responseHandler');

const isDateValidAndFuture = (dateStr) => {
  const dateObj = new Date(dateStr);
  if (isNaN(dateObj.getTime())) {
    return false;
  }
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  
  const reservationDate = new Date(dateObj);
  reservationDate.setUTCHours(0, 0, 0, 0);
  
  return reservationDate >= today;
};

const isTimeValid = (timeStr) => {
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  return timeRegex.test(timeStr);
};

const validateCreateReservation = (req, res, next) => {
  const { date, time, partySize } = req.body;

  if (!date) {
    return sendError(res, 'Date is required.', null, 400);
  }

  if (!isDateValidAndFuture(date)) {
    return sendError(res, 'Invalid date. Date must be today or in the future.', null, 400);
  }

  if (!time) {
    return sendError(res, 'Time is required.', null, 400);
  }

  if (!isTimeValid(time)) {
    return sendError(res, 'Invalid time format. Use HH:MM (24-hour format, e.g., 19:30).', null, 400);
  }

  if (partySize === undefined) {
    return sendError(res, 'Party size is required.', null, 400);
  }

  if (typeof partySize !== 'number' || partySize <= 0 || !Number.isInteger(partySize)) {
    return sendError(res, 'Party size must be a positive integer.', null, 400);
  }

  next();
};

const validateUpdateReservation = (req, res, next) => {
  const { date, time, partySize } = req.body;

  if (date !== undefined && !isDateValidAndFuture(date)) {
    return sendError(res, 'Invalid date. Date must be today or in the future.', null, 400);
  }

  if (time !== undefined && !isTimeValid(time)) {
    return sendError(res, 'Invalid time format. Use HH:MM (24-hour format, e.g., 19:30).', null, 400);
  }

  if (partySize !== undefined && (typeof partySize !== 'number' || partySize <= 0 || !Number.isInteger(partySize))) {
    return sendError(res, 'Party size must be a positive integer.', null, 400);
  }

  next();
};

const validateUpdateReservationStatus = (req, res, next) => {
  const { status } = req.body;
  const allowedStatuses = ['Pending', 'Confirmed', 'Rejected', 'Cancelled'];

  if (!status) {
    return sendError(res, 'Status is required.', null, 400);
  }

  if (!allowedStatuses.includes(status)) {
    return sendError(res, `Invalid status. Must be one of: ${allowedStatuses.join(', ')}`, null, 400);
  }

  next();
};

module.exports = {
  validateCreateReservation,
  validateUpdateReservation,
  validateUpdateReservationStatus
};
