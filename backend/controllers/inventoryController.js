const mongoose = require('mongoose');
const Inventory = require('../models/Inventory');
const { sendSuccess, sendError } = require('../utils/responseHandler');

// Whitelisted sort fields to prevent NoSQL query injection or arbitrary sorting
const ALLOWED_SORT_FIELDS = Object.freeze(['name', 'quantity', 'minimumStock', 'minQuantity', 'category', 'createdAt']);

// Whitelisted fields for incoming payload sanitization
const ALLOWED_FIELDS = Object.freeze([
  'name',
  'category',
  'unit',
  'quantity',
  'minimumStock',
  'minQuantity',  // Frontend field support
  'costPerUnit',  // Frontend field support
  'supplier',
  'notes',
  'isActive'
]);

// HTTP Status Code Constants
const HTTP_STATUS = Object.freeze({
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
});

// Pagination Defaults and Limits
const PAGINATION_CONFIG = Object.freeze({
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
  MIN_LIMIT: 1,
  RADIX_DECIMAL: 10
});

/**
 * Escape special regex characters.
 */
const escapeRegex = (text) => {
  if (typeof text !== 'string') return '';
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
};

/**
 * Sanitize inventory payload.
 */
const sanitizeInventoryData = (data = {}) => {
  const sanitized = {};
  ALLOWED_FIELDS.forEach(field => {
    if (data[field] !== undefined) {
      const value = data[field];
      sanitized[field] = typeof value === 'string' ? value.trim() : value;
    }
  });
  return sanitized;
};

// @desc    Create new inventory item
// @route   POST /api/inventory
// @access  Admin only
const createInventory = async (req, res) => {
  try {
    const sanitized = sanitizeInventoryData(req.body);

    const exists = await Inventory.exists({ name: sanitized.name });
    if (exists) {
      return sendError(res, `Inventory item with name '${sanitized.name}' already exists.`, null, HTTP_STATUS.BAD_REQUEST);
    }

    const newItem = new Inventory(sanitized);
    await newItem.save();

    return sendSuccess(res, 'Inventory item created successfully.', newItem, HTTP_STATUS.CREATED);
  } catch (error) {
    return sendError(res, error.message || 'Error creating inventory item.', null, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

// @desc    Get all inventory items
// @route   GET /api/inventory
// @access  Admin, Manager
const getInventoryItems = async (req, res) => {
  try {
    const { category, sort, page, limit, search, isActive } = req.query;

    const query = {};

    // Filter by active status
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    } else {
      // By default show active items only unless specified otherwise
      query.isActive = true;
    }

    // Filter by category
    if (category && typeof category === 'string' && category.trim() !== '') {
      query.category = category.trim();
    }

    // Search by name or supplier
    if (search && typeof search === 'string' && search.trim() !== '') {
      const escaped = escapeRegex(search.trim());
      query.$or = [
        { name: { $regex: escaped, $options: 'i' } },
        { supplier: { $regex: escaped, $options: 'i' } }
      ];
    }

    // Pagination setup
    const pageNum = Math.max(PAGINATION_CONFIG.DEFAULT_PAGE, parseInt(page, PAGINATION_CONFIG.RADIX_DECIMAL) || PAGINATION_CONFIG.DEFAULT_PAGE);
    const limitNum = Math.max(PAGINATION_CONFIG.MIN_LIMIT, Math.min(PAGINATION_CONFIG.MAX_LIMIT, parseInt(limit, PAGINATION_CONFIG.RADIX_DECIMAL) || PAGINATION_CONFIG.DEFAULT_LIMIT));
    const skip = (pageNum - 1) * limitNum;

    // Sorting setup
    let sortOption = { createdAt: -1 };
    if (sort && typeof sort === 'string') {
      const sortField = sort.startsWith('-') ? sort.substring(1) : sort;
      if (ALLOWED_SORT_FIELDS.includes(sortField)) {
        const sortOrder = sort.startsWith('-') ? -1 : 1;
        sortOption = { [sortField]: sortOrder };
      }
    }

    const totalItems = await Inventory.countDocuments(query);
    const items = await Inventory.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    // Return flat pagination structure to match Manager/Admin frontend expected PaginatedResponse format
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      data: items,
      total: totalItems,
      page: pageNum,
      pages: Math.ceil(totalItems / limitNum)
    });
  } catch (error) {
    return sendError(res, error.message || 'Error fetching inventory items.', null, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

// @desc    Get inventory item by ID
// @route   GET /api/inventory/:id
// @access  Admin, Manager
const getInventoryItemById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 'Invalid ID format.', null, HTTP_STATUS.BAD_REQUEST);
    }

    const item = await Inventory.findById(id);
    if (!item) {
      return sendError(res, 'Inventory item not found.', null, HTTP_STATUS.NOT_FOUND);
    }

    return sendSuccess(res, 'Success', item, HTTP_STATUS.OK);
  } catch (error) {
    return sendError(res, error.message || 'Error fetching inventory item.', null, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

// @desc    Update inventory item
// @route   PUT /api/inventory/:id
// @access  Admin only
const updateInventory = async (req, res) => {
  try {
    const { id } = req.params;
    const sanitized = sanitizeInventoryData(req.body);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 'Invalid ID format.', null, HTTP_STATUS.BAD_REQUEST);
    }

    if (sanitized.name) {
      const conflict = await Inventory.findOne({ name: sanitized.name, _id: { $ne: id } });
      if (conflict) {
        return sendError(res, `Inventory item with name '${sanitized.name}' already exists.`, null, HTTP_STATUS.BAD_REQUEST);
      }
    }

    const updatedItem = await Inventory.findByIdAndUpdate(
      id,
      { $set: sanitized },
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return sendError(res, 'Inventory item not found.', null, HTTP_STATUS.NOT_FOUND);
    }

    return sendSuccess(res, 'Inventory item updated successfully.', updatedItem, HTTP_STATUS.OK);
  } catch (error) {
    return sendError(res, error.message || 'Error updating inventory item.', null, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

// @desc    Soft delete / Deactivate inventory item
// @route   DELETE /api/inventory/:id
// @access  Admin only
const deleteInventory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 'Invalid ID format.', null, HTTP_STATUS.BAD_REQUEST);
    }

    const deactivatedItem = await Inventory.findByIdAndUpdate(
      id,
      { $set: { isActive: false } },
      { new: true }
    );

    if (!deactivatedItem) {
      return sendError(res, 'Inventory item not found.', null, HTTP_STATUS.NOT_FOUND);
    }

    return sendSuccess(res, 'Inventory item deactivated successfully.', deactivatedItem, HTTP_STATUS.OK);
  } catch (error) {
    return sendError(res, error.message || 'Error deactivating inventory item.', null, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

// @desc    Restore / Reactivate inventory item
// @route   PATCH /api/inventory/:id/restore
// @access  Admin only
const restoreInventory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 'Invalid ID format.', null, HTTP_STATUS.BAD_REQUEST);
    }

    const reactivatedItem = await Inventory.findByIdAndUpdate(
      id,
      { $set: { isActive: true } },
      { new: true }
    );

    if (!reactivatedItem) {
      return sendError(res, 'Inventory item not found.', null, HTTP_STATUS.NOT_FOUND);
    }

    return sendSuccess(res, 'Inventory item reactivated successfully.', reactivatedItem, HTTP_STATUS.OK);
  } catch (error) {
    return sendError(res, error.message || 'Error reactivating inventory item.', null, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

// @desc    Get low stock items
// @route   GET /api/inventory/low-stock
// @access  Admin, Manager
const getLowStockItems = async (req, res) => {
  try {
    // Find items where quantity is <= minimumStock and item is active
    const lowStockItems = await Inventory.find({
      isActive: true,
      $expr: { $lte: ['$quantity', '$minimumStock'] }
    });

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      data: lowStockItems
    });
  } catch (error) {
    return sendError(res, error.message || 'Error fetching low stock inventory.', null, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

module.exports = {
  createInventory,
  getInventoryItems,
  getInventoryItemById,
  updateInventory,
  deleteInventory,
  restoreInventory,
  getLowStockItems
};
