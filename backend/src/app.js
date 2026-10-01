require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const router = require('./routes');
const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');
const { generalLimiter } = require('./middlewares/rate-Limit.middleware');
const mongoSanitizeMiddleware = require('./middlewares/mongoSanitize.middleware');

// --- Chequeo de variables de entorno obligatorias ---
const requiredEnvVars = [
  'SECRET_KEY',
  'MONGODB_CONNECTION_STRING',
  'MONGODB_DATABASE_NAME',
];
const missingEnvVars = requiredEnvVars.filter((key) => !process.env[key]);

if (missingEnvVars.length > 0) {
  console.error(
    `Faltan variables de entorno obligatorias: ${missingEnvVars.join(', ')}. Revisá tu configuración.`
  );
  throw new Error('Faltan variables de entorno obligatorias');
}

const app = express();

app.use(helmet());

const allowedOrigins = (process.env.CORS_ORIGIN || '*')
  .split(',')
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Origen no permitido por CORS'));
    },
  })
);

app.use(generalLimiter);
app.use(express.json({ limit: '1mb' }));
app.use(mongoSanitizeMiddleware);

// La conexión a Mongo se asegura dentro de router (dbMiddleware, primera
// línea de src/routes/index.js) -- no acá, porque en serverless no
// queremos conectar una sola vez al importar el módulo, sino en cada
// request (mongoose ya sabe no reconectar si ya está conectado).
app.use('/api/v1', router);

app.use(notFound);
app.use(errorHandler);

module.exports = app;

// Solo levanta el servidor si este archivo se corre directo
// (node src/app.js / npm run dev). Cuando Vercel lo importa como módulo,
// require.main !== module, así que esto no se ejecuta -- Vercel maneja
// las requests llamando a la app exportada directamente.
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}/api/v1`);
  });
}