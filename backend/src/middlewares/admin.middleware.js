const adminMiddleware = (req, res, next) => {

   /* if (!req.user) {
        return res.status(401).json({
            message: "Usuario no autenticado"
        });
    }

    if (req.user.role !== "admin") {
        return res.status(403).json({
            message: "Acceso denegado. Se requieren permisos de administrador"
        });
    }

    */
    next();
};

module.exports = adminMiddleware;