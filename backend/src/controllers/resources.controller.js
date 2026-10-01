const {
    findResources,
    countResources,
    findResourceById,
    addResource,
    updateResource,
    removeResource,
} = require("../repositories/resource.repository");

const { parsePagination, buildMeta } = require("../utils/pagination");
const { uploadImage, deleteImage } = require("../services/cloudinary.service");

const getAllResourcesController = async (req, res, next) => {
    try {
        const { page, limit, skip } = parsePagination(req.query);

        const filter = {};
        if (req.query.category) filter.category = req.query.category;
        if (req.query.status) filter.status = req.query.status;
        if (req.query.name) {
            filter.name = { $regex: req.query.name, $options: "i" };
        }

        const [resources, total] = await Promise.all([
            findResources(filter, { skip, limit }),
            countResources(filter),
        ]);

        res.status(200).json({
            data: resources,
            meta: buildMeta({ page, limit, total }),
        });
    } catch (err) {
        next(err);
    }
};

const getResourceController = async (req, res, next) => {
    try {
        const resource = await findResourceById(req.params.id);

        if (!resource) {
            return res.status(404).json({ message: "Recurso no encontrado" });
        }

        res.status(200).json(resource);
    } catch (err) {
        next(err);
    }
};

const createResourceController = async (req, res, next) => {
    try {
        let imagenData = {};

        // req.file lo deja multer (upload.middleware) si vino una imagen.
        // Si la request fue JSON puro, req.file es undefined y el recurso
        // se crea sin imagen (imagenUrl queda null por default del modelo).
        if (req.file) {
            const resultado = await uploadImage(req.file.buffer, "recursos");
            imagenData = {
                imagenUrl: resultado.secure_url,
                imagenPublicId: resultado.public_id,
            };
        }

        const resource = await addResource({ ...req.body, ...imagenData });
        res.status(201).json(resource);
    } catch (err) {
        next(err);
    }
};

const updateResourceController = async (req, res, next) => {
    try {
        let imagenData = {};

        if (req.file) {
            const existente = await findResourceById(req.params.id);

            if (!existente) {
                return res.status(404).json({ message: "Recurso no encontrado" });
            }

            const resultado = await uploadImage(req.file.buffer, "recursos");
            imagenData = {
                imagenUrl: resultado.secure_url,
                imagenPublicId: resultado.public_id,
            };

            // Borramos la imagen vieja recién después de que la nueva subió bien.
            if (existente.imagenPublicId) {
                await deleteImage(existente.imagenPublicId);
            }
        }

        const resource = await updateResource(req.params.id, { ...req.body, ...imagenData });

        if (!resource) {
            return res.status(404).json({ message: "Recurso no encontrado" });
        }

        res.status(200).json(resource);
    } catch (err) {
        next(err);
    }
};

const deleteResourceController = async (req, res, next) => {
    try {
        const existente = await findResourceById(req.params.id);

        if (!existente) {
            return res.status(404).json({ message: "Recurso no encontrado" });
        }

        if (existente.imagenPublicId) {
            await deleteImage(existente.imagenPublicId);
        }

        await removeResource(req.params.id);
        res.sendStatus(204);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getAllResourcesController,
    getResourceController,
    createResourceController,
    updateResourceController,
    deleteResourceController,
};