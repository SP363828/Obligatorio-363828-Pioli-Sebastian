import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { Pencil, Trash2, Clock, Repeat } from 'lucide-react'
import DateBlock from '../ui/DateBlock'
import Spinner from '../ui/Spinner'
import { reservaSchema, reservaToApi } from '../../validation/schemas'
import { updateReservationApi } from '../../api/reservations'
import { modificarReserva } from '../../features/reservas/reservasSlice'
import { RECURRENCIAS, ETIQUETA_RECURRENCIA, formatDate, toInputDate } from '../../utils/constants'

// Estado con color + texto (nunca solo color).
const ESTADO = {
  active: { label: 'Activa', cls: 'bg-brand-menta text-ink', bloque: 'bg-brand-lima' },
  completed: { label: 'Completada', cls: 'bg-line text-ink-soft dark:bg-night-line dark:text-slate-300', bloque: 'bg-paper-alt dark:bg-night' },
  cancelled: { label: 'Cancelada', cls: 'bg-brand-naranja/20 text-[#9a3412] dark:text-brand-naranja', bloque: 'bg-paper-alt dark:bg-night' },
}

// Una reserva del listado, con edición en línea (inline) de recurrencia y fechas.
export default function ReservaItem({ reserva, onEliminar }) {
  const dispatch = useDispatch()
  const recursos = useSelector((state) => state.recursos.todos)
  const [editando, setEditando] = useState(false)

  const nombres = reserva.resources.map((id) => recursos.find((r) => r._id === id)?.name || 'Recurso eliminado')
  const estado = ESTADO[reserva.status]

  const valoresActuales = {
    resources: reserva.resources,
    bloques: reserva.bloques,
    tipoRecurrencia: reserva.tipoRecurrencia,
    fechaInicio: toInputDate(reserva.fechaInicio),
    fechaFin: toInputDate(reserva.fechaFin),
  }

  const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(reservaSchema),
    defaultValues: valoresActuales,
  })
  const tipoRecurrencia = watch('tipoRecurrencia')

  const guardar = async (data) => {
    try {
      const actualizada = await updateReservationApi(reserva._id, reservaToApi(data))
      dispatch(modificarReserva(actualizada))
      toast.success('Reserva actualizada')
      setEditando(false)
    } catch (error) {
      toast.error(error.message)
    }
  }

  const cancelar = () => {
    reset(valoresActuales) // reset(): vuelve a los valores originales
    setEditando(false)
  }

  return (
    <li className={`flex flex-col gap-4 py-4 sm:flex-row sm:items-center ${editando ? 'rounded-xl bg-paper-alt px-3 dark:bg-night' : ''}`}>
      <DateBlock fecha={reserva.fechaInicio} color={estado.bloque} />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-semibold">{nombres.join(', ')}</p>
          <span className={`badge ${estado.cls}`}>{estado.label}</span>
        </div>
        <p className="mt-1 flex items-center gap-1.5 font-mono text-xs text-ink-muted dark:text-slate-400">
          <Clock size={12} /> {reserva.bloques.join(' · ')}
        </p>

        {editando ? (
          <form onSubmit={handleSubmit(guardar)} className="mt-3 flex flex-wrap items-start gap-2" noValidate>
            <select className="input w-auto" aria-label="Repetición" {...register('tipoRecurrencia')}>
              {RECURRENCIAS.map((r) => <option key={r} value={r}>{ETIQUETA_RECURRENCIA[r]}</option>)}
            </select>
            <div>
              <input type="date" className="input w-auto" aria-label="Fecha de inicio" {...register('fechaInicio')} />
              {errors.fechaInicio && <p className="field-error">{errors.fechaInicio.message}</p>}
            </div>
            {tipoRecurrencia !== 'unica' && (
              <div>
                <input type="date" className="input w-auto" aria-label="Fecha de fin" {...register('fechaFin')} />
                {errors.fechaFin && <p className="field-error">{errors.fechaFin.message}</p>}
              </div>
            )}
            <button type="submit" className="btn-primary btn-sm mt-1" disabled={isSubmitting}>{isSubmitting && <Spinner size={12} />} Guardar</button>
            <button type="button" className="btn-ghost btn-sm mt-1" onClick={cancelar}>Cancelar</button>
          </form>
        ) : (
          <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-soft dark:text-slate-300">
            <Repeat size={14} /> {ETIQUETA_RECURRENCIA[reserva.tipoRecurrencia]}
            {reserva.tipoRecurrencia !== 'unica' && <> · hasta el {formatDate(reserva.fechaFin)}</>}
          </p>
        )}
      </div>

      {!editando && (
        <div className="flex gap-2">
          <button className="btn-secondary btn-sm" onClick={() => setEditando(true)}><Pencil size={14} /> Editar</button>
          <button className="btn-danger btn-sm" onClick={() => onEliminar(reserva)} aria-label="Eliminar reserva"><Trash2 size={14} /> Eliminar</button>
        </div>
      )}
    </li>
  )
}
