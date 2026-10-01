require('dotenv').config();
const bcrypt = require('bcryptjs');

const connectMongoDB = require('../models/mongo.client');
const User = require('../models/user.model');
const Category = require('../models/category.model');
const Resource = require('../models/resource.model');
const Reservation = require('../models/reservation.model');

async function upsertUser({ username, email, password, rol, plan }) {
  const existente = await User.findOne({ username });
  if (existente) {
    console.log(`Usuario ya existia: ${username}`);
    return existente;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const nuevo = await User.create({ username, email, passwordHash, rol, plan });
  console.log(`Usuario creado: ${username} / ${password}  (rol: ${rol}, plan: ${plan})`);
  return nuevo;
}

async function upsertCategory({ name, description }) {
  const existente = await Category.findOne({ name });
  if (existente) return existente;

  const nueva = await Category.create({ name, description });
  console.log(`Categoria creada: ${name}`);
  return nueva;
}

async function upsertResource({ name, stock, categoryId }) {
  const existente = await Resource.findOne({ name });
  if (existente) return existente;

  const nuevo = await Resource.create({
    name,
    description: '',
    stock,
    category: categoryId,
  });
  console.log(`Recurso creado: ${name}`);
  return nuevo;
}

async function upsertReservation({
  userId,
  resourceId,
  bloques,
  fechaInicio,
  fechaFin,
  tipoRecurrencia,
}) {
  const existente = await Reservation.findOne({
    user: userId,
    resources: resourceId,
    fechaInicio: new Date(fechaInicio),
  });
  if (existente) return existente;

  const nueva = await Reservation.create({
    user: userId,
    resources: [resourceId],
    bloques,
    fechaInicio,
    fechaFin,
    tipoRecurrencia,
    status: 'active',
  });
  console.log(`Reserva de ejemplo creada (${tipoRecurrencia})`);
  return nueva;
}

async function seed() {
  await connectMongoDB();

  console.log('\n=== USUARIOS ===');
  const admin = await upsertUser({
    username: 'admin',
    email: 'admin@obligatorio.com',
    password: 'admin1234',
    rol: 'admin',
    plan: 'premium',
  });

  const testPlus = await upsertUser({
    username: 'testplus',
    email: 'testplus@obligatorio.com',
    password: 'Test1234',
    rol: 'user',
    plan: 'plus',
  });

  const testPremium = await upsertUser({
    username: 'testpremium',
    email: 'testpremium@obligatorio.com',
    password: 'Test1234',
    rol: 'user',
    plan: 'premium',
  });

  console.log('\n=== CATEGORIAS Y RECURSOS ===');
  const catProyector = await upsertCategory({
    name: 'Proyector',
    description: 'Proyectores para salas de reunion',
  });
  const catZoom = await upsertCategory({
    name: 'Kit Zoom',
    description: 'Kit de videoconferencia (camara + microfono)',
  });
  const catTV = await upsertCategory({
    name: 'TV',
    description: 'Televisores para presentaciones',
  });

  const recProyector = await upsertResource({
    name: 'Proyector Epson X200',
    stock: 1,
    categoryId: catProyector._id,
  });
  const recZoom = await upsertResource({
    name: 'Kit Zoom Logitech',
    stock: 1,
    categoryId: catZoom._id,
  });
  const recTV = await upsertResource({
    name: 'TV Samsung 55"',
    stock: 1,
    categoryId: catTV._id,
  });

  console.log('\n=== RESERVAS DE EJEMPLO ===');
  // Reserva única de testplus para el proyector.
  await upsertReservation({
    userId: testPlus._id,
    resourceId: recProyector._id,
    bloques: ['09:00'],
    fechaInicio: '2026-12-10',
    fechaFin: '2026-12-10',
    tipoRecurrencia: 'unica',
  });

  // Reserva semanal de testplus para probar la recurrencia.
  await upsertReservation({
    userId: testPlus._id,
    resourceId: recZoom._id,
    bloques: ['10:00'],
    fechaInicio: '2026-12-01',
    fechaFin: '2026-12-31',
    tipoRecurrencia: 'semanal',
  });

  // Reserva diaria de testpremium para la TV.
  await upsertReservation({
    userId: testPremium._id,
    resourceId: recTV._id,
    bloques: ['14:00'],
    fechaInicio: '2026-12-01',
    fechaFin: '2026-12-05',
    tipoRecurrencia: 'diaria',
  });

  console.log('\n=== RESUMEN DE CREDENCIALES ===');
  console.table([
    { username: 'admin', password: 'admin1234', rol: 'admin', plan: 'premium' },
    { username: 'testplus', password: 'Test1234', rol: 'user', plan: 'plus' },
    { username: 'testpremium', password: 'Test1234', rol: 'user', plan: 'premium' },
  ]);

  console.log('\nSeed completo');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Error corriendo el seed:', err);
  process.exit(1);
});