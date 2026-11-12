const express = require("express");

const router = express.Router();

const {
    getAllResourcesController,
    getResourceController,
    createResourceController,
    updateResourceController,
    deleteResourceController
} = require("../controllers/resources.controller");

const adminMiddleware = require("../middlewares/admin.middleware");
const payloadMiddleware = require("../middlewares/payload.middleware");
const upload = require("../middlewares/Upload.middleware");
const xssMiddleware = require("../middlewares/xss.middleware");
const { limpiarParam } = xssMiddleware;

const resourceSchema = require("../models/schemas/resource.schema");

// La autenticación se aplica en routes/index.js.
// upload.single("imagen"): el campo del form-data tiene que llamarse "imagen".
// Es opcional -- si no mandás archivo, el recurso se crea/edita sin imagen.
// xssMiddleware va después de multer: con form-data, req.body recién existe ahí.

// Limpia el parámetro :id (XSS) antes de llegar al controlador.
router.param("id", limpiarParam);

router.get("/", getAllResourcesController);

router.get("/:id", getResourceController);

router.post(
    "/",
    adminMiddleware,
    upload.single("imagen"),
    xssMiddleware,
    payloadMiddleware(resourceSchema),
    createResourceController
);

router.put(
    "/:id",
    adminMiddleware,
    upload.single("imagen"),
    xssMiddleware,
    payloadMiddleware(resourceSchema),
    updateResourceController
);

router.delete(
    "/:id",
    adminMiddleware,
    deleteResourceController
);

module.exports = router;