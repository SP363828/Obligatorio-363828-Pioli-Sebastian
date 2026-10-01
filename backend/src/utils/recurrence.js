// Devuelve las fechas en las que aplica una reserva recurrente.

function toDateOnly(date) {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

function expandOccurrences(fechaInicio, fechaFin, tipoRecurrencia) {
  const inicio = toDateOnly(fechaInicio);
  const fin = toDateOnly(fechaFin);
  const fechas = [];

  if (inicio > fin) {
    throw new Error('fechaInicio no puede ser posterior a fechaFin');
  }

  if (tipoRecurrencia === 'unica') {
    fechas.push(inicio);
    return fechas;
  }

  const actual = new Date(inicio);

  while (actual <= fin) {
    fechas.push(new Date(actual));

    if (tipoRecurrencia === 'diaria') {
      actual.setUTCDate(actual.getUTCDate() + 1);
    } else if (tipoRecurrencia === 'semanal') {
      actual.setUTCDate(actual.getUTCDate() + 7);
    } else if (tipoRecurrencia === 'mensual') {
      actual.setUTCMonth(actual.getUTCMonth() + 1);
    } else {
      throw new Error(`tipoRecurrencia inválido: ${tipoRecurrencia}`);
    }
  }

  return fechas;
}

module.exports = { expandOccurrences };