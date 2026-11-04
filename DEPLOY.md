# Deploy en Vercel

Son dos proyectos de Vercel conectados al mismo repositorio: uno para `backend` y otro para `frontend`.

## 1. Mongo Atlas
1. En **Network Access**, agregar `0.0.0.0/0`. Vercel no tiene una IP fija.
2. Cargar los datos demo en la base `Reservas`: `cd backend && npm run seed:demo`. Se puede repetir para refrescar las fechas.

## 2. Backend
En el proyecto actual (`obligatorio-363828-pioli-sebastian`), revisar **Settings**:
- **Root Directory:** `backend`
- **Environment Variables:** los mismos valores de `backend/.env`, salvo `CORS_ORIGIN`:

| Variable | Valor |
|---|---|
| `SECRET_KEY` | El de tu `.env` |
| `MONGODB_CONNECTION_STRING` | El de tu `.env` |
| `MONGODB_DATABASE_NAME` | `Reservas` |
| `MONGODB_CONNECTION_TIMEOUT` | El de tu `.env` |
| `GEMINI_API_KEY` | El de tu `.env` |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Los de tu `.env` |
| `CORS_ORIGIN` | `http://localhost:5173` por ahora (paso 4) |

Hacer commit y push, o **Redeploy**. Las variables nuevas solo aplican después de un redeploy.

Comprobar: abrir `https://obligatorio-363828-pioli-sebastian.vercel.app/api/v1/ping`. Debe responder `{"message":"pong"}`.

## 3. Frontend
Crear un proyecto nuevo en Vercel con el mismo repositorio:
- **Root Directory:** `frontend`
- **Framework Preset:** Vite
- **Environment Variable:** `VITE_API_URL` = `https://obligatorio-363828-pioli-sebastian.vercel.app/api/v1`

`frontend/vercel.json` ya evita el 404 al recargar rutas internas.

## 4. Conectar los dos
En el backend, cambiar `CORS_ORIGIN` por la URL del frontend, sin barra final, separada por coma de localhost:

```
https://tu-frontend.vercel.app,http://localhost:5173
```

Redeployar el backend y guardar la URL del frontend en `URL Deploy.txt`.

## 5. Usuarios para probar
Contraseña de todos: `Demo1234`, salvo admin (`admin1234`).

| Usuario | Plan | Para probar |
|---|---|---|
| `admin` | Admin | Categorías y recursos con imágenes |
| `luciafernandez` | Plus | Sin reservas: estados vacíos y primera reserva |
| `martinsosa` | Plus | 2 de 4 cupos |
| `diegopereira` | Plus | 3 de 4 cupos |
| `valentinarodriguez` | Plus | 4 de 4 cupos: formulario bloqueado y cambio a Premium |
| `camilagonzalez` | Premium | 26 reservas: paginación, filtros y gráficas |
| `nicolasmartinez`, `sofiaalvarez`, `anaclarabenitez` | Premium | Uso normal |

Si cambiás de plan a `valentinarodriguez`, queda Premium. El seed no vuelve atrás los planes.

## 6. Lista de prueba
- [ ] Registro con auto-login, login con error en pantalla, logout.
- [ ] Recargar `/reservas` no da 404.
- [ ] Alta, edición inline, baja y filtros de reservas.
- [ ] Usuario al límite bloqueado; cambio a Premium lo desbloquea.
- [ ] Gráficas con datos.
- [ ] Admin: crear recurso con imagen; borrar categoría en uso da error.
- [ ] Usuario común no entra a `/admin/categorias`.
- [ ] Interfaz en inglés traduce descripciones.
- [ ] Recomendador de IA responde.
- [ ] Colección de Postman completa, sin fallos.
