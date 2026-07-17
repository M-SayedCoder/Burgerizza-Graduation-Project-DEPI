const Order = require('../models/Order');
const Reservation = require('../models/Reservation');
const User = require('../models/User');
const { sendSuccess, sendError } = require('../utils/responseHandler');

// @desc    Get overall dashboard stats (combining overall and today's metrics)
// @route   GET /api/admin/dashboard
// @access  Admin, Manager
const getDashboardData = async (req, res) => {
  try {
    const startOfToday = new Date();
    startOfToday.setUTCHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setUTCHours(23, 59, 59, 999);

    // 1. Overall Order Facets
    const orderAgg = await Order.aggregate([
      {
        $facet: {
          totalOrders: [{ $count: "count" }],
          revenue: [
            { $match: { status: { $nin: ['Cancelled', 'Pending'] } } },
            { $group: { _id: null, total: { $sum: '$total' } } }
          ],
          pending: [
            { $match: { status: 'Pending' } },
            { $count: "count" }
          ],
          confirmed: [
            { $match: { status: 'Confirmed' } },
            { $count: "count" }
          ],
          cancelled: [
            { $match: { status: 'Cancelled' } },
            { $count: "count" }
          ],
          completed: [
            { $match: { status: 'Delivered' } },
            { $count: "count" }
          ]
        }
      }
    ]);

    const totalOrders = orderAgg[0]?.totalOrders[0]?.count || 0;
    const totalRevenue = orderAgg[0]?.revenue[0]?.total || 0;
    const pendingOrders = orderAgg[0]?.pending[0]?.count || 0;
    const confirmedOrders = orderAgg[0]?.confirmed[0]?.count || 0;
    const cancelledOrders = orderAgg[0]?.cancelled[0]?.count || 0;
    const completedOrders = orderAgg[0]?.completed[0]?.count || 0;

    // 2. Reservation Facets
    const resAgg = await Reservation.aggregate([
      {
        $facet: {
          totalReservations: [{ $count: "count" }],
          pending: [
            { $match: { status: 'Pending' } },
            { $count: "count" }
          ],
          confirmed: [
            { $match: { status: 'Confirmed' } },
            { $count: "count" }
          ]
        }
      }
    ]);

    const totalReservations = resAgg[0]?.totalReservations[0]?.count || 0;
    const pendingReservations = resAgg[0]?.pending[0]?.count || 0;
    const confirmedReservations = resAgg[0]?.confirmed[0]?.count || 0;

    // 3. Today's Specific Metrics
    const todayOrders = await Order.countDocuments({
      createdAt: { $gte: startOfToday, $lte: endOfToday }
    });

    const todayRevenueAgg = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfToday, $lte: endOfToday },
          status: { $nin: ['Cancelled', 'Pending'] }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$total' }
        }
      }
    ]);
    const todayRevenue = todayRevenueAgg[0]?.total || 0;

    const todayReservations = await Reservation.countDocuments({
      date: { $gte: startOfToday, $lte: endOfToday }
    });

    return sendSuccess(res, 'Success', {
      totalRevenue,
      totalOrders,
      pendingOrders,
      confirmedOrders,
      cancelledOrders,
      completedOrders,
      totalReservations,
      pendingReservations,
      confirmedReservations,
      todayOrders,
      todayRevenue,
      todayReservations
    });
  } catch (error) {
    return sendError(res, error.message || 'Error', null, 500);
  }
};

// @desc    Get analytical charts data (daily revenue for last 7 days)
// @route   GET /api/admin/stats
// @access  Admin, Manager
const getStats = async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setUTCHours(0, 0, 0, 0);

    const dailyStats = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo },
          status: { $nin: ['Cancelled', 'Pending'] }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: "$total" },
          ordersCount: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    return sendSuccess(res, 'Success', dailyStats);
  } catch (error) {
    return sendError(res, error.message || 'Error', null, 500);
  }
};

// @desc    Get detailed summary of orders
// @route   GET /api/admin/orders-summary
// @access  Admin, Manager
const getOrdersSummary = async (req, res) => {
  try {
    const latestOrders = await Order.find()
      .populate('customer', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(5);

    const orderStats = await Order.aggregate([
      {
        $facet: {
          totals: [
            {
              $group: {
                _id: null,
                totalRevenue: { $sum: { $cond: [{ $not: [{ $in: ['$status', ['Cancelled', 'Pending']] }] }, '$total', 0] } },
                averageOrderValue: { $avg: '$total' }
              }
            }
          ],
          byStatus: [
            { $group: { _id: '$status', count: { $sum: 1 } } }
          ]
        }
      }
    ]);

    const totals = orderStats[0]?.totals[0] || { totalRevenue: 0, averageOrderValue: 0 };
    const byStatus = orderStats[0]?.byStatus || [];

    // Map status array into a clean key-value object
    const statusCounts = {};
    byStatus.forEach(item => {
      if (item._id) {
        statusCounts[item._id] = item.count;
      }
    });

    return sendSuccess(res, 'Success', {
      latestOrders,
      statusCounts,
      totalRevenue: totals.totalRevenue,
      averageOrderValue: Math.round(totals.averageOrderValue * 100) / 100
    });
  } catch (error) {
    return sendError(res, error.message || 'Error', null, 500);
  }
};

// @desc    Get detailed summary of reservations
// @route   GET /api/admin/reservations-summary
// @access  Admin, Manager
const getReservationsSummary = async (req, res) => {
  try {
    const latestReservations = await Reservation.find()
      .populate('customer', 'name email phone')
      .sort({ date: 1, time: 1 })
      .limit(5);

    const resStats = await Reservation.aggregate([
      {
        $facet: {
          totals: [
            { $group: { _id: null, count: { $sum: 1 } } }
          ],
          byStatus: [
            { $group: { _id: '$status', count: { $sum: 1 } } }
          ]
        }
      }
    ]);

    const totalReservations = resStats[0]?.totals[0]?.count || 0;
    const byStatus = resStats[0]?.byStatus || [];

    const statusCounts = {};
    byStatus.forEach(item => {
      if (item._id) {
        statusCounts[item._id] = item.count;
      }
    });

    return sendSuccess(res, 'Success', {
      latestReservations,
      statusCounts,
      totalReservations
    });
  } catch (error) {
    return sendError(res, error.message || 'Error', null, 500);
  }
};

module.exports = {
  getDashboardData,
  getStats,
  getOrdersSummary,
  getReservationsSummary
};
