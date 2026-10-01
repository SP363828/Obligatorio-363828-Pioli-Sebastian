const express = require('express');
const router = express.Router();

const { register, login } = require('../controllers/auth.controller');
const verificarToken = require('../middlewares/verificarToken');
const { authLimiter } = require('../middlewares/rate-Limit.middleware');

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);

// Ruta de prueba para verificar la autenticación.
router.get('/me', verificarToken, (req, res) => {
  res.status(200).json({ usuario: req.user });
});

module.exports = router;