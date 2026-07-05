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
  authenticateJWT,
  authorizeRoles
} = require('../middlewares/auth');

const {
  validateCreateReservation,
  validateUpdateReservation,
  validateUpdateReservationStatus
} = require('../validators/reservation.validator');

// TEMPORARY: auth disabled for local testing
const bypassAuth = (req, res, next) => {
  req.user = {
    id: req.headers['x-user-id'] || '60c72b2f9b1d8b2a3c8e4d14',
    role: req.headers['x-user-role'] || 'admin'
  };
  next();
};

// Create a new reservation
router.post(
  '/',
  // TEMPORARY: auth disabled for local testing
  // authenticateJWT,
  // authorizeRoles('customer', 'admin'),
  bypassAuth,
  validateCreateReservation,
  createReservation
);

// View reservations list (customer views own, manager & admin view all)
router.get(
  '/',
  // TEMPORARY: auth disabled for local testing
  // authenticateJWT,
  // authorizeRoles('customer', 'manager', 'admin'),
  bypassAuth,
  getReservations
);

// View single reservation detail (customer restricted to own, manager & admin can view any)
router.get(
  '/:id',
  // TEMPORARY: auth disabled for local testing
  // authenticateJWT,
  // authorizeRoles('customer', 'manager', 'admin'),
  bypassAuth,
  getReservationById
);

// Edit own reservation (customer can edit if still Pending, admin can edit any)
router.put(
  '/:id',
  // TEMPORARY: auth disabled for local testing
  // authenticateJWT,
  // authorizeRoles('customer', 'admin'),
  bypassAuth,
  validateUpdateReservation,
  updateReservation
);

// Update status of a reservation (manager & admin only)
router.put(
  '/:id/status',
  // TEMPORARY: auth disabled for local testing
  // authenticateJWT,
  // authorizeRoles('manager', 'admin'),
  bypassAuth,
  validateUpdateReservationStatus,
  updateReservationStatus
);

// Delete a reservation (admin only)
router.delete(
  '/:id',
  // TEMPORARY: auth disabled for local testing
  // authenticateJWT,
  // authorizeRoles('admin'),
  bypassAuth,
  deleteReservation
);

module.exports = router;
