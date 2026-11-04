import { createSlice } from '@reduxjs/toolkit'

// Caché de traducciones de contenido dinámico: { 'en:Proyector portátil': 'Portable projector' }.
// null significa que esa traducción falló: se muestra el original y no se reintenta.
const initialState = {
  porClave: {},
}

export const traduccionesSlice = createSlice({
  name: 'traducciones',
  initialState,
  reducers: {
    guardarTraduccion: (state, action) => {
      state.porClave[action.payload.clave] = action.payload.traduccion
    },
  },
})

export const { guardarTraduccion } = traduccionesSlice.actions
export default traduccionesSlice.reducer
