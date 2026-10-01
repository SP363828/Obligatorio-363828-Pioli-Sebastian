const Joi = require('joi');

const objectId = () =>
  Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .message('Debe ser un ObjectId de Mongo válido');

module.exports = objectId;
