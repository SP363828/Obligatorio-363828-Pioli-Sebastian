const express = require('express');

const {
    getAllCategoriesController,
    getCategoryController,
    createCategoryController,
    updateCategoryController,
    deleteCategoryController,
} = require('../controllers/category.controller');

const payloadMiddleware = require('../middlewares/payload.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');

const categorySchema = require('../models/schemas/category.schema');

const router = express.Router();

// La autenticación se aplica en routes/index.js.

router.get('/', getAllCategoriesController);

router.get('/:id', getCategoryController);

router.post(
    '/',
    adminMiddleware,
    payloadMiddleware(categorySchema),
    createCategoryController
);

router.put(
    '/:id',
    adminMiddleware,
    payloadMiddleware(categorySchema),
    updateCategoryController
);

router.delete(
    '/:id',
    adminMiddleware,
    deleteCategoryController
);

module.exports = router;