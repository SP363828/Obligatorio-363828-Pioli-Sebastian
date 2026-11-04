import { configureStore } from '@reduxjs/toolkit'
import authReducer, { cerrarSesion } from '../features/auth/authSlice'
import reservasReducer from '../features/reservas/reservasSlice'
import recursosReducer from '../features/recursos/recursosSlice'
import categoriasReducer from '../features/categorias/categoriasSlice'
import traduccionesReducer from '../features/traducciones/traduccionesSlice'
import { setOnUnauthorized } from '../api/client'

// Única fuente de verdad. El nombre de cada propiedad es la "porción" del state.
export const store = configureStore({
  reducer: {
    auth: authReducer,
    reservas: reservasReducer,
    recursos: recursosReducer,
    categorias: categoriasReducer,
    traducciones: traduccionesReducer,
  },
})

// Si la API responde 401 (token vencido o inválido) se cierra la sesión.
setOnUnauthorized(() => store.dispatch(cerrarSesion()))
