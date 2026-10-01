const express = require('express');
const router = express.Router();

const { updateMyPlanController } = require('../controllers/users.controller');

// La ruta solo permite actualizar el plan del usuario autenticado.
router.patch('/me/plan', updateMyPlanController);

module.exports = router;