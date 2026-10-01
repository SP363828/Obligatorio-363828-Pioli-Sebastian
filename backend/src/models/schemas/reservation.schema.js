const Joi = require('joi');
const objectId = require('../../routes/validations/objectId.validator');

// Horarios en bloques de 30 minutos.
const HORA_REGEX = /^(0[8-9]|1\d|2[0-3]):(00|30)$/;

// El usuario se toma del token, no del body.
const reservationSchema = Joi.object({
    resources: Joi.array().items(objectId()).min(1).required(),

    bloques: Joi.array()
        .items(
            Joi.string().pattern(HORA_REGEX).messages({
                'string.pattern.base':
                    'Cada bloque debe ser una hora en punto o y media, entre 08:00 y 23:30',
            })
        )
        .min(1)
        .required(),

    fechaInicio: Joi.date().iso().required(),

    fechaFin: Joi.date().iso().min(Joi.ref('fechaInicio')).required(),

    tipoRecurrencia: Joi.string()
        .valid('unica', 'diaria', 'semanal', 'mensual')
        .required(),

    status: Joi.string()
        .valid('active', 'completed', 'cancelled')
        .default('active'),
});

module.exports = reservationSchema;