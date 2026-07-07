const express = require('express');
const cors = require('cors');
const orderRoutes = require('./routes/orderRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { sendError } = require('./utils/responseHandler');

const app = express();

// Standard middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount Orders Module routes
app.use('/api/orders', orderRoutes);

// Mount Reservations Module routes
app.use('/api/reservations', reservationRoutes);

// Mount Admin Dashboard Module routes
app.use('/api/admin', adminRoutes);

// Catch-all route for unhandled requests
app.use('*', (req, res) => {
  sendError(res, 'Resource not found', null, 404);
});

// Global Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  sendError(res, err.message || 'Internal Server Error', null, err.status || 500);
});

module.exports = app;
