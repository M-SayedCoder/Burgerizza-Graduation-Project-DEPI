const express = require('express');
const router = express.Router();

const {
  createReservation,
  getReservations,
  getReservationById,
  updateReservation,
  updateReservationStatus,
  deleteReservation
} = require('../controllers/reservationController');

const {
  bypassAuth,
  authorizeRoles
} = require('../middlewares/auth');

const {
  validateCreateReservation,
  validateUpdateReservation,
  validateUpdateReservationStatus
} = require('../validators/reservation.validator');

// Create a new reservation
router.post(
  '/',
  bypassAuth,
  authorizeRoles('customer', 'admin'),
  validateCreateReservation,
  createReservation
);

// View reservations list (customer views own, manager & admin view all)
router.get(
  '/',
  bypassAuth,
  authorizeRoles('customer', 'manager', 'admin'),
  getReservations
);

// View single reservation detail (customer restricted to own, manager & admin can view any)
router.get(
  '/:id',
  bypassAuth,
  authorizeRoles('customer', 'manager', 'admin'),
  getReservationById
);

// Edit own reservation (customer can edit if still Pending, admin can edit any)
router.put(
  '/:id',
  bypassAuth,
  authorizeRoles('customer', 'admin'),
  validateUpdateReservation,
  updateReservation
);

// Update status of a reservation (manager & admin only)
router.put(
  '/:id/status',
  bypassAuth,
  authorizeRoles('manager', 'admin'),
  validateUpdateReservationStatus,
  updateReservationStatus
);

// Delete a reservation (admin only)
router.delete(
  '/:id',
  bypassAuth,
  authorizeRoles('admin'),
  deleteReservation
);

module.exports = router;
