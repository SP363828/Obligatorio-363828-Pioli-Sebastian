const Reservation = require('../models/reservation.model');

// Consultas paginadas para el listado.
// _id desempata: sin un orden total, skip/limit puede repetir u omitir reservas entre páginas.
function findReservations(filter = {}, { skip = 0, limit = 10, sort = { fechaInicio: 1 } } = {}) {
  return Reservation.find(filter).sort({ ...sort, _id: 1 }).skip(skip).limit(limit);
}

function countReservations(filter = {}) {
  return Reservation.countDocuments(filter);
}

// Estas consultas devuelven todas las reservas activas para validar disponibilidad y límites.
function findActiveByUser(userId) {
  return Reservation.find({ user: userId, status: 'active' });
}

function findActiveByResources(resourceIds) {
  return Reservation.find({
    resources: { $in: resourceIds },
    status: 'active',
  });
}

function findReservationById(id) {
  return Reservation.findById(id);
}

function addReservation(data) {
  return Reservation.create(data);
}

function updateReservation(id, data) {
  return Reservation.findByIdAndUpdate(id, data, { new: true });
}

function removeReservation(id) {
  return Reservation.findByIdAndDelete(id);
}

module.exports = {
  findReservations,
  countReservations,
  findActiveByUser,
  findActiveByResources,
  findReservationById,
  addReservation,
  updateReservation,
  removeReservation,
};