const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/auth');
const {
  getDashboardData,
  getStats,
  getOrdersSummary,
  getReservationsSummary
} = require('../controllers/adminController');

// All endpoints in this route are restricted to admin & manager roles
router.use(protect);
router.use(authorize('admin', 'manager'));

router.get('/dashboard', getDashboardData);
router.get('/stats', getStats);
router.get('/orders-summary', getOrdersSummary);
router.get('/reservations-summary', getReservationsSummary);

module.exports = router;
