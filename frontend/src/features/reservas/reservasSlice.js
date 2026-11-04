import { createSlice } from '@reduxjs/toolkit'
import { cerrarSesion } from '../auth/authSlice'

export const FILTROS_INICIALES = {
  q: '', status: '', resource: '', tipoRecurrencia: '', desde: '', hasta: '', sort: 'fechaInicio', page: 1, limit: 5,
}

const initialState = {
  todas: [], // todas las reservas del usuario: informe de uso y gráficas
  listado: [], // página actual del listado (con filtros)
  meta: null, // { page, limit, total, totalPages }
  filtros: FILTROS_INICIALES,
}

export const reservasSlice = createSlice({
  name: 'reservas',
  initialState,
  reducers: {
    guardarTodas: (state, action) => {
      state.todas = action.payload
    },
    guardarListado: (state, action) => {
      state.listado = action.payload.data
      state.meta = action.payload.meta
    },
    agregarReserva: (state, action) => {
      state.todas.push(action.payload)
    },
    modificarReserva: (state, action) => {
      const reemplazar = (r) => (r._id === action.payload._id ? action.payload : r)
      state.todas = state.todas.map(reemplazar)
      state.listado = state.listado.map(reemplazar)
    },
    eliminarReserva: (state, action) => {
      state.todas = state.todas.filter((r) => r._id !== action.payload)
      state.listado = state.listado.filter((r) => r._id !== action.payload)
    },
    cambiarFiltros: (state, action) => {
      // Al cambiar un filtro se vuelve a la página 1, salvo que se pida una página.
      state.filtros = { ...state.filtros, page: 1, ...action.payload }
    },
  },
  // Al cerrar sesión se limpia todo para que otro usuario no vea estos datos.
  extraReducers: (builder) => {
    builder.addCase(cerrarSesion, () => initialState)
  },
})

export const { guardarTodas, guardarListado, agregarReserva, modificarReserva, eliminarReserva, cambiarFiltros } =
  reservasSlice.actions
export default reservasSlice.reducer
