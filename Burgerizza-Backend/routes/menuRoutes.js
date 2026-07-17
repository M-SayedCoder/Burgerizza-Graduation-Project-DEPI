const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/auth');
const menuController = require('../controllers/menuController');
const { validateMenu } = require('../validators/menu.validator');

router.get('/', menuController.getMenuItems);
router.get('/:id', menuController.getMenuItemById);
router.post('/', protect, authorize('manager', 'admin'), validateMenu, menuController.createMenuItem);
router.put('/:id', protect, authorize('manager', 'admin'), validateMenu, menuController.updateMenuItem);
router.delete('/:id', protect, authorize('manager', 'admin'), menuController.deleteMenuItem);
router.patch('/:id/toggle', protect, authorize('manager', 'admin'), menuController.toggleAvailability);

module.exports = router;