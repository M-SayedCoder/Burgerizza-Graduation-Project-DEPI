const express = require('express');
const router = express.Router();

const {
  getDashboardData,
  getStats,
  getOrdersSummary,
  getReservationsSummary
} = require('../controllers/adminController');

const {
  authenticateJWT,
  authorizeRoles
} = require('../middlewares/auth');

// Apply admin protection to all routes in this router
// TEMPORARY: auth disabled for local testing
// router.use(authenticateJWT);
// router.use(authorizeRoles('admin'));

// Admin Dashboard stats
router.get('/dashboard', getDashboardData);

// Analytical daily stats
router.get('/stats', getStats);

// Detailed Orders Summary
router.get('/orders-summary', getOrdersSummary);

// Detailed Reservations Summary
router.get('/reservations-summary', getReservationsSummary);

module.exports = router;
