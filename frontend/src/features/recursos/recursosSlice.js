import { createSlice } from '@reduxjs/toolkit'
import { cerrarSesion } from '../auth/authSlice'

// Catálogo completo de recursos: lo usan el formulario de reservas, el listado,
// las gráficas y el recomendador de IA (por eso vive en el store global).
const initialState = {
  todos: [],
}

export const recursosSlice = createSlice({
  name: 'recursos',
  initialState,
  reducers: {
    guardarRecursos: (state, action) => {
      state.todos = action.payload
    },
    agregarRecurso: (state, action) => {
      state.todos.push(action.payload)
    },
    modificarRecurso: (state, action) => {
      state.todos = state.todos.map((r) => (r._id === action.payload._id ? action.payload : r))
    },
    eliminarRecurso: (state, action) => {
      state.todos = state.todos.filter((r) => r._id !== action.payload)
    },
  },
  extraReducers: (builder) => {
    builder.addCase(cerrarSesion, () => initialState)
  },
})

export const { guardarRecursos, agregarRecurso, modificarRecurso, eliminarRecurso } = recursosSlice.actions
export default recursosSlice.reducer
