const {
    findReservations,
    countReservations,
    findReservationById,
    removeReservation,
} = require('../repositories/reservation.repository');

const {
    crearReserva,
    actualizarReserva,
    buildReservationFilter,
    buildReservationSort,
} = require('../services/reservation.service');
const { parsePagination, buildMeta } = require('../utils/pagination');

const getAllReservationsController = async (req, res, next) => {
    try {
        const { page, limit, skip } = parsePagination(req.query);
        const filter = await buildReservationFilter(req.validatedQuery, req.user);
        const sort = buildReservationSort(req.validatedQuery.sort);

        const [reservations, total] = await Promise.all([
            findReservations(filter, { skip, limit, sort }),
            countReservations(filter),
        ]);

        res.status(200).json({
            data: reservations,
            meta: buildMeta({ page, limit, total }),
        });
    } catch (err) {
        next(err);
    }
};

const getReservationController = async (req, res, next) => {
    try {
        const reservation = await findReservationById(req.params.id);

        if (!reservation) {
            return res.status(404).json({ message: 'Reserva no encontrada' });
        }

        const esDueno = reservation.user.toString() === req.user.id;
        if (!esDueno && req.user.rol !== 'admin') {
            return res.status(403).json({ message: 'No podés ver reservas de otro usuario' });
        }

        res.status(200).json(reservation);
    } catch (err) {
        next(err);
    }
};

const createReservationController = async (req, res, next) => {
    try {
        const reservation = await crearReserva({
            userId: req.user.id,
            plan: req.user.plan,
            ...req.body,
        });

        res.status(201).json(reservation);
    } catch (err) {
        next(err);
    }
};

const updateReservationController = async (req, res, next) => {
    try {
        const existente = await findReservationById(req.params.id);

        if (!existente) {
            return res.status(404).json({ message: 'Reserva no encontrada' });
        }

        const esDueno = existente.user.toString() === req.user.id;
        if (!esDueno && req.user.rol !== 'admin') {
            return res.status(403).json({ message: 'No podés modificar reservas de otro usuario' });
        }

        const reservation = await actualizarReserva(req.params.id, {
            userId: existente.user.toString(),
            plan: req.user.plan,
            ...req.body,
        });

        res.status(200).json(reservation);
    } catch (err) {
        next(err);
    }
};

const deleteReservationController = async (req, res, next) => {
    try {
        const existente = await findReservationById(req.params.id);

        if (!existente) {
            return res.status(404).json({ message: 'Reserva no encontrada' });
        }

        const esDueno = existente.user.toString() === req.user.id;
        if (!esDueno && req.user.rol !== 'admin') {
            return res.status(403).json({ message: 'No podés borrar reservas de otro usuario' });
        }

        await removeReservation(req.params.id);
        res.sendStatus(204);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getAllReservationsController,
    getReservationController,
    createReservationController,
    updateReservationController,
    deleteReservationController,
};