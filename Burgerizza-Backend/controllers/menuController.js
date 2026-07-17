// controllers/menuController.js
const MenuItem = require('../models/MenuItem');
const { sendSuccess, sendError } = require('../utils/responseHandler');

exports.getMenuItems = async (req, res) => {
  try {
    const items = await MenuItem.find().sort({ createdAt: -1 });
    sendSuccess(res, 'قائمة المنيو', { items });
  } catch (err) {
    sendError(res, 'فشل الجلب', 500);
  }
};

exports.getMenuItemById = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return sendError(res, 'غير موجود', 404);
    sendSuccess(res, 'الصنف', { item });
  } catch (err) {
    sendError(res, 'فشل الجلب', 500);
  }
};

exports.createMenuItem = async (req, res) => {
  try {
    const { name, description, price, category, imageUrl, isAvailable } = req.body;
    const item = await MenuItem.create({ name, description, price, category, imageUrl, isAvailable });
    sendSuccess(res, 'تم الإضافة', { item }, 201);
  } catch (err) {
    sendError(res, 'فشل الإضافة', 500);
  }
};

exports.updateMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return sendError(res, 'غير موجود', 404);
    sendSuccess(res, 'تم التحديث', { item });
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
    sendSuccess(res, 'تم التبديل', { item });
  } catch (err) {
    sendError(res, 'فشل التبديل', 500);
  }
};