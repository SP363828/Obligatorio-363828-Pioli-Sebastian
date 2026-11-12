// Limpia los datos de entrada para evitar XSS (por ejemplo, "<script>alert(1)</script>").
// Usa la librería "xss": quita todas las etiquetas HTML y borra el contenido de <script> y <style>.
// body y params se modifican en el lugar. req.query necesita un trato aparte (ver abajo).
const { FilterXSS } = require('xss');

const filtro = new FilterXSS({
  whiteList: {}, // ninguna etiqueta HTML permitida
  stripIgnoreTag: true, // las etiquetas no permitidas se eliminan (no se escapan)
  stripIgnoreTagBody: ['script', 'style'], // y además se borra lo que hay adentro
});

// Las contraseñas no se limpian: nunca se muestran (se guardan hasheadas) y
// modificarlas haría que un usuario con "<" en su contraseña no pueda ingresar.
const CAMPOS_SIN_LIMPIAR = ['password'];

function limpiar(valor) {
  if (typeof valor === 'string') return filtro.process(valor);

  if (Array.isArray(valor)) {
    valor.forEach((item, i) => {
      valor[i] = limpiar(item);
    });
  } else if (valor !== null && typeof valor === 'object') {
    Object.keys(valor).forEach((clave) => {
      if (!CAMPOS_SIN_LIMPIAR.includes(clave)) valor[clave] = limpiar(valor[clave]);
    });
  }

  return valor;
}

// Se aplica de forma global en app.js (body JSON y query string) y, en las rutas
// con archivos, después de multer (que es quien arma req.body en un form-data).
function xssMiddleware(req, res, next) {
  limpiar(req.body);
  limpiar(req.params);

  // En Express 5 req.query es un getter que vuelve a leer la URL en cada acceso:
  // modificarlo en el lugar no sirve. Lo fijamos ya limpio para el resto del request.
  Object.defineProperty(req, 'query', {
    value: limpiar(req.query),
    writable: true,
    configurable: true,
    enumerable: true,
  });

  next();
}

// Los parámetros de ruta (:id) recién existen cuando Express encuentra la ruta,
// por eso se limpian con router.param() en cada archivo de rutas.
function limpiarParam(req, res, next, valor, nombre) {
  req.params[nombre] = filtro.process(valor);
  next();
}

module.exports = xssMiddleware;
module.exports.limpiarParam = limpiarParam;
