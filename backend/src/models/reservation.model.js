const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    resources: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Resource', required: true },
    ],
    // Horas de inicio de cada bloque de 30 min, ej: "09:00", "09:30"
    bloques: [{ type: String, required: true }],
    fechaInicio: { type: Date, required: true },
    fechaFin: { type: Date, required: true },
    tipoRecurrencia: {
      type: String,
      enum: ['unica', 'diaria', 'semanal', 'mensual'],
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'cancelled'],
      default: 'active',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Reservation', reservationSchema);