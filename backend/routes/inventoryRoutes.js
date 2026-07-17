const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/auth');
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
  validateCreateInventory,
  validateUpdateInventory
} = require('../validators/inventory.validator');

// Get low stock warnings (admin & manager)
router.get('/low-stock', protect, authorize('admin', 'manager'), getLowStockItems);

// Get items (admin & manager)
router.get('/', protect, authorize('admin', 'manager'), getInventoryItems);

// Get detail (admin & manager)
router.get('/:id', protect, authorize('admin', 'manager'), getInventoryItemById);

// Create item (admin only)
router.post('/', protect, authorize('admin'), validateCreateInventory, createInventory);

// Update item (admin only)
router.put('/:id', protect, authorize('admin'), validateUpdateInventory, updateInventory);

// Soft delete / deactivate (admin only)
router.delete('/:id', protect, authorize('admin'), deleteInventory);

// Restore / reactivate (admin only)
router.patch('/:id/restore', protect, authorize('admin'), restoreInventory);

module.exports = router;
