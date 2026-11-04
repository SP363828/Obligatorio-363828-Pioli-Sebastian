import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  es: {
    translation: {
      nav: {
        dashboard: 'Inicio', reservas: 'Mis reservas', recursos: 'Recursos', categorias: 'Categorías', logout: 'Cerrar sesión',
        dashboardDesc: 'Resumen y estadísticas', reservasDesc: 'Crear y gestionar', recursosDesc: 'Salas y equipos', categoriasDesc: 'Organizar el catálogo',
        theme: 'Tema', language: 'Idioma', admin: 'Administración',
      },
      auth: {
        loginTitle: 'Bienvenido de nuevo', loginSubtitle: 'Ingresá para gestionar tus reservas',
        registerTitle: 'Creá tu cuenta', registerSubtitle: 'Empezá gratis con el plan Plus',
        username: 'Usuario', email: 'Email', password: 'Contraseña', passwordRepeat: 'Repetir contraseña',
        login: 'Ingresar', register: 'Registrarme', noAccount: '¿No tenés cuenta?', hasAccount: '¿Ya tenés cuenta?',
        goRegister: 'Registrate', goLogin: 'Ingresá',
      },
      dashboard: { hello: 'Hola, {{name}}', subtitle: 'Este es el resumen de tu actividad', charts: 'Estadísticas' },
      usage: { title: 'Uso del plan', plus: 'Plan Plus', premium: 'Plan Premium', used: '{{used}} de {{max}} cupos usados', total: 'Reservas totales', unlimited: 'Reservas ilimitadas' },
      plan: { title: 'Pasate a Premium', desc: 'Reservas ilimitadas y sin restricciones de cupos.', cta: 'Cambiar a Premium', already: 'Ya sos Premium ✨' },
      reservas: { title: 'Mis reservas', new: 'Nueva reserva', empty: 'Todavía no tenés reservas' },
      traduccion: { verOriginal: 'Traducido automáticamente · Ver original', verTraducido: 'Ver traducción' },
      common: { save: 'Guardar', cancel: 'Cancelar', edit: 'Editar', delete: 'Eliminar', loading: 'Cargando...', all: 'Todos' },
    },
  },
  en: {
    translation: {
      nav: {
        dashboard: 'Home', reservas: 'My bookings', recursos: 'Resources', categorias: 'Categories', logout: 'Log out',
        dashboardDesc: 'Summary and stats', reservasDesc: 'Create and manage', recursosDesc: 'Rooms and equipment', categoriasDesc: 'Organize the catalog',
        theme: 'Theme', language: 'Language', admin: 'Administration',
      },
      auth: {
        loginTitle: 'Welcome back', loginSubtitle: 'Sign in to manage your bookings',
        registerTitle: 'Create your account', registerSubtitle: 'Start for free with the Plus plan',
        username: 'Username', email: 'Email', password: 'Password', passwordRepeat: 'Repeat password',
        login: 'Sign in', register: 'Sign up', noAccount: "Don't have an account?", hasAccount: 'Already have an account?',
        goRegister: 'Sign up', goLogin: 'Sign in',
      },
      dashboard: { hello: 'Hi, {{name}}', subtitle: 'Here is a summary of your activity', charts: 'Statistics' },
      usage: { title: 'Plan usage', plus: 'Plus plan', premium: 'Premium plan', used: '{{used}} of {{max}} slots used', total: 'Total bookings', unlimited: 'Unlimited bookings' },
      plan: { title: 'Go Premium', desc: 'Unlimited bookings with no slot limits.', cta: 'Upgrade to Premium', already: "You're Premium ✨" },
      reservas: { title: 'My bookings', new: 'New booking', empty: "You don't have bookings yet" },
      traduccion: { verOriginal: 'Automatically translated · See original', verTraducido: 'See translation' },
      common: { save: 'Save', cancel: 'Cancel', edit: 'Edit', delete: 'Delete', loading: 'Loading...', all: 'All' },
    },
  },
}

let lng = 'es'
try { lng = localStorage.getItem('lang') || 'es' } catch { /* sin storage */ }

i18n.use(initReactI18next).init({ resources, lng, fallbackLng: 'es', interpolation: { escapeValue: false } })

export default i18n
