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
const queryMiddleware = require('../middlewares/query.middleware');
const reservationSchema = require('../models/schemas/reservation.schema');
const reservationQuerySchema = require('../models/schemas/reservationQuery.schema');
const { limpiarParam } = require('../middlewares/xss.middleware');

// La autenticación se aplica en routes/index.js; el controlador verifica el acceso.

// Limpia el parámetro :id (XSS) antes de llegar al controlador.
router.param('id', limpiarParam);

router.get('/', queryMiddleware(reservationQuerySchema), getAllReservationsController);

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