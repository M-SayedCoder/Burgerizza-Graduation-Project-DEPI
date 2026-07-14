// app.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');

const authRoutes = require('./routes/authRoutes');
const menuRoutes = require('./routes/menuRoutes');

dotenv.config();
const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'المسار غير موجود' });
});

app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ success: false, message: 'خطأ في الخادم' });
});

module.exports = app;