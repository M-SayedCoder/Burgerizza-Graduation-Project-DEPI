const mongoose = require('mongoose');
const Inventory = require('../models/Inventory');
const { sendSuccess, sendError } = require('../utils/responseHandler');

// Whitelisted sort fields to prevent NoSQL query injection or arbitrary sorting
const ALLOWED_SORT_FIELDS = Object.freeze(['name', 'quantity', 'minimumStock', 'category', 'createdAt']);

// Whitelisted fields for incoming payload sanitization
const ALLOWED_FIELDS = Object.freeze([
  'name',
  'category',
  'unit',
  'quantity',
  'minimumStock',
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
 * @param {string} text - The input string to escape
 * @returns {string} safely escaped string
 */
const escapeRegex = (text) => {
  if (typeof text !== 'string') return '';
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
};

/**
 * Sanitize inventory payload.
 * @param {Object} data - Input payload
 * @returns {Object} sanitized payload
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

/**
 * Validate MongoDB ObjectId.
 * @param {string} id - The ID to validate
 * @returns {boolean} true if valid, false otherwise
 */
const validateObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

/**
 * Build MongoDB filters.
 * @param {Object} queryParams - Raw query parameters
 * @returns {Object} sanitized query object
 */
const buildInventoryQuery = (queryParams = {}) => {
  const { category, isActive, lowStock, search } = queryParams;
  const query = {};

  if (category && typeof category === 'string') {
    query.category = category;
  }

  if (isActive !== undefined) {
    if (isActive === 'true') {
      query.isActive = true;
    } else if (isActive === 'false') {
      query.isActive = false;
    }
  }

  if (lowStock === 'true') {
    query.$expr = { $lte: ['$quantity', '$minimumStock'] };
  }

  if (search && typeof search === 'string' && search.trim() !== '') {
    const escapedSearch = escapeRegex(search.trim());
    query.$or = [
      { name: { $regex: escapedSearch, $options: 'i' } },
      { supplier: { $regex: escapedSearch, $options: 'i' } }
    ];
  }

  return query;
};

/**
 * Build pagination values.
 * @param {Object} queryParams - Raw query parameters
 * @returns {Object} Object containing page, limit, and skip values
 */
const buildPagination = (queryParams = {}) => {
  const { page, limit } = queryParams;
  const pageNum = Math.max(
    PAGINATION_CONFIG.DEFAULT_PAGE,
    parseInt(page, PAGINATION_CONFIG.RADIX_DECIMAL) || PAGINATION_CONFIG.DEFAULT_PAGE
  );
  const limitNum = Math.max(
    PAGINATION_CONFIG.MIN_LIMIT,
    Math.min(
      PAGINATION_CONFIG.MAX_LIMIT,
      parseInt(limit, PAGINATION_CONFIG.RADIX_DECIMAL) || PAGINATION_CONFIG.DEFAULT_LIMIT
    )
  );
  const skip = (pageNum - PAGINATION_CONFIG.DEFAULT_PAGE) * limitNum;
  return { page: pageNum, limit: limitNum, skip };
};

/**
 * Check duplicate name (case-insensitive).
 * @param {string} name - The inventory name to check
 * @param {string} [excludeId] - Optional item ID to exclude (used for updates)
 * @returns {Promise<boolean>} true if duplicate exists, false otherwise
 */
const isDuplicateName = async (name, excludeId = null) => {
  if (!name || typeof name !== 'string') return false;
  const trimmedName = name.trim();
  const escapedName = escapeRegex(trimmedName);
  const query = { name: { $regex: new RegExp(`^${escapedName}$`, 'i') } };
  if (excludeId) {
    query._id = { $ne: excludeId };
  }
  const existing = await Inventory.findOne(query).select('_id').lean();
  return !!existing;
};

// @desc    Create new inventory item
// @route   POST /api/inventory
// @access  Private (Manager/Admin)
const createInventory = async (req, res) => {
  try {
    const sanitized = sanitizeInventoryData(req.body);

    if (await isDuplicateName(sanitized.name)) {
      return sendError(res, 'Inventory item with this name already exists.', null, HTTP_STATUS.BAD_REQUEST);
    }

    if (sanitized.isActive === undefined) {
      sanitized.isActive = true;
    }

    const newInventory = new Inventory(sanitized);
    await newInventory.save();
    return sendSuccess(res, 'Success', newInventory, HTTP_STATUS.CREATED);
  } catch (error) {
    if (error.code === 11000) {
      return sendError(res, 'Inventory item with this name already exists.', null, HTTP_STATUS.BAD_REQUEST);
    }
    return sendError(res, error.message || 'Error', null, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

// @desc    Get all inventory items (with filtering, pagination, sorting)
// @route   GET /api/inventory
// @access  Private (Manager/Admin)
const getInventoryItems = async (req, res) => {
  try {
    const { sortBy, order, isActive, lowStock } = req.query;

    if (isActive !== undefined && isActive !== 'true' && isActive !== 'false') {
      return sendError(res, 'Invalid isActive filter. Must be true or false.', null, HTTP_STATUS.BAD_REQUEST);
    }
    if (lowStock !== undefined && lowStock !== 'true' && lowStock !== 'false') {
      return sendError(res, 'Invalid lowStock filter. Must be true or false.', null, HTTP_STATUS.BAD_REQUEST);
    }
    if (order !== undefined && order !== 'asc' && order !== 'desc') {
      return sendError(res, 'Invalid sort order. Must be asc or desc.', null, HTTP_STATUS.BAD_REQUEST);
    }

    let sortOption = { createdAt: -1 };
    if (sortBy && typeof sortBy === 'string') {
      if (!ALLOWED_SORT_FIELDS.includes(sortBy)) {
        return sendError(res, `Invalid sort field. Must be one of: ${ALLOWED_SORT_FIELDS.join(', ')}`, null, HTTP_STATUS.BAD_REQUEST);
      }
      const sortOrder = order === 'desc' ? -1 : 1;
      sortOption = { [sortBy]: sortOrder };
    }

    const { page: pageNum, limit: limitNum, skip } = buildPagination(req.query);
    const query = buildInventoryQuery(req.query);

    const [totalItems, items] = await Promise.all([
      Inventory.countDocuments(query),
      Inventory.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum)
        .lean()
    ]);

    return sendSuccess(res, 'Success', {
      inventory: items,
      pagination: {
        total: totalItems,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(totalItems / limitNum)
      }
    });
  } catch (error) {
    return sendError(res, error.message || 'Error', null, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

// @desc    Get inventory item by ID
// @route   GET /api/inventory/:id
// @access  Private (Manager/Admin)
const getInventoryItemById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!validateObjectId(id)) {
      return sendError(res, 'Invalid inventory ID format.', null, HTTP_STATUS.BAD_REQUEST);
    }

    const item = await Inventory.findById(id).lean();
    if (!item) {
      return sendError(res, 'Inventory item not found.', null, HTTP_STATUS.NOT_FOUND);
    }

    return sendSuccess(res, 'Success', item);
  } catch (error) {
    return sendError(res, error.message || 'Error', null, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

// @desc    Update inventory item
// @route   PUT /api/inventory/:id
// @access  Private (Manager/Admin)
const updateInventory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!validateObjectId(id)) {
      return sendError(res, 'Invalid inventory ID format.', null, HTTP_STATUS.BAD_REQUEST);
    }

    const sanitized = sanitizeInventoryData(req.body);

    if (sanitized.name !== undefined && await isDuplicateName(sanitized.name, id)) {
      return sendError(res, 'Inventory item with this name already exists.', null, HTTP_STATUS.BAD_REQUEST);
    }

    const updatedItem = await Inventory.findByIdAndUpdate(
      id,
      { $set: sanitized },
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return sendError(res, 'Inventory item not found.', null, HTTP_STATUS.NOT_FOUND);
    }

    return sendSuccess(res, 'Success', updatedItem);
  } catch (error) {
    if (error.code === 11000) {
      return sendError(res, 'Inventory item with this name already exists.', null, HTTP_STATUS.BAD_REQUEST);
    }
    return sendError(res, error.message || 'Error', null, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

// @desc    Soft delete inventory item (set isActive = false)
// @route   DELETE /api/inventory/:id
// @access  Private (Manager/Admin)
const deleteInventory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!validateObjectId(id)) {
      return sendError(res, 'Invalid inventory ID format.', null, HTTP_STATUS.BAD_REQUEST);
    }

    const item = await Inventory.findById(id);
    if (!item) {
      return sendError(res, 'Inventory item not found.', null, HTTP_STATUS.NOT_FOUND);
    }

    if (!item.isActive) {
      return sendError(res, 'Inventory item is already inactive.', null, HTTP_STATUS.BAD_REQUEST);
    }

    item.isActive = false;
    await item.save();

    return sendSuccess(res, 'Inventory item soft deleted successfully.', item);
  } catch (error) {
    return sendError(res, error.message || 'Error', null, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

// @desc    Restore soft deleted inventory item (set isActive = true)
// @route   PATCH /api/inventory/:id/restore
// @access  Private (Manager/Admin)
const restoreInventory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!validateObjectId(id)) {
      return sendError(res, 'Invalid inventory ID format.', null, HTTP_STATUS.BAD_REQUEST);
    }

    const item = await Inventory.findById(id);
    if (!item) {
      return sendError(res, 'Inventory item not found.', null, HTTP_STATUS.NOT_FOUND);
    }

    if (item.isActive) {
      return sendError(res, 'Inventory item is already active.', null, HTTP_STATUS.BAD_REQUEST);
    }

    item.isActive = true;
    await item.save();

    return sendSuccess(res, 'Inventory item restored successfully.', item);
  } catch (error) {
    return sendError(res, error.message || 'Error', null, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

// @desc    Get low stock items
// @route   GET /api/inventory/low-stock
// @access  Private (Manager/Admin)
const getLowStockItems = async (req, res) => {
  req.query.lowStock = 'true';
  return getInventoryItems(req, res);
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
