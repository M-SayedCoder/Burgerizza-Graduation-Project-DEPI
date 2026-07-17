const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, addAddress, deleteAddress } = require('../controllers/profileController');
const { protect } = require('../middlewares/auth');

// All profile actions require JWT authentication
router.use(protect);

router.route('/')
  .get(getProfile)
  .put(updateProfile);

router.post('/addresses', addAddress);
router.delete('/addresses/:id', deleteAddress);

module.exports = router;
