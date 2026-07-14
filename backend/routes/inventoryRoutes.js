const express = require('express');
const router = express.Router();

const {
  createInventory,
  getInventoryItems,
  getInventoryItemById,
  updateInventory,
  deleteInventory,
  restoreInventory,
  getLowStockItems
} = require('../controllers/inventoryController');

const {
  bypassAuth,
  authorizeRoles
} = require('../middlewares/auth');

const {
  validateCreateInventory,
  validateUpdateInventory
} = require('../validators/inventory.validator');

// View low stock items list (Admin and Manager/Employee only)
router.get(
  '/low-stock',
  bypassAuth,
  authorizeRoles('admin', 'manager'),
  getLowStockItems
);

// View list of inventory items (Admin and Manager/Employee only)
router.get(
  '/',
  bypassAuth,
  authorizeRoles('admin', 'manager'),
  getInventoryItems
);

// View single inventory item detail (Admin and Manager/Employee only)
router.get(
  '/:id',
  bypassAuth,
  authorizeRoles('admin', 'manager'),
  getInventoryItemById
);

// Create a new inventory item (Admin only)
router.post(
  '/',
  bypassAuth,
  authorizeRoles('admin'),
  validateCreateInventory,
  createInventory
);

// Edit an inventory item (Admin only)
router.put(
  '/:id',
  bypassAuth,
  authorizeRoles('admin'),
  validateUpdateInventory,
  updateInventory
);

// Soft delete an inventory item (Admin only)
router.delete(
  '/:id',
  bypassAuth,
  authorizeRoles('admin'),
  deleteInventory
);

// Restore a soft deleted inventory item (Admin only)
router.patch(
  '/:id/restore',
  bypassAuth,
  authorizeRoles('admin'),
  restoreInventory
);

module.exports = router;
