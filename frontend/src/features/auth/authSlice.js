import { createSlice } from '@reduxjs/toolkit'
import { isTokenExpired } from '../../utils/jwt'

// Estado inicial desde localStorage (solo si el token no expiró).
const cargarSesion = () => {
  const token = localStorage.getItem('token')
  if (!token || isTokenExpired(token)) {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    return { token: null, usuario: null }
  }
  return { token, usuario: JSON.parse(localStorage.getItem('usuario')) }
}

const initialState = cargarSesion()

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // payload: { usuario, token } tal cual lo devuelve la API en login / registro / cambio de plan
    iniciarSesion: (state, action) => {
      state.token = action.payload.token
      state.usuario = action.payload.usuario
      localStorage.setItem('token', action.payload.token)
      localStorage.setItem('usuario', JSON.stringify(action.payload.usuario))
    },
    cerrarSesion: (state) => {
      state.token = null
      state.usuario = null
      localStorage.removeItem('token')
      localStorage.removeItem('usuario')
    },
  },
})

export const { iniciarSesion, cerrarSesion } = authSlice.actions
export default authSlice.reducer
