const mongoose = require('mongoose');
const Reservation = require('../models/Reservation');
const User = require('../models/User');
const { sendSuccess, sendError } = require('../utils/responseHandler');

// @desc    Create reservation
// @route   POST /api/reservations
// @access  Customer, Admin (Admin can book for another customer)
const createReservation = async (req, res) => {
  try {
    const { date, time, partySize, notes } = req.body;
    
    let customerId = req.user.id;
    if (req.user.role === 'admin' && req.body.customer) {
      if (!mongoose.Types.ObjectId.isValid(req.body.customer)) {
        return sendError(res, 'Invalid customer ID format.', null, 400);
      }
      customerId = req.body.customer;
      
      const customerExists = await User.exists({ _id: customerId });
      if (!customerExists) {
        return sendError(res, 'Customer user not found.', null, 404);
      }
    }

    const normalizedDate = new Date(date);
    normalizedDate.setUTCHours(0, 0, 0, 0);

    const conflict = await Reservation.findOne({
      customer: customerId,
      date: normalizedDate,
      time: time,
      status: { $in: ['Pending', 'Confirmed'] }
    });

    if (conflict) {
      return sendError(res, 'Conflict: An active reservation (Pending/Confirmed) already exists for this date and time.', null, 409);
    }

    const newReservation = new Reservation({
      customer: customerId,
      date: normalizedDate,
      time,
      partySize,
      notes,
      status: 'Pending'
    });

    await newReservation.save();

    return sendSuccess(res, 'Success', newReservation, 201);
  } catch (error) {
    return sendError(res, error.message || 'Error', null, 500);
  }
};

// @desc    Get reservations (with pagination, filtering, sorting)
// @route   GET /api/reservations
// @access  Customer (own), Manager (all), Admin (all)
const getReservations = async (req, res) => {
  try {
    const { status, sort, page = 1, limit = 10 } = req.query;

    const query = {};

    if (req.user.role === 'customer') {
      query.customer = req.user.id;
    }

    // Security check: Validate & sanitize status query input to prevent NoSQL query injection
    const allowedStatuses = ['Pending', 'Confirmed', 'Rejected', 'Cancelled'];
    if (status) {
      if (allowedStatuses.includes(status)) {
        query.status = status;
      } else {
        return sendError(res, `Invalid status filter. Must be one of: ${allowedStatuses.join(', ')}`, null, 400);
      }
    }

    // Security check: Normalize pagination inputs and cap limit
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    // Security check: Whitelist sorting options to avoid arbitrary field manipulation
    const allowedSortFields = ['date', 'time', 'partySize', 'status', 'createdAt'];
    let sortOption = { date: 1, time: 1 };
    if (sort && typeof sort === 'string') {
      const sortField = sort.startsWith('-') ? sort.substring(1) : sort;
      if (allowedSortFields.includes(sortField)) {
        const sortOrder = sort.startsWith('-') ? -1 : 1;
        sortOption = { [sortField]: sortOrder };
      }
    }

    const totalReservations = await Reservation.countDocuments(query);
    const reservations = await Reservation.find(query)
      .populate('customer', 'name email role phone')
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    // Return flat pagination structure to match Manager/Admin frontend expected PaginatedResponse format
    return res.status(200).json({
      success: true,
      data: reservations,
      total: totalReservations,
      page: pageNum,
      pages: Math.ceil(totalReservations / limitNum)
    });
  } catch (error) {
    return sendError(res, error.message || 'Error', null, 500);
  }
};

// @desc    Get reservation by ID
// @route   GET /api/reservations/:id
// @access  Customer (own), Manager (any), Admin (any)
const getReservationById = async (req, res) => {
  try {
    const reservationId = req.params.id;

    // Validate ID to prevent CastError/crash and NoSQL injection
    if (!mongoose.Types.ObjectId.isValid(reservationId)) {
      return sendError(res, 'Invalid reservation ID format.', null, 400);
    }

    const reservation = await Reservation.findById(reservationId)
      .populate('customer', 'name email role phone');

    if (!reservation) {
      return sendError(res, 'Reservation not found.', null, 404);
    }

    // Secure checking of customer ID to prevent crashing if customer field is unpopulated or missing
    const reservationCustomerId = reservation.customer?._id?.toString() || reservation.customer?.toString();
    if (req.user.role === 'customer' && reservationCustomerId !== req.user.id) {
      return sendError(res, 'Access denied. You can only view your own reservations.', null, 403);
    }

    return sendSuccess(res, 'Success', reservation);
  } catch (error) {
    return sendError(res, error.message || 'Error', null, 500);
  }
};

// @desc    Update own reservation details
// @route   PUT /api/reservations/:id
// @access  Customer (own pending only), Admin
const updateReservation = async (req, res) => {
  try {
    const reservationId = req.params.id;
    const { date, time, partySize, notes } = req.body;

    if (!mongoose.Types.ObjectId.isValid(reservationId)) {
      return sendError(res, 'Invalid reservation ID format.', null, 400);
    }

    const reservation = await Reservation.findById(reservationId);
    if (!reservation) {
      return sendError(res, 'Reservation not found.', null, 404);
    }

    // Authorization check
    const reservationCustomerId = reservation.customer?._id?.toString() || reservation.customer?.toString();
    if (req.user.role === 'customer' && reservationCustomerId !== req.user.id) {
      return sendError(res, 'Access denied. You can only edit your own reservations.', null, 403);
    }

    // Strict validation: Customers can only edit details if reservation is still Pending
    if (req.user.role === 'customer' && reservation.status !== 'Pending') {
      return sendError(res, 'Only pending reservations can be modified.', null, 400);
    }

    // Apply updates
    if (date !== undefined) {
      const normalizedDate = new Date(date);
      normalizedDate.setUTCHours(0, 0, 0, 0);
      reservation.date = normalizedDate;
    }
    if (time !== undefined) reservation.time = time;
    if (partySize !== undefined) reservation.partySize = partySize;
    if (notes !== undefined) reservation.notes = notes;
    
    if (req.body.status !== undefined) {
      if (req.user.role === 'customer' && req.body.status !== 'Cancelled') {
        return sendError(res, 'Customers can only transition status to Cancelled.', null, 400);
      }
      reservation.status = req.body.status;
    }

    // Check conflict for new slot if date/time are modified
    if (date !== undefined || time !== undefined) {
      const conflict = await Reservation.findOne({
        _id: { $ne: reservationId },
        customer: reservationCustomerId,
        date: reservation.date,
        time: reservation.time,
        status: { $in: ['Pending', 'Confirmed'] }
      });
      if (conflict) {
        return sendError(res, 'Conflict: An active reservation already exists for the updated date and time.', null, 409);
      }
    }

    await reservation.save();
    await reservation.populate('customer', 'name email role phone');

    return sendSuccess(res, 'Success', reservation);
  } catch (error) {
    return sendError(res, error.message || 'Error', null, 500);
  }
};

// @desc    Update reservation status (confirm/reject/cancel)
// @route   PUT /api/reservations/:id/status
// @access  Manager, Admin
const updateReservationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const reservationId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(reservationId)) {
      return sendError(res, 'Invalid reservation ID format.', null, 400);
    }

    const reservation = await Reservation.findById(reservationId);
    if (!reservation) {
      return sendError(res, 'Reservation not found.', null, 404);
    }

    // Strict validation: Cannot transition from Cancelled
    if (reservation.status === 'Cancelled') {
      return sendError(res, 'Cannot change the status of a cancelled reservation.', null, 400);
    }

    reservation.status = status;
    await reservation.save();
    await reservation.populate('customer', 'name email role phone');

    return sendSuccess(res, 'Success', reservation);
  } catch (error) {
    return sendError(res, error.message || 'Error', null, 500);
  }
};

// @desc    Delete reservation
// @route   DELETE /api/reservations/:id
// @access  Admin
const deleteReservation = async (req, res) => {
  try {
    const reservationId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(reservationId)) {
      return sendError(res, 'Invalid reservation ID format.', null, 400);
    }

    const reservation = await Reservation.findByIdAndDelete(reservationId);
    if (!reservation) {
      return sendError(res, 'Reservation not found.', null, 404);
    }

    return sendSuccess(res, 'Reservation deleted successfully.', {});
  } catch (error) {
    return sendError(res, error.message || 'Error', null, 500);
  }
};

module.exports = {
  createReservation,
  getReservations,
  getReservationById,
  updateReservation,
  updateReservationStatus,
  deleteReservation
};
