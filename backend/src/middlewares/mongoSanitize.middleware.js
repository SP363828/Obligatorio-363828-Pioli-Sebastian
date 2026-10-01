// Elimina claves que MongoDB podría interpretar como operadores.
// Se modifican los objetos en el lugar porque Express 5 no permite reasignar req.query.

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function sanitize(value) {
  if (Array.isArray(value)) {
    value.forEach(sanitize);
    return value;
  }

  if (isPlainObject(value)) {
    Object.keys(value).forEach((key) => {
      if (key.startsWith('$') || key.includes('.')) {
        delete value[key];
      } else {
        sanitize(value[key]);
      }
    });
  }

  return value;
}

function mongoSanitizeMiddleware(req, res, next) {
  sanitize(req.body);
  sanitize(req.query);
  sanitize(req.params);
  next();
}

module.exports = mongoSanitizeMiddleware;