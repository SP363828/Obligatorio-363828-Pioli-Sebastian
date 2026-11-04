// Cliente HTTP centralizado: agrega la URL base, el token y normaliza errores.
const BASE_URL = import.meta.env.VITE_API_URL

let onUnauthorized = () => {}
export const setOnUnauthorized = (fn) => { onUnauthorized = fn }

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}

export async function request(path, { method = 'GET', body, query, auth = true } = {}) {
  const url = new URL(BASE_URL + path)
  if (query) {
    Object.entries(query).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, v)
    })
  }

  const headers = {}
  const token = localStorage.getItem('token')
  if (auth && token) headers.Authorization = `Bearer ${token}`

  const isFormData = body instanceof FormData
  if (body && !isFormData) headers['Content-Type'] = 'application/json'

  let res
  try {
    res = await fetch(url, { method, headers, body: isFormData ? body : body ? JSON.stringify(body) : undefined })
  } catch {
    throw new ApiError('No se pudo conectar con el servidor', 0)
  }

  if (res.status === 204) return null
  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    if (res.status === 401 && auth) onUnauthorized()
    throw new ApiError(data.message || data.error || 'Ocurrió un error inesperado', res.status)
  }
  return data
}
