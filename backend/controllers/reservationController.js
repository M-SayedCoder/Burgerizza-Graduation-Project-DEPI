const Reservation = require('../models/Reservation');
const User = require('../models/User');

// @desc    Create reservation
// @route   POST /api/reservations
// @access  Customer, Admin (Admin can book for another customer)
const createReservation = async (req, res) => {
  try {
    const { date, time, partySize, notes } = req.body;
    
    let customerId = req.user.id;
    if (req.user.role === 'admin' && req.body.customer) {
      customerId = req.body.customer;
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
      return res.status(409).json({
        success: false,
        message: 'Conflict: An active reservation (Pending/Confirmed) already exists for this date and time.'
      });
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

    return res.status(201).json({
      success: true,
      message: 'Success',
      data: newReservation
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error'
    });
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

    if (status) {
      query.status = status;
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    let sortOption = { date: 1, time: 1 };
    if (sort) {
      const sortField = sort.startsWith('-') ? sort.substring(1) : sort;
      const sortOrder = sort.startsWith('-') ? -1 : 1;
      sortOption = { [sortField]: sortOrder };
    }

    const totalReservations = await Reservation.countDocuments(query);
    const reservations = await Reservation.find(query)
      .populate('customer', 'name email role')
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    return res.status(200).json({
      success: true,
      message: 'Success',
      data: {
        reservations,
        pagination: {
          total: totalReservations,
          page: pageNum,
          limit: limitNum,
          pages: Math.ceil(totalReservations / limitNum)
        }
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error'
    });
  }
};

// @desc    Get reservation by ID
// @route   GET /api/reservations/:id
// @access  Customer (own), Manager (any), Admin (any)
const getReservationById = async (req, res) => {
  try {
    const reservationId = req.params.id;
    const reservation = await Reservation.findById(reservationId)
      .populate('customer', 'name email role');

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found.'
      });
    }

    if (req.user.role === 'customer' && reservation.customer._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view your own reservations.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Success',
      data: reservation
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error'
    });
  }
};

// @desc    Update own reservation (Pending status only)
// @route   PUT /api/reservations/:id
// @access  Customer (own), Admin (any)
const updateReservation = async (req, res) => {
  try {
    const reservationId = req.params.id;
    const { date, time, partySize, notes } = req.body;

    const reservation = await Reservation.findById(reservationId);
    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found.'
      });
    }

    if (req.user.role === 'customer' && reservation.customer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only edit your own reservations.'
      });
    }

    if (reservation.status !== 'Pending') {
      return res.status(400).json({
        success: false,
        message: 'Only pending reservations can be modified.'
      });
    }

    const targetDate = date ? new Date(date) : reservation.date;
    if (date) {
      targetDate.setUTCHours(0, 0, 0, 0);
    }
    const targetTime = time || reservation.time;

    if (date || time) {
      const conflict = await Reservation.findOne({
        _id: { $ne: reservationId },
        customer: reservation.customer,
        date: targetDate,
        time: targetTime,
        status: { $in: ['Pending', 'Confirmed'] }
      });

      if (conflict) {
        return res.status(409).json({
          success: false,
          message: 'Conflict: Another active reservation exists at the requested date and time.'
        });
      }
    }

    if (date) reservation.date = targetDate;
    if (time) reservation.time = targetTime;
    if (partySize !== undefined) reservation.partySize = partySize;
    if (notes !== undefined) reservation.notes = notes;

    await reservation.save();

    return res.status(200).json({
      success: true,
      message: 'Success',
      data: reservation
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error'
    });
  }
};

// @desc    Update reservation status
// @route   PUT /api/reservations/:id/status
// @access  Manager, Admin
const updateReservationStatus = async (req, res) => {
  try {
    const reservationId = req.params.id;
    const { status } = req.body;

    const reservation = await Reservation.findById(reservationId);
    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found.'
      });
    }

    reservation.status = status;
    await reservation.save();

    const updatedReservation = await Reservation.findById(reservationId)
      .populate('customer', 'name email role');

    return res.status(200).json({
      success: true,
      message: 'Success',
      data: updatedReservation
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error'
    });
  }
};

// @desc    Delete reservation
// @route   DELETE /api/reservations/:id
// @access  Admin
const deleteReservation = async (req, res) => {
  try {
    const reservationId = req.params.id;
    const reservation = await Reservation.findByIdAndDelete(reservationId);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Success',
      data: {}
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error'
    });
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
