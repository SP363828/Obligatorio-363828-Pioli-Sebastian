const express = require('express');

const router = express.Router();

const {
    getAllReservationsController,
    getReservationController,
    createReservationController,
    updateReservationController,
    deleteReservationController,
} = require('../controllers/reservations.controller');

const payloadMiddleware = require('../middlewares/payload.middleware');
const reservationSchema = require('../models/schemas/reservation.schema');

// La autenticación se aplica en routes/index.js; el controlador verifica el acceso.

router.get('/', getAllReservationsController);

router.get('/:id', getReservationController);

router.post(
    '/',
    payloadMiddleware(reservationSchema),
    createReservationController
);

router.put(
    '/:id',
    payloadMiddleware(reservationSchema),
    updateReservationController
);

router.delete('/:id', deleteReservationController);

module.exports = router;