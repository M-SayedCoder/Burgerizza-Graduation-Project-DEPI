const mongoose = require('mongoose');

const isDateValidAndFuture = (dateStr) => {
  const dateObj = new Date(dateStr);
  if (isNaN(dateObj.getTime())) {
    return false;
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const reservationDate = new Date(dateObj);
  reservationDate.setHours(0, 0, 0, 0);
  
  return reservationDate >= today;
};

const isTimeValid = (timeStr) => {
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  return timeRegex.test(timeStr);
};

const validateCreateReservation = (req, res, next) => {
  const { date, time, partySize } = req.body;

  if (!date) {
    return res.status(400).json({
      success: false,
      message: 'Date is required.'
    });
  }

  if (!isDateValidAndFuture(date)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid date. Date must be today or in the future.'
    });
  }

  if (!time) {
    return res.status(400).json({
      success: false,
      message: 'Time is required.'
    });
  }

  if (!isTimeValid(time)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid time format. Use HH:MM (24-hour format, e.g., 19:30).'
    });
  }

  if (partySize === undefined) {
    return res.status(400).json({
      success: false,
      message: 'Party size is required.'
    });
  }

  if (typeof partySize !== 'number' || partySize <= 0 || !Number.isInteger(partySize)) {
    return res.status(400).json({
      success: false,
      message: 'Party size must be a positive integer.'
    });
  }

  next();
};

const validateUpdateReservation = (req, res, next) => {
  const { date, time, partySize } = req.body;

  if (date !== undefined && !isDateValidAndFuture(date)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid date. Date must be today or in the future.'
    });
  }

  if (time !== undefined && !isTimeValid(time)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid time format. Use HH:MM (24-hour format, e.g., 19:30).'
    });
  }

  if (partySize !== undefined && (typeof partySize !== 'number' || partySize <= 0 || !Number.isInteger(partySize))) {
    return res.status(400).json({
      success: false,
      message: 'Party size must be a positive integer.'
    });
  }

  next();
};

const validateUpdateReservationStatus = (req, res, next) => {
  const { status } = req.body;
  const allowedStatuses = ['Pending', 'Confirmed', 'Rejected', 'Cancelled'];

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
  validateCreateReservation,
  validateUpdateReservation,
  validateUpdateReservationStatus
};
