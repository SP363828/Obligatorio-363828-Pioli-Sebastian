const Joi = require('joi');

const registerSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required().messages({
    'string.empty': 'El usuario es obligatorio',
  }),
  email: Joi.string().email().required().messages({
    'string.empty': 'El email es obligatorio',
    'string.email': 'El email no es válido',
  }),
  password: Joi.string().min(6).required().messages({
    'string.empty': 'La contraseña es obligatoria',
    'string.min': 'La contraseña debe tener al menos 6 caracteres',
  }),
  passwordRepeat: Joi.string().valid(Joi.ref('password')).required().messages({
    'any.only': 'Las contraseñas no coinciden',
    'string.empty': 'Debés repetir la contraseña',
  }),
});

const loginSchema = Joi.object({
  username: Joi.string().required().messages({
    'string.empty': 'El usuario es obligatorio',
  }),
  password: Joi.string().required().messages({
    'string.empty': 'La contraseña es obligatoria',
  }),
});

module.exports = { registerSchema, loginSchema };