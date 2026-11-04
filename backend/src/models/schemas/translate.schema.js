const Joi = require('joi');

const translateSchema = Joi.object({
  text: Joi.string().trim().max(500).required().messages({
    'any.required': 'El texto es obligatorio',
    'string.empty': 'El texto es obligatorio',
    'string.max': 'El texto no puede superar los 500 caracteres',
  }),
  target: Joi.string().valid('en', 'pt', 'fr').default('en').messages({
    'any.only': 'El idioma debe ser en, pt o fr',
  }),
});

module.exports = translateSchema;
