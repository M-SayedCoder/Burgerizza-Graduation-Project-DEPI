const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const User = require('../models/User');

// @desc    Create new order
// @route   POST /api/orders
// @access  Customer, Admin (Admin can create on behalf of any customer if customer ID is provided)
const createOrder = async (req, res) => {
  try {
    const { items } = req.body;
    
    let customerId = req.user.id;
    if (req.user.role === 'admin' && req.body.customer) {
      customerId = req.body.customer;
    }

    const enrichedItems = [];
    let calculatedTotal = 0;

    for (const item of items) {
      const dbMenuItem = await MenuItem.findById(item.menuItem);
      if (!dbMenuItem) {
        return res.status(404).json({
          success: false,
          message: `Menu item with ID ${item.menuItem} not found.`
        });
      }
      if (!dbMenuItem.isAvailable) {
        return res.status(400).json({
          success: false,
          message: `Menu item '${dbMenuItem.name}' is currently unavailable.`
        });
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

    return res.status(201).json({
      success: true,
      message: 'Success',
      data: newOrder
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error'
    });
  }
};

// @desc    Get all orders (with filtering, sorting, pagination)
// @route   GET /api/orders
// @access  Customer (own orders), Manager/Admin (all orders)
const getOrders = async (req, res) => {
  try {
    const { status, sort, page = 1, limit = 10 } = req.query;

    const query = {};

    if (req.user.role === 'customer') {
      query.customer = req.user.id;
    }

    if (status) {
      query.status = status;
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    let sortOption = { createdAt: -1 };
    if (sort) {
      const sortField = sort.startsWith('-') ? sort.substring(1) : sort;
      const sortOrder = sort.startsWith('-') ? -1 : 1;
      sortOption = { [sortField]: sortOrder };
    }

    const totalOrders = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate('customer', 'name email role')
      .populate('items.menuItem', 'name price')
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    return res.status(200).json({
      success: true,
      message: 'Success',
      data: {
        orders,
        pagination: {
          total: totalOrders,
          page: pageNum,
          limit: limitNum,
          pages: Math.ceil(totalOrders / limitNum)
        }
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error'
    });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Customer (own order), Manager/Admin (any order)
const getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId)
      .populate('customer', 'name email role')
      .populate('items.menuItem', 'name price description');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.'
      });
    }

    if (req.user.role === 'customer' && order.customer._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view your own orders.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Success',
      data: order
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error'
    });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Manager, Admin
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const orderId = req.params.id;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.'
      });
    }

    order.status = status;
    await order.save();

    const updatedOrder = await Order.findById(orderId)
      .populate('customer', 'name email role')
      .populate('items.menuItem', 'name price');

    return res.status(200).json({
      success: true,
      message: 'Success',
      data: updatedOrder
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error'
    });
  }
};

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Admin
const deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findByIdAndDelete(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Success',
      data: {}
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error'
    });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder
};
