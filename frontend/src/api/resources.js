import { request } from './client'

// Si viene imagen se envía como multipart (campo "imagen"), si no como JSON.
const toBody = (data) => {
  if (!data.imagen) {
    const { imagen: _imagen, ...rest } = data
    return rest
  }
  const fd = new FormData()
  Object.entries(data).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') fd.append(k, v)
  })
  return fd
}

export const getResourcesApi = (query) => request('/recursos', { query })
export const createResourceApi = (data) => request('/recursos', { method: 'POST', body: toBody(data) })
export const updateResourceApi = (id, data) => request(`/recursos/${id}`, { method: 'PUT', body: toBody(data) })
export const deleteResourceApi = (id) => request(`/recursos/${id}`, { method: 'DELETE' })
