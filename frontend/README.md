# ReservaYa: Frontend (Obligatorio 2)

El frontend en React del sistema de inventario y reservas. Consume la API del Obligatorio 1, publicada en
`https://obligatorio-363828-pioli-sebastian.vercel.app/api/v1`.

## Stack

| Necesidad | Herramienta |
|---|---|
| UI | React + Vite |
| Estado global | Redux Toolkit + react-redux (`configureStore`, `createSlice`, `useSelector`, `useDispatch`) |
| Navegación | React Router (rutas públicas, protegidas y de admin) |
| Formularios | React Hook Form + Yup (`yupResolver`) |
| Estilos | Tailwind CSS |
| Gráficas | Recharts |
| Notificaciones | react-hot-toast |
| Idiomas | i18next (ES / EN) |

### ¿Por qué React Hook Form y no Formik?
- RHF registra los inputs con **refs** en vez de `useState`. Así evita que el formulario se vuelva a renderizar en cada tecla.
- Se integra con Yup mediante `@hookform/resolvers`.
- Requiere menos código.
- Los hooks que usamos son `useForm`, `register`, `handleSubmit`, `formState.errors`, `watch`, `reset`, `Controller` y `control`.

## Correr el proyecto

```bash
npm install
npm run dev      # desarrollo
npm run build    # genera la carpeta dist/ (versión compilada)
```

Variable de entorno (archivo `.env`, ver `.env.example`):

```
VITE_API_URL=https://obligatorio-363828-pioli-sebastian.vercel.app/api/v1
```

## Estructura

```
src/
  app/store.js            → configureStore con todos los reducers
  features/               → un slice por entidad (como en clase)
    auth/authSlice.js         iniciarSesion, cerrarSesion
    reservas/reservasSlice.js guardarTodas, guardarListado, agregar/modificar/eliminarReserva, cambiarFiltros
    recursos/recursosSlice.js guardarRecursos, agregar/modificar/eliminarRecurso
    categorias/categoriasSlice.js
  api/                    → funciones que hablan con el backend (fetch)
    client.js                 URL base, token Bearer, manejo de errores y 401
  validation/schemas.js   → esquemas Yup (login, registro, reserva, recurso, categoría)
  routes/                 → ProtectedRoute, PublicRoute, AdminRoute
  pages/                  → una pantalla por ruta
  components/             → componentes reutilizables
  i18n/                   → traducciones
```

### Flujo de datos (Redux)
1. Un componente llama a la API, por ejemplo `createReservationApi(datos)`.
2. Con la respuesta hace `dispatch(agregarReserva(nueva))`.
3. El reducer del slice actualiza el state. Redux usa Immer, así que el reducer puede "mutar" el state.
4. Todos los componentes que leen ese dato con `useSelector` se actualizan solos.

**¿Qué va a Redux y qué a `useState`?**
- **Redux** guarda la información que usan varios componentes:
  - la sesión;
  - el catálogo de recursos;
  - las categorías;
  - las reservas, que usan el informe de uso, las gráficas, el formulario y el listado;
  - los filtros del listado.
- **`useState`** guarda lo que usa un solo componente:
  - si un modal está abierto;
  - el modo edición de una fila;
  - la página filtrada de la pantalla de Recursos.

Al hacer **logout** se dispara `cerrarSesion()`. Todos los slices la escuchan en `extraReducers` y vuelven a su estado inicial, así el próximo usuario no ve datos del anterior.

## Planificación de componentes (thinking in React)

```
App (Routes)
├── PublicRoute
│   ├── Login ── AuthLayout, Field, PasswordInput
│   └── Register ── AuthLayout, Field, PasswordInput, PasswordStrength
└── ProtectedRoute
    └── AppLayout (carga recursos, categorías y reservas en el store)
        ├── Sidebar / Topbar (ThemeToggle, LanguageToggle, logout)
        ├── Dashboard
        │   ├── UsageReport      → % de cupos usados (plus) o cantidad (premium)
        │   ├── PlanUpgrade      → cambio de plan a premium
        │   ├── AiRecommender    → recomendación con IA (Gemini, vía backend)
        │   └── Charts           → 3 gráficas
        ├── Reservas
        │   ├── ReservaForm      → alta (bloqueada al llegar al límite del plan plus)
        │   └── ReservaList
        │       ├── ReservaFilters
        │       ├── ReservaItem × N  → edición inline + eliminar
        │       ├── Pagination
        │       └── ConfirmDialog
        ├── Recursos
        │   ├── RecursoCard × N  → traducción de la descripción (API de terceros)
        │   └── RecursoForm (admin) → ImageUpload (Cloudinary)
        └── AdminRoute
            └── Categorias       → ABM de categorías
```

## Requerimientos de la letra

| # | Requerimiento | Dónde |
|---|---|---|
| 1 | Registro con repetir contraseña, botón deshabilitado si hay datos inválidos, auto-login | `pages/Register.jsx` |
| 2 | Login con botón deshabilitado si algún campo está vacío y error en pantalla | `pages/Login.jsx` |
| 3 | Logout | `components/layout/Topbar.jsx` |
| 4 | Alta de documento (reserva) respetando el límite del plan | `components/reservas/ReservaForm.jsx` |
| 5 | Listado, eliminar, editar inline y filtros | `components/reservas/ReservaList.jsx`, `ReservaItem.jsx`, `ReservaFilters.jsx` |
| 6.1 | Porcentaje (plus) o cantidad (premium) | `components/dashboard/UsageReport.jsx` |
| 6.2 | Cambio de plan | `components/dashboard/PlanUpgrade.jsx` |
| 7 | Gráficas | `components/dashboard/Charts.jsx` |
| — | Manejo de imágenes | `components/recursos/ImageUpload.jsx`, `RecursoForm.jsx` |

## Validaciones con Yup (front, antes de llamar a la API)
- `yup.object().shape({...})` en todos los esquemas.
- `string()` con `required`, `min`, `max`, `email`, `matches` y `oneOf([yup.ref('password')])` para repetir la contraseña.
- `date()` para las fechas de la reserva: no se aceptan fechas pasadas y la de fin tiene que ser mayor o igual a la de inicio (`min(yup.ref('fechaInicio'))`).
- `bool()` para aceptar los términos del registro.
- `when()` en la fecha de fin: solo es obligatoria si la reserva se repite (`tipoRecurrencia !== 'unica'`).
- `mixed().test()` para la imagen: tiene que ser una imagen de 5MB o menos.

## Extras
- Recomendador con IA que precarga el recurso sugerido en el formulario de reserva.
- Traducción de las descripciones con la API de terceros (MyMemory).
- Interfaz en español e inglés y modo oscuro.
- Code splitting con `React.lazy` y `Suspense`.
- Debounce en la búsqueda de recursos.
- Skeletons de carga y modales de confirmación.
- Indicador de fortaleza de la contraseña y botón para mostrarla u ocultarla.
- Logout automático cuando vence el token (respuesta 401 o fecha de expiración del JWT).

## Diseño
La paleta y la tipografía toman como referencia la identidad de **FADU** (www.fadu.edu.uy). Todos los colores son tokens de Tailwind definidos en `src/index.css` con `@theme`.

| Token | Color | Uso |
|---|---|---|
| `ink` / `paper` | `#000` / `#fff` | Base: texto y fondos. El botón principal es negro. |
| `paper-alt`, `line`, `ink-muted` | `#f2f4f7`, `#e3e7f0`, `#646464` | Fondo de la app, bordes y texto secundario |
| `brand-naranja` | `#fb6435` | Acción destacada y alertas. Lleva texto negro, porque el blanco no llega al contraste AA. |
| `brand-lima`, `celeste`, `rosa`, `amarillo`, `lavanda`, `menta` | pasteles FADU | Tarjetas de color plano: accesos rápidos, sección activa, IA, plan, estados |

- **Tipografía:** DM Sans para el texto y DM Mono para etiquetas, fechas y horarios, en mayúsculas como los códigos de carrera de FADU.
- **Gráficas:** usan azul, naranja y menta de FADU. El menta original es demasiado claro para una gráfica, así que se usa una versión más oscura, validada para daltonismo.
- **Navegación:**
  - En escritorio hay una barra lateral con descripción de cada sección y un resumen del plan.
  - En celulares hay una barra inferior.
  - Cada pantalla abre con un encabezado que explica para qué sirve.
- **Ayudas al usuario:**
  - El formulario de reserva está dividido en 3 pasos y muestra un resumen en vivo.
  - Las listas vacías explican qué hacer y ofrecen un botón para el siguiente paso.
  - Hay confirmación antes de eliminar y spinners mientras se procesa algo.
  - Íconos SVG de `lucide-react`.

## Deploy (Vercel)
- Root directory: `frontend`.
- Variable de entorno `VITE_API_URL`.
- `vercel.json` redirige todas las rutas a `index.html` (SPA), así recargar una ruta interna no da 404.
- En el backend hay que agregar la URL del frontend a `CORS_ORIGIN`.
