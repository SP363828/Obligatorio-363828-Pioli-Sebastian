const {
    findCategories,
    countCategories,
    findCategoryById,
    addCategory,
    updateCategory,
    removeCategory,
} = require('../repositories/category.repository');

const { findByCategoryId } = require('../repositories/resource.repository');
const { parsePagination, buildMeta } = require('../utils/pagination');

const getAllCategoriesController = async (req, res, next) => {
    try {
        const { page, limit, skip } = parsePagination(req.query);

        // Busca por nombre sin distinguir mayúsculas.
        const filter = {};
        if (req.query.name) {
            filter.name = { $regex: req.query.name, $options: 'i' };
        }

        const [categories, total] = await Promise.all([
            findCategories(filter, { skip, limit }),
            countCategories(filter),
        ]);

        res.status(200).json({
            data: categories,
            meta: buildMeta({ page, limit, total }),
        });
    } catch (err) {
        next(err);
    }
};

const getCategoryController = async (req, res, next) => {
    try {
        const category = await findCategoryById(req.params.id);

        if (!category) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }

        res.status(200).json(category);
    } catch (err) {
        next(err);
    }
};

const createCategoryController = async (req, res, next) => {
    try {
        const category = await addCategory(req.body);
        res.status(201).json(category);
    } catch (err) {
        next(err);
    }
};

const updateCategoryController = async (req, res, next) => {
    try {
        const category = await updateCategory(req.params.id, req.body);

        if (!category) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }

        res.status(200).json(category);
    } catch (err) {
        next(err);
    }
};

const deleteCategoryController = async (req, res, next) => {
    try {
        const recursosAsociados = await findByCategoryId(req.params.id);

        if (recursosAsociados.length > 0) {
            return res.status(409).json({
                message: 'No se puede eliminar: hay Recursos asociados a esta categoría',
            });
        }

    const deleted = await removeCategory(req.params.id);

        if (!deleted) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }

        res.sendStatus(204);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getAllCategoriesController,
    getCategoryController,
    createCategoryController,
    updateCategoryController,
    deleteCategoryController,
};