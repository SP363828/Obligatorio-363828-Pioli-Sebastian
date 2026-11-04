import * as yup from 'yup'
import { BLOQUES, RECURRENCIAS, ESTADOS_RECURSO } from '../utils/constants'

// Las reglas replican las de Joi en el backend para no hacer requests inválidos
// (validación en el frontend = menos carga para el servidor).

// Un input type="date" vacío llega como "" → lo convertimos a null para que no sea "Invalid Date".
const fecha = () =>
  yup
    .date()
    .transform((value, original) => (original === '' ? null : value))
    .nullable()
    .typeError('Fecha inválida')

// Yup interpreta "AAAA-MM-DD" como medianoche UTC, así que "hoy" también se arma en UTC
// (si no, en Uruguay -3h la fecha de hoy quedaría como pasada).
const hoy = () => {
  const d = new Date()
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
}

export const loginSchema = yup.object().shape({
  username: yup.string().trim().required('Ingresá tu usuario'),
  password: yup.string().required('Ingresá tu contraseña'),
})

export const registerSchema = yup.object().shape({
  username: yup
    .string()
    .trim()
    .required('El usuario es obligatorio')
    .matches(/^[a-zA-Z0-9]+$/, 'Solo letras y números, sin espacios')
    .min(3, 'Mínimo 3 caracteres')
    .max(30, 'Máximo 30 caracteres'),
  email: yup.string().trim().required('El email es obligatorio').email('Email inválido'),
  password: yup
    .string()
    .required('La contraseña es obligatoria')
    .min(6, 'Mínimo 6 caracteres')
    .matches(/\d/, 'Debe incluir al menos un número'),
  passwordRepeat: yup
    .string()
    .required('Repetí la contraseña')
    .oneOf([yup.ref('password')], 'Las contraseñas no coinciden'),
  // yup.bool(): solo se valida en el front, no se envía a la API.
  aceptaTerminos: yup.bool().oneOf([true], 'Tenés que aceptar los términos y condiciones'),
})

export const reservaSchema = yup.object().shape({
  resources: yup.array().of(yup.string()).min(1, 'Elegí al menos un recurso'),
  bloques: yup.array().of(yup.string().oneOf(BLOQUES)).min(1, 'Elegí al menos un bloque horario'),
  tipoRecurrencia: yup.string().oneOf(RECURRENCIAS, 'Recurrencia inválida').required('Elegí la recurrencia'),
  fechaInicio: fecha().required('La fecha de inicio es obligatoria'),
  // yup.when(): la fecha de fin solo se pide si la reserva se repite.
  fechaFin: fecha().when('tipoRecurrencia', {
    is: 'unica',
    then: (schema) => schema.notRequired(),
    otherwise: (schema) =>
      schema
        .required('Indicá hasta cuándo se repite')
        .min(yup.ref('fechaInicio'), 'Debe ser igual o posterior a la fecha de inicio'),
  }),
})

// Para el alta además no se permiten fechas pasadas.
export const nuevaReservaSchema = reservaSchema.shape({
  fechaInicio: fecha().required('La fecha de inicio es obligatoria').min(hoy(), 'No podés reservar en el pasado'),
})

export const categoriaSchema = yup.object().shape({
  name: yup.string().trim().required('El nombre es obligatorio').min(3, 'Mínimo 3 caracteres').max(100, 'Máximo 100 caracteres'),
  description: yup.string().max(500, 'Máximo 500 caracteres'),
})

const MAX_IMG = 5 * 1024 * 1024

export const recursoSchema = yup.object().shape({
  name: yup.string().trim().required('El nombre es obligatorio').max(100, 'Máximo 100 caracteres'),
  description: yup.string().max(500, 'Máximo 500 caracteres'),
  stock: yup
    .number()
    .typeError('Debe ser un número')
    .required('El stock es obligatorio')
    .integer('Debe ser un número entero')
    .min(0, 'No puede ser negativo'),
  category: yup.string().required('Elegí una categoría'),
  status: yup.string().oneOf(ESTADOS_RECURSO),
  imagen: yup
    .mixed()
    .nullable()
    .test('tipo', 'El archivo debe ser una imagen', (f) => !f || f.type?.startsWith('image/'))
    .test('tamaño', 'La imagen no puede superar 5MB', (f) => !f || f.size <= MAX_IMG),
})

// Convierte los valores del formulario al formato que espera la API.
export const reservaToApi = (data) => ({
  resources: data.resources,
  bloques: data.bloques,
  tipoRecurrencia: data.tipoRecurrencia,
  fechaInicio: data.fechaInicio.toISOString(),
  fechaFin: (data.tipoRecurrencia === 'unica' || !data.fechaFin ? data.fechaInicio : data.fechaFin).toISOString(),
})
