// Valida los query params con Joi. Los valores convertidos quedan en req.validatedQuery.
const queryMiddleware = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.query);

        if (error) {
            return res.status(400).json({
                message: error.details[0].message,
            });
        }

        req.validatedQuery = value;
        next();
    };
};

module.exports = queryMiddleware;
