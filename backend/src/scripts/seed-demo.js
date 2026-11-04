// Carga datos de demostración. Se puede correr varias veces: categorías, recursos y usuarios
// se crean solo si faltan, y únicamente se reemplazan las reservas de los usuarios demo
// (así las fechas siguen siendo relativas a hoy). No toca ningún otro dato.
require('dotenv').config();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const connectMongoDB = require('../models/mongo.client');
const User = require('../models/user.model');
const Category = require('../models/category.model');
const Resource = require('../models/resource.model');
const Reservation = require('../models/reservation.model');
const { expandOccurrences } = require('../utils/recurrence');
const { PASSWORD_DEMO, USUARIOS, CATEGORIAS, RECURSOS } = require('./data/demo');

const LIMITE_PLAN_PLUS = 4;
const DIA = 24 * 60 * 60 * 1000;
const BLOQUES = Array.from({ length: 28 }, (_, i) => {
  const hora = String(8 + Math.floor(i / 2)).padStart(2, '0');
  return `${hora}:${i % 2 ? '30' : '00'}`;
});

// Generador con semilla: los datos salen iguales en cada corrida.
let semilla = 363828;
function azar() {
  semilla = (semilla * 1664525 + 1013904223) % 4294967296;
  return semilla / 4294967296;
}
const entero = (min, max) => min + Math.floor(azar() * (max - min + 1));
const elegir = (lista) => lista[entero(0, lista.length - 1)];

const hoy = new Date(new Date().toISOString().slice(0, 10));
const enDias = (n) => new Date(hoy.getTime() + n * DIA);

function calcularFin(inicio, tipo) {
  const dias = { unica: 0, diaria: 4, semanal: 28, mensual: 60 }[tipo];
  return new Date(inicio.getTime() + dias * DIA);
}

// Lleva la ocupación de las reservas activas para no superar el stock de ningún recurso.
const ocupacion = new Map();
const clavesDe = (recurso, bloques, inicio, fin, tipo) =>
  expandOccurrences(inicio, fin, tipo).flatMap((fecha) =>
    bloques.map((bloque) => `${recurso._id}|${bloque}|${fecha.getTime()}`)
  );

function reservarSiHayLugar(recurso, bloques, inicio, fin, tipo) {
  const claves = clavesDe(recurso, bloques, inicio, fin, tipo);
  if (claves.some((c) => (ocupacion.get(c) || 0) >= recurso.stock)) return false;
  claves.forEach((c) => ocupacion.set(c, (ocupacion.get(c) || 0) + 1));
  return true;
}

function bloquesSeguidos(cantidad) {
  const desde = entero(0, BLOQUES.length - cantidad);
  return BLOQUES.slice(desde, desde + cantidad);
}

function crearActiva(usuario, recursos, cantidadBloques, tipo) {
  for (let intento = 0; intento < 200; intento++) {
    const recurso = elegir(recursos);
    const bloques = bloquesSeguidos(cantidadBloques);
    const inicio = enDias(entero(1, 60));
    const fin = calcularFin(inicio, tipo);
    if (reservarSiHayLugar(recurso, bloques, inicio, fin, tipo)) {
      return { user: usuario._id, resources: [recurso._id], bloques, fechaInicio: inicio, fechaFin: fin, tipoRecurrencia: tipo, status: 'active' };
    }
  }
  throw new Error(`No se encontró lugar para una reserva de ${usuario.username}`);
}

// Las pasadas quedan completadas o canceladas, así que no ocupan cupos ni stock.
function crearHistorica(usuario, recursos) {
  const tipo = elegir(['unica', 'unica', 'diaria', 'semanal']);
  const inicio = enDias(-entero(35, 180));
  return {
    user: usuario._id,
    resources: [elegir(recursos)._id],
    bloques: bloquesSeguidos(entero(1, 3)),
    fechaInicio: inicio,
    fechaFin: calcularFin(inicio, tipo),
    tipoRecurrencia: tipo,
    status: azar() < 0.8 ? 'completed' : 'cancelled',
  };
}

function generarReservas(usuarios, recursos) {
  const disponibles = recursos.filter((r) => r.status === 'available');
  const reservas = [];

  usuarios.forEach(({ doc, datos }) => {
    if (datos.plan === 'plus') {
      for (let i = 0; i < datos.historicas; i++) reservas.push(crearHistorica(doc, recursos));
      // Cada reserva activa usa un recurso distinto: los cupos se suman exactos.
      const propios = [...disponibles];
      datos.cupos.forEach((cantidad) => {
        const nueva = crearActiva(doc, propios, cantidad, 'unica');
        propios.splice(propios.findIndex((r) => r._id.equals(nueva.resources[0])), 1);
        reservas.push(nueva);
      });
      return;
    }

    for (let i = 0; i < datos.reservas; i++) {
      if (i % 5 < 3) {
        reservas.push(crearHistorica(doc, recursos));
      } else {
        const tipo = elegir(['unica', 'unica', 'diaria', 'semanal', 'mensual']);
        const reserva = crearActiva(doc, disponibles, entero(1, 3), tipo);
        // Algunas futuras canceladas, para que el filtro por estado tenga datos.
        if (i % 10 === 9) reserva.status = 'cancelled';
        reservas.push(reserva);
      }
    }
  });

  return reservas;
}

// Comprueba las mismas reglas que el backend antes de escribir.
function validar(reservas, usuarios, recursos) {
  const porId = new Map(recursos.map((r) => [r._id.toString(), r]));
  const conteo = new Map();
  const cupos = new Map();

  reservas.filter((r) => r.status === 'active').forEach((r) => {
    r.resources.forEach((id) => {
      clavesDe({ _id: id }, r.bloques, r.fechaInicio, r.fechaFin, r.tipoRecurrencia).forEach((c) => {
        conteo.set(c, (conteo.get(c) || 0) + 1);
        if (conteo.get(c) > porId.get(id.toString()).stock) throw new Error(`Stock superado: ${c}`);
      });
      r.bloques.forEach((b) => {
        const clave = r.user.toString();
        if (!cupos.has(clave)) cupos.set(clave, new Set());
        cupos.get(clave).add(`${id}-${b}`);
      });
    });
  });

  usuarios.filter(({ datos }) => datos.plan === 'plus').forEach(({ doc }) => {
    const usados = cupos.get(doc._id.toString())?.size || 0;
    if (usados > LIMITE_PLAN_PLUS) throw new Error(`${doc.username} supera el límite del plan`);
  });
  return cupos;
}

async function asegurarUsuario({ username, plan }, passwordHash) {
  const existente = await User.findOne({ username });
  if (existente) return existente;
  return User.create({ username, email: `${username}@demo.reservaya.uy`, passwordHash, rol: 'user', plan });
}

async function main() {
  await connectMongoDB();
  console.log(`Base de datos: ${mongoose.connection.name}`);

  const adminExiste = await User.findOne({ username: 'admin' });
  if (!adminExiste) {
    await User.create({
      username: 'admin',
      email: 'admin@obligatorio.com',
      passwordHash: await bcrypt.hash('admin1234', 10),
      rol: 'admin',
      plan: 'premium',
    });
  }

  const categorias = new Map();
  for (const datos of CATEGORIAS) {
    const doc = (await Category.findOne({ name: datos.name })) || (await Category.create(datos));
    categorias.set(datos.name, doc);
  }

  const recursos = [];
  for (const [name, categoria, stock, description, status = 'available'] of RECURSOS) {
    const doc =
      (await Resource.findOne({ name })) ||
      (await Resource.create({ name, description, stock, status, category: categorias.get(categoria)._id }));
    recursos.push(doc);
  }

  const passwordHash = await bcrypt.hash(PASSWORD_DEMO, 10);
  const usuarios = [];
  for (const datos of USUARIOS) {
    usuarios.push({ datos, doc: await asegurarUsuario(datos, passwordHash) });
  }

  const reservas = generarReservas(usuarios, recursos);
  const cupos = validar(reservas, usuarios, recursos);

  await Reservation.deleteMany({ user: { $in: usuarios.map((u) => u.doc._id) } });
  await Reservation.insertMany(reservas);

  console.table(usuarios.map(({ datos, doc }) => ({
    usuario: doc.username,
    plan: datos.plan,
    reservas: reservas.filter((r) => r.user.equals(doc._id)).length,
    cupos: cupos.get(doc._id.toString())?.size || 0,
  })));
  console.log(`Totales en la base: ${await Category.countDocuments()} categorías, ${await Resource.countDocuments()} recursos, ${await User.countDocuments()} usuarios, ${await Reservation.countDocuments()} reservas.`);
  console.log(`Contraseña de los usuarios demo: ${PASSWORD_DEMO}`);
  process.exit(0);
}

main().catch((err) => {
  console.error('Error cargando los datos demo:', err);
  process.exit(1);
});
