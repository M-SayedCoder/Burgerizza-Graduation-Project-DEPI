const express = require('express');
const cors = require('cors');
const orderRoutes = require('./routes/orderRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Standard middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Try loading CORS if installed (production safety)
try {
  const cors = require('cors');
  app.use(cors());
} catch (e) {
  // CORS dependency optional for initial boot
}

// Mount Orders Module routes
app.use('/api/orders', orderRoutes);

// Mount Reservations Module routes
app.use('/api/reservations', reservationRoutes);

// Mount Admin Dashboard Module routes
app.use('/api/admin', adminRoutes);

// Catch-all route for unhandled requests
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Resource not found'
  });
});

// Global Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

module.exports = app;
