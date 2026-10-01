const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    stock: { type: Number, required: true, min: 0 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    status: {
      type: String,
      enum: ['available', 'maintenance', 'inactive'],
      default: 'available',
    },
    imagenUrl: { type: String, default: null },
    imagenPublicId: { type: String, default: null }, // para poder borrarla de Cloudinary
  },
  { timestamps: true }
);

module.exports = mongoose.model('Resource', resourceSchema);