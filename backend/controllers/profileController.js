const User = require('../models/User');
const { sendSuccess, sendError } = require('../utils/responseHandler');

// GET /api/profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return sendError(res, 'User not found', null, 404);
    }
    return sendSuccess(res, 'Profile retrieved successfully', {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      bio: user.bio || '',
      addresses: user.addresses || [],
      createdAt: user.createdAt,
    });
  } catch (error) {
    return sendError(res, error.message, null, 500);
  }
};

// PUT /api/profile
const updateProfile = async (req, res) => {
  try {
    const { name, email, phone, bio } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
      return sendError(res, 'User not found', null, 404);
    }
    
    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email.toLowerCase();
    if (phone !== undefined) user.phone = phone;
    if (bio !== undefined) user.bio = bio;

    await user.save();

    return sendSuccess(res, 'Profile updated successfully', {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      bio: user.bio || '',
      addresses: user.addresses || [],
      createdAt: user.createdAt,
    });
  } catch (error) {
    return sendError(res, error.message, null, 500);
  }
};

// POST /api/profile/addresses
const addAddress = async (req, res) => {
  try {
    const { label, street, postCode, apartment, isDefault } = req.body;
    if (!street) {
      return sendError(res, 'Street address is required', null, 400);
    }
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return sendError(res, 'User not found', null, 404);
    }

    const newAddress = {
      label: label || 'home',
      street,
      postCode,
      apartment,
      isDefault: !!isDefault,
    };

    user.addresses.push(newAddress);
    await user.save();

    // Retrieve the added address with its generated ID
    const addedAddress = user.addresses[user.addresses.length - 1];
    
    // Map _id to id to match customer frontend expectation
    const responseAddress = {
      id: addedAddress._id,
      label: addedAddress.label,
      street: addedAddress.street,
      postCode: addedAddress.postCode,
      apartment: addedAddress.apartment,
      isDefault: addedAddress.isDefault,
    };

    return sendSuccess(res, 'Address added successfully', responseAddress);
  } catch (error) {
    return sendError(res, error.message, null, 500);
  }
};

// DELETE /api/profile/addresses/:id
const deleteAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return sendError(res, 'User not found', null, 404);
    }

    const addressId = req.params.id;
    user.addresses = user.addresses.filter((addr) => addr._id.toString() !== addressId);
    
    await user.save();

    return sendSuccess(res, 'Address deleted successfully');
  } catch (error) {
    return sendError(res, error.message, null, 500);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  addAddress,
  deleteAddress,
};
