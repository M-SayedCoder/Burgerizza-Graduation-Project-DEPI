const MenuItem = require('../models/MenuItem');
const { sendSuccess, sendError } = require('../utils/responseHandler');

exports.getMenuItems = async (req, res) => {
  try {
    const { page, limit, search, category, sort } = req.query;
    console.log('DEBUG backend getMenuItems req.query:', req.query);

    const query = {};

    if (search) {
      query.name = { $regex: search.trim(), $options: 'i' };
    }

    if (category && category !== 'all' && category !== '') {
      query.category = category;
    }

    let sortOption = { createdAt: -1 };
    if (sort) {
      const sortField = sort.startsWith('-') ? sort.substring(1) : sort;
      const sortOrder = sort.startsWith('-') ? -1 : 1;
      sortOption = { [sortField]: sortOrder };
    }

    // Check if pagination parameters are provided
    if (page || limit) {
      const pageNum = Math.max(1, parseInt(page, 10) || 1);
      const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
      const skip = (pageNum - 1) * limitNum;

      const totalItems = await MenuItem.countDocuments(query);
      const items = await MenuItem.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum);

      return res.status(200).json({
        success: true,
        data: items,
        total: totalItems,
        page: pageNum,
        pages: Math.ceil(totalItems / limitNum)
      });
    }

    // Default to return all items if no pagination specified (customer app default)
    const items = await MenuItem.find(query).sort(sortOption);
    
    // Support two response variants: wrapped in object vs array directly
    // Customer app expects { items } inside data, manager app expects array directly.
    // Let's return { items, total: items.length } or support both.
    // To make it fully compatible: we can return array in data AND include a field items for customer compatibility:
    return res.status(200).json({
      success: true,
      message: 'قائمة المنيو',
      data: items, // array directly for manager
      items: items // compatibility fallback for customer
    });

  } catch (err) {
    console.error('getMenuItems Error:', err);
    sendError(res, 'فشل الجلب', 500);
  }
};

exports.getMenuItemById = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return sendError(res, 'غير موجود', 404);
    sendSuccess(res, 'الصنف', item);
  } catch (err) {
    sendError(res, 'فشل الجلب', 500);
  }
};

exports.createMenuItem = async (req, res) => {
  try {
    if (req.file) {
      req.body.imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }
    const { name, description, price, category, imageUrl, isAvailable } = req.body;
    const item = await MenuItem.create({ name, description, price, category, imageUrl, isAvailable });
    sendSuccess(res, 'تم الإضافة', item, 201);
  } catch (err) {
    sendError(res, 'فشل الإضافة', 500);
  }
};

exports.updateMenuItem = async (req, res) => {
  try {
    if (req.file) {
      req.body.imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }
    const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return sendError(res, 'غير موجود', 404);
    sendSuccess(res, 'تم التحديث', item);
  } catch (err) {
    sendError(res, 'فشل التحديث', 500);
  }
};

exports.deleteMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    if (!item) return sendError(res, 'غير موجود', 404);
    sendSuccess(res, 'تم الحذف');
  } catch (err) {
    sendError(res, 'فشل الحذف', 500);
  }
};

exports.toggleAvailability = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return sendError(res, 'غير موجود', 404);
    item.isAvailable = !item.isAvailable;
    await item.save();
    sendSuccess(res, 'تم التبديل', item);
  } catch (err) {
    sendError(res, 'فشل التبديل', 500);
  }
};
