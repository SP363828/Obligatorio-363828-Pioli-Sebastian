const express = require('express');
const router = express.Router();

const verificarToken = require('../middlewares/verificarToken');
const dbMiddleware = require('../middlewares/db.middleware');

// Asegura la conexión a Mongo antes de cualquier otra cosa
router.use(dbMiddleware);

// ----------------------
// Rutas públicas
// ----------------------
router.use('/', require('./public.routes'));
router.use('/auth', require('./auth.routes'));

// ----------------------
// Rutas protegidas
// ----------------------
router.use(verificarToken);

router.use('/category', require('./category.routes'));
router.use('/recursos', require('./resource.routes'));
router.use('/reservas', require('./reservation.routes'));
router.use('/users', require('./users.routes'));

// APIs externas
router.use('/translate', require('./translate.routes'));
router.use('/ai', require('./ai.routes'));

module.exports = router;