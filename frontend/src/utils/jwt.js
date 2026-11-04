// Decodifica el payload del JWT (sin verificar firma, eso lo hace el backend).
export function decodeToken(token) {
  try {
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(atob(payload))
  } catch {
    return null
  }
}

export function isTokenExpired(token) {
  const payload = decodeToken(token)
  return !payload || payload.exp * 1000 < Date.now()
}
