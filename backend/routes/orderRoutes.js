const express = require('express');
const router = express.Router();

const { 
  createOrder, 
  getOrders, 
  getOrderById, 
  updateOrderStatus, 
  deleteOrder 
} = require('../controllers/orderController');

const { 
  bypassAuth, 
  authorizeRoles 
} = require('../middlewares/auth');

const { 
  validateCreateOrder, 
  validateUpdateStatus 
} = require('../validators/order.validator');

// Create a new order (customer & admin)
router.post(
  '/', 
  bypassAuth,
  authorizeRoles('customer', 'admin'), 
  validateCreateOrder, 
  createOrder
);

// View list of orders (customer sees own, manager & admin see all)
router.get(
  '/', 
  bypassAuth,
  authorizeRoles('customer', 'manager', 'admin'), 
  getOrders
);

// View single order detail (customer sees own, manager & admin see any)
router.get(
  '/:id', 
  bypassAuth,
  authorizeRoles('customer', 'manager', 'admin'), 
  getOrderById
);

// Update order status (manager & admin only)
router.put(
  '/:id/status', 
  bypassAuth,
  authorizeRoles('manager', 'admin'), 
  validateUpdateStatus, 
  updateOrderStatus
);

// Delete an order (admin only)
router.delete(
  '/:id', 
  bypassAuth,
  authorizeRoles('admin'), 
  deleteOrder
);

module.exports = router;
