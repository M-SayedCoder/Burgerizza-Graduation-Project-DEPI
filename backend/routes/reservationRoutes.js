const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/auth');
const {
  createReservation,
  getReservations,
  getReservationById,
  updateReservation,
  updateReservationStatus,
  deleteReservation
} = require('../controllers/reservationController');
const {
  validateCreateReservation,
  validateUpdateReservation,
  validateUpdateReservationStatus
} = require('../validators/reservation.validator');

// Create reservation (customer & admin)
router.post('/', protect, authorize('customer', 'admin'), validateCreateReservation, createReservation);

// Get list (customer views own, manager & admin view all)
router.get('/', protect, authorize('customer', 'manager', 'admin'), getReservations);

// Get single detail
router.get('/:id', protect, authorize('customer', 'manager', 'admin'), getReservationById);

// Update details (customer own pending, admin any)
router.put('/:id', protect, authorize('customer', 'admin'), validateUpdateReservation, updateReservation);

// Update status (manager & admin)
router.put('/:id/status', protect, authorize('manager', 'admin'), validateUpdateReservationStatus, updateReservationStatus);

// Delete reservation (admin only)
router.delete('/:id', protect, authorize('admin'), deleteReservation);

module.exports = router;
