import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Lock } from 'lucide-react'
import Field from '../ui/Field'
import ChipSelect from '../ui/ChipSelect'
import Spinner from '../ui/Spinner'
import ReservaResumen from './ReservaResumen'
import { nuevaReservaSchema, reservaToApi } from '../../validation/schemas'
import { createReservationApi } from '../../api/reservations'
import { agregarReserva, cambiarFiltros } from '../../features/reservas/reservasSlice'
import { BLOQUES, RECURRENCIAS, LIMITE_PLAN_PLUS, ETIQUETA_RECURRENCIA, countUsedSlots } from '../../utils/constants'

const hoy = () => new Date().toISOString().slice(0, 10)
const VALORES_INICIALES = { resources: [], bloques: [], fechaInicio: hoy(), fechaFin: '', tipoRecurrencia: 'unica' }

// Bloques agrupados por franja: más fácil de recorrer que 32 botones seguidos.
const FRANJAS = [
  { nombre: 'Mañana', bloques: BLOQUES.filter((b) => b < '12:00') },
  { nombre: 'Tarde', bloques: BLOQUES.filter((b) => b >= '12:00' && b < '19:00') },
  { nombre: 'Noche', bloques: BLOQUES.filter((b) => b >= '19:00') },
]

// Encabezado numerado de cada paso del formulario.
function Paso({ numero, titulo, children }) {
  return (
    <section className="grid gap-4 border-t border-line pt-5 first:border-0 first:pt-0 md:grid-cols-[180px_1fr] dark:border-night-line">
      <div className="flex items-center gap-3 md:items-start">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-ink font-mono text-sm text-paper dark:bg-paper dark:text-ink">{numero}</span>
        <p className="font-semibold md:pt-1">{titulo}</p>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  )
}

// Alta de reserva en 3 pasos (un único useForm). Se bloquea si el usuario plus ya usó todos sus cupos.
export default function ReservaForm({ recursoPreseleccionado }) {
  const dispatch = useDispatch()
  const usuario = useSelector((state) => state.auth.usuario)
  const recursos = useSelector((state) => state.recursos.todos)
  const reservas = useSelector((state) => state.reservas.todas)

  const esPlus = usuario?.plan === 'plus' && usuario?.rol !== 'admin'
  const cuposLibres = esPlus ? LIMITE_PLAN_PLUS - countUsedSlots(reservas) : Infinity

  const { control, register, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(nuevaReservaSchema),
    defaultValues: VALORES_INICIALES,
  })

  // Si se llega desde el recomendador de IA o desde un recurso, se precarga.
  useEffect(() => {
    if (recursoPreseleccionado) setValue('resources', [recursoPreseleccionado])
  }, [recursoPreseleccionado, setValue])

  // watch(): para mostrar/ocultar campos, calcular cupos y armar el resumen en vivo.
  const valores = watch()
  const cuposNuevos = valores.resources.length * valores.bloques.length
  const excedeLimite = esPlus && cuposNuevos > cuposLibres

  if (esPlus && cuposLibres <= 0) {
    return (
      <div className="card flex flex-col items-center gap-3 py-10 text-center">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-naranja text-ink"><Lock size={24} /></span>
        <p className="text-lg font-semibold">Llegaste al límite del plan Plus</p>
        <p className="max-w-md text-sm text-ink-muted dark:text-slate-400">
          Usaste los {LIMITE_PLAN_PLUS} cupos disponibles. Eliminá una reserva para liberar espacio o pasate a Premium para reservar sin límites.
        </p>
        <Link to="/dashboard#plan" className="btn-accent">Ver Premium</Link>
      </div>
    )
  }

  const onSubmit = async (data) => {
    try {
      const nueva = await createReservationApi(reservaToApi(data))
      dispatch(agregarReserva(nueva))
      dispatch(cambiarFiltros({})) // recarga el listado en la página 1
      toast.success('¡Reserva confirmada!')
      reset(VALORES_INICIALES)
    } catch (error) {
      // 409: sin disponibilidad o límite del plan (lo valida el backend)
      toast.error(error.message)
    }
  }

  const opcionesRecursos = recursos.map((r) => ({
    value: r._id,
    label: `${r.name} · ${r.stock} u.`,
    disabled: r.status !== 'available',
  }))

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card space-y-5 md:p-6" noValidate>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-bold tracking-tight">Nueva reserva</h2>
        {esPlus && <span className="badge bg-brand-lima text-ink">{cuposLibres} de {LIMITE_PLAN_PLUS} cupos libres</span>}
      </div>

      <Paso numero="1" titulo="¿Qué querés reservar?">
        {/* Controller: para inputs personalizados que no son un <input> nativo */}
        <Field error={errors.resources}>
          <Controller name="resources" control={control} render={({ field }) => (
            <ChipSelect options={opcionesRecursos} value={field.value} onChange={field.onChange} />
          )} />
          {recursos.length === 0 && <p className="text-sm text-ink-muted">Todavía no hay recursos cargados.</p>}
        </Field>
      </Paso>

      <Paso numero="2" titulo="¿Cuándo?">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Repetición" error={errors.tipoRecurrencia}>
            <select className="input" {...register('tipoRecurrencia')}>
              {RECURRENCIAS.map((r) => <option key={r} value={r}>{ETIQUETA_RECURRENCIA[r]}</option>)}
            </select>
          </Field>
          <Field label={valores.tipoRecurrencia === 'unica' ? 'Fecha' : 'Desde'} error={errors.fechaInicio}>
            <input type="date" min={hoy()} className="input" {...register('fechaInicio')} />
          </Field>
          {/* La fecha de fin solo aparece si la reserva se repite (ver yup.when en el esquema) */}
          {valores.tipoRecurrencia !== 'unica' && (
            <Field label="Hasta" error={errors.fechaFin}>
              <input type="date" min={valores.fechaInicio} className="input" {...register('fechaFin')} />
            </Field>
          )}
        </div>
        <Field label="Horarios (bloques de 30 min)" error={errors.bloques}>
          <Controller name="bloques" control={control} render={({ field }) => (
            <div className="space-y-3">
              {FRANJAS.map(({ nombre, bloques }) => (
                <div key={nombre} className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:gap-3">
                  <span className="eyebrow w-16 shrink-0 pt-1.5">{nombre}</span>
                  <ChipSelect options={bloques.map((b) => ({ value: b, label: b }))} value={field.value} onChange={field.onChange} />
                </div>
              ))}
            </div>
          )} />
        </Field>
      </Paso>

      <Paso numero="3" titulo="Confirmá">
        <ReservaResumen valores={valores} cuposNuevos={cuposNuevos} esPlus={esPlus} />
        {excedeLimite && (
          <p className="rounded-xl bg-brand-naranja/15 p-3 text-sm font-medium">
            Esta reserva ocupa {cuposNuevos} cupos y te quedan {cuposLibres}. Quitá recursos u horarios.
          </p>
        )}
        <div className="flex flex-wrap justify-end gap-2">
          <button type="button" className="btn-ghost" onClick={() => reset(VALORES_INICIALES)}>Limpiar</button>
          <button type="submit" className="btn-primary" disabled={isSubmitting || excedeLimite}>
            {isSubmitting && <Spinner />} Confirmar reserva
          </button>
        </div>
      </Paso>
    </form>
  )
}
