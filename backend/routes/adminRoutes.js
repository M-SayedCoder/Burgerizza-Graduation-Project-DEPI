const express = require('express');
const router = express.Router();

const {
  getDashboardData,
  getStats,
  getOrdersSummary,
  getReservationsSummary
} = require('../controllers/adminController');

const {
  bypassAuth,
  authorizeRoles
} = require('../middlewares/auth');

// Apply admin protection to all routes in this router (secured bypass for local tests)
router.use(bypassAuth);
router.use(authorizeRoles('admin'));

// Admin Dashboard stats
router.get('/dashboard', getDashboardData);

// Analytical daily stats
router.get('/stats', getStats);

// Detailed Orders Summary
router.get('/orders-summary', getOrdersSummary);

// Detailed Reservations Summary
router.get('/reservations-summary', getReservationsSummary);

module.exports = router;
