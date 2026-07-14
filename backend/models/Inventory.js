const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: 100
  },
  category: {
    type: String,
    trim: true
  },
  unit: {
    type: String,
    required: true,
    trim: true,
    enum: ['kg', 'g', 'litre', 'ml', 'piece', 'pack']
  },
  quantity: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  minimumStock: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  supplier: {
    type: String,
    trim: true,
    maxlength: 100
  },
  notes: {
    type: String,
    trim: true,
    maxlength: 500
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for query performance and sorting
inventorySchema.index({ category: 1 });
inventorySchema.index({ isActive: 1 });
inventorySchema.index({ category: 1, isActive: 1 });
inventorySchema.index({ supplier: 1 });

module.exports = mongoose.model('Inventory', inventorySchema);
