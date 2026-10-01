// Manejador de errores centralizado.
// Los controllers/servicios lanzan errores con { status, message } y acá
// se traducen a una respuesta HTTP consistente. Además normaliza los
// errores "crudos" que puede tirar Mongo/Mongoose (duplicados, ids mal
// formados) para que nunca se escape un 500 feo por algo esperable.
function errorHandler(err, req, res, next) {
  console.error(err);

  // Clave duplicada (ej: nombre de categoría único que ya existe)
  if (err.code === 11000) {
    const campo = Object.keys(err.keyValue || {})[0] || 'campo';
    const valor = err.keyValue ? err.keyValue[campo] : '';
    return res.status(409).json({
      error: `Ya existe un registro con ${campo}: "${valor}"`,
    });
  }

  // Id de Mongo mal formado (ej: "null", "abc123", etc.)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    return res.status(400).json({
      error: `El valor "${err.value}" no es un id válido`,
    });
  }

  // Validación a nivel de esquema de Mongoose (no debería pasar casi nunca
  // porque Joi valida antes, pero por las dudas no lo dejamos pasar como 500)
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  }

  // Errores de multer (archivo muy pesado, campo mal nombrado, etc.)
  if (err.name === 'MulterError') {
    return res.status(400).json({ error: err.message });
  }

  const status = err.status || 500;
  const message = status === 500 ? 'Error interno del servidor' : err.message;

  res.status(status).json({ error: message });
}

module.exports = errorHandler;