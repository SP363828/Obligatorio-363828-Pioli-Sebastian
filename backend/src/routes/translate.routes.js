const express = require('express');

const router = express.Router();

const translateController = require('../controllers/translate.controller');
const payloadMiddleware = require('../middlewares/payload.middleware');
const translateSchema = require('../models/schemas/translate.schema');

router.post('/', payloadMiddleware(translateSchema), translateController.translate);

module.exports = router;
