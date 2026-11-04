export const LIMITE_PLAN_PLUS = 4

// Bloques de 30 minutos entre 08:00 y 23:30 (igual que la validación del backend).
export const BLOQUES = Array.from({ length: 32 }, (_, i) => {
  const h = String(8 + Math.floor(i / 2)).padStart(2, '0')
  return `${h}:${i % 2 ? '30' : '00'}`
})

export const RECURRENCIAS = ['unica', 'diaria', 'semanal', 'mensual']
export const ESTADOS_RESERVA = ['active', 'completed', 'cancelled']
export const ESTADOS_RECURSO = ['available', 'maintenance', 'inactive']

// Cuenta pares recurso+bloque de reservas activas (misma regla que el backend).
export function countUsedSlots(reservations) {
  const set = new Set()
  reservations
    .filter((r) => r.status === 'active')
    .forEach((r) => r.resources.forEach((res) => r.bloques.forEach((b) => set.add(`${res}-${b}`))))
  return set.size
}

export const formatDate = (d) => new Date(d).toLocaleDateString('es-UY', { timeZone: 'UTC' })
export const toInputDate = (d) => new Date(d).toISOString().slice(0, 10)

export const ETIQUETA_RECURRENCIA = { unica: 'Única vez', diaria: 'Diaria', semanal: 'Semanal', mensual: 'Mensual' }
