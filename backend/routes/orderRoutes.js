const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/auth');
const { createOrder, getOrders, getOrderById, updateOrderStatus, deleteOrder } = require('../controllers/orderController');
const { validateCreateOrder, validateUpdateStatus } = require('../validators/order.validator');

// Create order (customer & admin)
router.post('/', protect, authorize('customer', 'admin'), validateCreateOrder, createOrder);

// Get orders list (customer views own, manager & admin view all)
router.get('/', protect, authorize('customer', 'manager', 'admin'), getOrders);

// Get order details
router.get('/:id', protect, authorize('customer', 'manager', 'admin'), getOrderById);

// Update status (manager & admin)
router.put('/:id/status', protect, authorize('manager', 'admin'), validateUpdateStatus, updateOrderStatus);

// Delete order (admin only)
router.delete('/:id', protect, authorize('admin'), deleteOrder);

module.exports = router;
