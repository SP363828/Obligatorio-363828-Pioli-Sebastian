import { request } from './client'

export const getReservationsApi = (query) => request('/reservas', { query })
export const createReservationApi = (data) => request('/reservas', { method: 'POST', body: data })
export const updateReservationApi = (id, data) => request(`/reservas/${id}`, { method: 'PUT', body: data })
export const deleteReservationApi = (id) => request(`/reservas/${id}`, { method: 'DELETE' })

// Trae todas las páginas (para estadísticas y gráficas).
export async function getAllReservationsApi() {
  const first = await getReservationsApi({ page: 1, limit: 50 })
  let all = first.data
  for (let p = 2; p <= first.meta.totalPages; p++) {
    const next = await getReservationsApi({ page: p, limit: 50 })
    all = all.concat(next.data)
  }
  return all
}
