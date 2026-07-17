const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/auth');
const menuController = require('../controllers/menuController');
const { validateMenu } = require('../validators/menu.validator');
const upload = require('../middlewares/upload');

router.get('/', menuController.getMenuItems);
router.get('/:id', menuController.getMenuItemById);
router.post('/', protect, authorize('manager', 'admin'), upload.single('image'), validateMenu, menuController.createMenuItem);
router.put('/:id', protect, authorize('manager', 'admin'), upload.single('image'), validateMenu, menuController.updateMenuItem);
router.delete('/:id', protect, authorize('manager', 'admin'), menuController.deleteMenuItem);

// Support both PUT and PATCH for toggling availability to satisfy frontend & backend specs
router.patch('/:id/toggle', protect, authorize('manager', 'admin'), menuController.toggleAvailability);
router.put('/:id/toggle', protect, authorize('manager', 'admin'), menuController.toggleAvailability);

module.exports = router;
