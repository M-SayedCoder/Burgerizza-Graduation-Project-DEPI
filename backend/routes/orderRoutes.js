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
  authenticateJWT, 
  authorizeRoles 
} = require('../middlewares/auth');

const { 
  validateCreateOrder, 
  validateUpdateStatus 
} = require('../validators/order.validator');

// TEMPORARY: auth disabled for local testing
const bypassAuth = (req, res, next) => {
  req.user = {
    id: req.headers['x-user-id'] || '60c72b2f9b1d8b2a3c8e4d14',
    role: req.headers['x-user-role'] || 'admin'
  };
  next();
};

// Create a new order (customer & admin)
router.post(
  '/', 
  // TEMPORARY: auth disabled for local testing
  // authenticateJWT, 
  // authorizeRoles('customer', 'admin'), 
  bypassAuth,
  validateCreateOrder, 
  createOrder
);

// View list of orders (customer sees own, manager & admin see all)
router.get(
  '/', 
  // TEMPORARY: auth disabled for local testing
  // authenticateJWT, 
  // authorizeRoles('customer', 'manager', 'admin'), 
  bypassAuth,
  getOrders
);

// View single order detail (customer sees own, manager & admin see any)
router.get(
  '/:id', 
  // TEMPORARY: auth disabled for local testing
  // authenticateJWT, 
  // authorizeRoles('customer', 'manager', 'admin'), 
  bypassAuth,
  getOrderById
);

// Update order status (manager & admin only)
router.put(
  '/:id/status', 
  // TEMPORARY: auth disabled for local testing
  // authenticateJWT, 
  // authorizeRoles('manager', 'admin'), 
  bypassAuth,
  validateUpdateStatus, 
  updateOrderStatus
);

// Delete an order (admin only)
router.delete(
  '/:id', 
  // TEMPORARY: auth disabled for local testing
  // authenticateJWT, 
  // authorizeRoles('admin'), 
  bypassAuth,
  deleteOrder
);

module.exports = router;
