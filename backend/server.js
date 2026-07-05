const app = require('./app');
const mongoose = require('mongoose');

// Try loading dotenv if installed (production safety)
try {
  require('dotenv').config();
} catch (e) {
  // Dotenv dependency optional for initial boot
}

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/burgeriza';

// Connect to MongoDB Database
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB.');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
