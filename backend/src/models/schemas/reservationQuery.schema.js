const Joi = require('joi');
const objectId = require('../../routes/validations/objectId.validator');

// Query params de GET /reservas. page y limit los normaliza parsePagination.
const reservationQuerySchema = Joi.object({
    page: Joi.number().integer().min(1),
    limit: Joi.number().integer().min(1),
    status: Joi.string().valid('active', 'completed', 'cancelled'),
    tipoRecurrencia: Joi.string().valid('unica', 'diaria', 'semanal', 'mensual'),
    resource: objectId(),
    user: objectId(),
    q: Joi.string().trim().max(100),
    desde: Joi.date().iso(),
    hasta: Joi.date().iso().when('desde', {
        is: Joi.exist(),
        then: Joi.date().min(Joi.ref('desde')),
    }),
    sort: Joi.string().valid('fechaInicio', '-fechaInicio', 'createdAt', '-createdAt'),
});

module.exports = reservationQuerySchema;
