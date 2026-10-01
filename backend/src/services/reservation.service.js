const { findResourceById } = require('../repositories/resource.repository');
const {
  findActiveByResources,
  findActiveByUser,
  findReservationById,
  addReservation,
  updateReservation,
} = require('../repositories/reservation.repository');
const { expandOccurrences } = require('../utils/recurrence');

const LIMITE_PLAN_PLUS = 4;

function crearError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

async function cargarRecursos(resourceIds) {
  const recursos = await Promise.all(resourceIds.map((id) => findResourceById(id)));
  const inexistenteIdx = recursos.findIndex((r) => !r);

  if (inexistenteIdx !== -1) {
    throw crearError(404, `El recurso ${resourceIds[inexistenteIdx]} no existe`);
  }

  return recursos;
}

// Compara cada recurso, horario y fecha con las reservas activas.
// excludeId evita comparar la reserva consigo misma al editarla.
async function chequearDisponibilidad(
  { recursos, bloques, fechaInicio, fechaFin, tipoRecurrencia },
  excludeId
) {
  const ocurrenciasNueva = expandOccurrences(fechaInicio, fechaFin, tipoRecurrencia);
  const resourceIds = recursos.map((r) => r.id);

  const reservasExistentes = (await findActiveByResources(resourceIds)).filter(
    (r) => !excludeId || r.id !== excludeId
  );

  for (const recurso of recursos) {
    for (const bloque of bloques) {
      for (const fecha of ocurrenciasNueva) {
        const ocupadas = reservasExistentes.filter((r) => {
          const incluyeRecurso = r.resources.some((resId) => resId.toString() === recurso.id);
          const incluyeBloque = r.bloques.includes(bloque);
          if (!incluyeRecurso || !incluyeBloque) return false;

          const ocurrenciasExistente = expandOccurrences(
            r.fechaInicio,
            r.fechaFin,
            r.tipoRecurrencia
          );
          return ocurrenciasExistente.some((f) => f.getTime() === fecha.getTime());
        }).length;

        if (ocupadas >= recurso.stock) {
          const fechaTexto = fecha.toISOString().slice(0, 10);
          throw crearError(
            409,
            `"${recurso.name}" no tiene disponibilidad el ${fechaTexto} a las ${bloque}`
          );
        }
      }
    }
  }
}

// El plan plus cuenta combinaciones activas distintas de recurso y horario.
async function chequearLimitePlan({ userId, plan, resourceIds, bloques }, excludeId) {
  if (plan !== 'plus') return;

  const reservasActivas = (await findActiveByUser(userId)).filter(
    (r) => !excludeId || r.id !== excludeId
  );

  const combinaciones = new Set();

  reservasActivas.forEach((r) => {
    r.resources.forEach((resId) => {
      r.bloques.forEach((bloque) => {
        combinaciones.add(`${resId}-${bloque}`);
      });
    });
  });

  resourceIds.forEach((resId) => {
    bloques.forEach((bloque) => {
      combinaciones.add(`${resId}-${bloque}`);
    });
  });

  if (combinaciones.size > LIMITE_PLAN_PLUS) {
    throw crearError(
      409,
      `Superaste el límite de ${LIMITE_PLAN_PLUS} combinaciones recurso+horario activas de tu plan plus. Cambiá a premium o liberá alguna reserva.`
    );
  }
}

async function crearReserva({
  userId,
  plan,
  resources,
  bloques,
  fechaInicio,
  fechaFin,
  tipoRecurrencia,
}) {
  const recursos = await cargarRecursos(resources);

  await chequearDisponibilidad({ recursos, bloques, fechaInicio, fechaFin, tipoRecurrencia });
  await chequearLimitePlan({ userId, plan, resourceIds: resources, bloques });

  return addReservation({
    user: userId,
    resources,
    bloques,
    fechaInicio,
    fechaFin,
    tipoRecurrencia,
    status: 'active',
  });
}

async function actualizarReserva(id, {
  userId,
  plan,
  resources,
  bloques,
  fechaInicio,
  fechaFin,
  tipoRecurrencia,
}) {
  const existente = await findReservationById(id);
  if (!existente) {
    throw crearError(404, 'Reserva no encontrada');
  }

  const recursos = await cargarRecursos(resources);

  await chequearDisponibilidad({ recursos, bloques, fechaInicio, fechaFin, tipoRecurrencia }, id);
  await chequearLimitePlan({ userId, plan, resourceIds: resources, bloques }, id);

  return updateReservation(id, {
    resources,
    bloques,
    fechaInicio,
    fechaFin,
    tipoRecurrencia,
  });
}

module.exports = { crearReserva, actualizarReserva };