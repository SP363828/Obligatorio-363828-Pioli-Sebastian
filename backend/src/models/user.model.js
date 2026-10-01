const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    passwordHash: { type: String, required: true },
    rol: { type: String, enum: ['user', 'admin'], default: 'user' },
    plan: { type: String, enum: ['plus', 'premium'], default: 'plus' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
