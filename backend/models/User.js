const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['customer', 'manager', 'admin'], default: 'customer' },
    phone: { type: String, trim: true },
    bio: { type: String, default: '' },
    addresses: [
      {
        label: { type: String, enum: ['home', 'work', 'other'], default: 'home' },
        street: { type: String, required: true },
        postCode: { type: String },
        apartment: { type: String },
        isDefault: { type: Boolean, default: false }
      }
    ]
  },
  { timestamps: true }
);

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
