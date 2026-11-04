const rateLimit = require('express-rate-limit');

// Límite general de solicitudes.
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: Number(process.env.RATE_LIMIT_MAX) || 300, // requests por IP en esa ventana
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiadas solicitudes, probá de nuevo en unos minutos' },
});

// Límite más estricto para login y registro.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: Number(process.env.AUTH_RATE_LIMIT_MAX) || 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiados intentos, probá de nuevo en unos minutos' },
});

module.exports = { generalLimiter, authLimiter };