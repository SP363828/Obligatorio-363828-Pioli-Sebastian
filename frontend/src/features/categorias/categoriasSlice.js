import { createSlice } from '@reduxjs/toolkit'
import { cerrarSesion } from '../auth/authSlice'

const initialState = {
  todas: [],
}

export const categoriasSlice = createSlice({
  name: 'categorias',
  initialState,
  reducers: {
    guardarCategorias: (state, action) => {
      state.todas = action.payload
    },
    agregarCategoria: (state, action) => {
      state.todas.push(action.payload)
    },
    modificarCategoria: (state, action) => {
      state.todas = state.todas.map((c) => (c._id === action.payload._id ? action.payload : c))
    },
    eliminarCategoria: (state, action) => {
      state.todas = state.todas.filter((c) => c._id !== action.payload)
    },
  },
  extraReducers: (builder) => {
    builder.addCase(cerrarSesion, () => initialState)
  },
})

export const { guardarCategorias, agregarCategoria, modificarCategoria, eliminarCategoria } = categoriasSlice.actions
export default categoriasSlice.reducer
