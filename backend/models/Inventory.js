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
    enum: ['kg', 'g', 'litre', 'ml', 'piece', 'pack', 'liter', 'box', 'gram'] // Combined enum from both frontend & backend
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
  minQuantity: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  costPerUnit: {
    type: Number,
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

// Pre-save middleware to synchronize minQuantity and minimumStock
inventorySchema.pre('save', function(next) {
  if (this.isModified('minQuantity') && !this.isModified('minimumStock')) {
    this.minimumStock = this.minQuantity;
  } else if (this.isModified('minimumStock') && !this.isModified('minQuantity')) {
    this.minQuantity = this.minimumStock;
  }
  next();
});

// Indexes for query performance and sorting
inventorySchema.index({ category: 1 });
inventorySchema.index({ isActive: 1 });
inventorySchema.index({ category: 1, isActive: 1 });
inventorySchema.index({ supplier: 1 });

module.exports = mongoose.model('Inventory', inventorySchema);
