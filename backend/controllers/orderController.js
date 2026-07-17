const mongoose = require('mongoose');
const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const User = require('../models/User');
const { sendSuccess, sendError } = require('../utils/responseHandler');

// @desc    Create new order
// @route   POST /api/orders
// @access  Customer, Admin (Admin can create on behalf of any customer if customer ID is provided)
const createOrder = async (req, res) => {
  try {
    const { items } = req.body;
    
    let customerId = req.user.id;
    if (req.user.role === 'admin' && req.body.customer) {
      if (!mongoose.Types.ObjectId.isValid(req.body.customer)) {
        return sendError(res, 'Invalid customer ID format.', null, 400);
      }
      customerId = req.body.customer;
      
      const customerExists = await User.exists({ _id: customerId });
      if (!customerExists) {
        return sendError(res, 'Customer user not found.', null, 404);
      }
    }

    // Optimize DB Performance: Fetch all menu items in a single query
    const menuItemIds = items.map(item => item.menuItem);
    const dbMenuItems = await MenuItem.find({ _id: { $in: menuItemIds } });

    // Store in map for fast lookup
    const menuItemMap = new Map();
    dbMenuItems.forEach(item => {
      menuItemMap.set(item._id.toString(), item);
    });

    const enrichedItems = [];
    let calculatedTotal = 0;

    for (const item of items) {
      const dbMenuItem = menuItemMap.get(item.menuItem.toString());
      if (!dbMenuItem) {
        return sendError(res, `Menu item with ID ${item.menuItem} not found.`, null, 404);
      }
      if (!dbMenuItem.isAvailable) {
        return sendError(res, `Menu item '${dbMenuItem.name}' is currently unavailable.`, null, 400);
      }

      const itemPrice = dbMenuItem.price;
      const itemTotal = itemPrice * item.quantity;
      calculatedTotal += itemTotal;

      enrichedItems.push({
        menuItem: item.menuItem,
        quantity: item.quantity,
        price: itemPrice
      });
    }

    const newOrder = new Order({
      customer: customerId,
      items: enrichedItems,
      total: calculatedTotal,
      status: 'Pending'
    });

    await newOrder.save();

    return sendSuccess(res, 'Success', newOrder, 201);
  } catch (error) {
    return sendError(res, error.message || 'Error', null, 500);
  }
};

// @desc    Get all orders (with filtering, sorting, pagination)
// @route   GET /api/orders
// @access  Customer (own orders), Manager/Admin (all orders)
const getOrders = async (req, res) => {
  try {
    const { status, sort, page = 1, limit = 10, search } = req.query;

    const query = {};

    if (req.user.role === 'customer') {
      query.customer = req.user.id;
    }

    // Security check: Validate & sanitize status query input to prevent NoSQL query injection
    const allowedStatuses = ['Pending', 'Confirmed', 'Preparing', 'Ready', 'Delivered', 'Cancelled'];
    if (status) {
      if (allowedStatuses.includes(status)) {
        query.status = status;
      } else {
        return sendError(res, `Invalid status filter. Must be one of: ${allowedStatuses.join(', ')}`, null, 400);
      }
    }

    // Support searching by customer name or order ID
    if (search && typeof search === 'string' && search.trim() !== '') {
      const searchConditions = [];
      const searchTrimmed = search.trim();

      if (mongoose.Types.ObjectId.isValid(searchTrimmed)) {
        searchConditions.push({ _id: searchTrimmed });
      }

      const matchingUsers = await User.find({ name: { $regex: searchTrimmed, $options: 'i' } }).select('_id');
      const userIds = matchingUsers.map(user => user._id);
      if (userIds.length > 0) {
        searchConditions.push({ customer: { $in: userIds } });
      }

      if (searchConditions.length > 0) {
        query.$or = searchConditions;
      } else {
        query._id = null; // Force empty result if search returns no matches
      }
    }

    // Security check: Normalize pagination inputs and cap limit
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    // Security check: Whitelist sorting options to avoid arbitrary field manipulation
    const allowedSortFields = ['createdAt', 'total', 'status'];
    let sortOption = { createdAt: -1 };
    if (sort && typeof sort === 'string') {
      const sortField = sort.startsWith('-') ? sort.substring(1) : sort;
      if (allowedSortFields.includes(sortField)) {
        const sortOrder = sort.startsWith('-') ? -1 : 1;
        sortOption = { [sortField]: sortOrder };
      }
    }

    const totalOrders = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate('customer', 'name email role phone')
      .populate('items.menuItem', 'name price')
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    // Return flat pagination structure to match Manager/Admin frontend expected PaginatedResponse format
    return res.status(200).json({
      success: true,
      data: orders,
      total: totalOrders,
      page: pageNum,
      pages: Math.ceil(totalOrders / limitNum)
    });
  } catch (error) {
    return sendError(res, error.message || 'Error', null, 500);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Customer (own order), Manager/Admin (any order)
const getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;

    // Validate ID to prevent CastError/crash and NoSQL injection
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return sendError(res, 'Invalid order ID format.', null, 400);
    }

    const order = await Order.findById(orderId)
      .populate('customer', 'name email role phone')
      .populate('items.menuItem', 'name price description');

    if (!order) {
      return sendError(res, 'Order not found.', null, 404);
    }

    // Secure checking of customer ID to prevent crashing if customer field is unpopulated or missing
    const orderCustomerId = order.customer?._id?.toString() || order.customer?.toString();
    if (req.user.role === 'customer' && orderCustomerId !== req.user.id) {
      return sendError(res, 'Access denied. You can only view your own orders.', null, 403);
    }

    return sendSuccess(res, 'Success', order);
  } catch (error) {
    return sendError(res, error.message || 'Error', null, 500);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Manager, Admin
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const orderId = req.params.id;

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return sendError(res, 'Invalid order ID format.', null, 400);
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return sendError(res, 'Order not found.', null, 404);
    }

    order.status = status;
    await order.save();

    // Optimize DB Performance: Populate saved document directly, eliminating the secondary query
    await order.populate([
      { path: 'customer', select: 'name email role phone' },
      { path: 'items.menuItem', select: 'name price' }
    ]);

    return sendSuccess(res, 'Success', order);
  } catch (error) {
    return sendError(res, error.message || 'Error', null, 500);
  }
};

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Admin
const deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.id;

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return sendError(res, 'Invalid order ID format.', null, 400);
    }

    const order = await Order.findByIdAndDelete(orderId);
    if (!order) {
      return sendError(res, 'Order not found.', null, 404);
    }

    return sendSuccess(res, 'Order deleted successfully.', {});
  } catch (error) {
    return sendError(res, error.message || 'Error', null, 500);
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder
};
