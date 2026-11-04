import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { store } from './app/store'
import './i18n'
import './index.css'
import App from './App'
import { aplicarTema, temaGuardado } from './utils/theme'

aplicarTema(temaGuardado())

// Toasts con el estilo de la marca: fondo negro, texto blanco, tipografía DM Sans.
const toastOptions = {
  style: { background: '#000', color: '#fff', borderRadius: '999px', fontSize: '14px', padding: '10px 16px' },
  success: { iconTheme: { primary: '#def294', secondary: '#000' } },
  error: { iconTheme: { primary: '#fb6435', secondary: '#000' } },
}

// Provider: hace disponible el store de Redux a toda la app.
// BrowserRouter: habilita el ruteo con React Router.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <Toaster position="top-center" toastOptions={toastOptions} />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
