import { useSelector } from 'react-redux'
import { formatDate } from '../../utils/constants'

const DIAS = ['domingos', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábados']

// Arma una frase legible a partir de lo que el usuario va completando (valores de watch()).
function describirCuando({ tipoRecurrencia, fechaInicio, fechaFin }) {
  if (!fechaInicio) return 'Elegí una fecha'
  const inicio = formatDate(fechaInicio)
  const fin = fechaFin ? formatDate(fechaFin) : '…'
  switch (tipoRecurrencia) {
    case 'diaria': return `todos los días del ${inicio} al ${fin}`
    case 'semanal': return `todos los ${DIAS[new Date(fechaInicio).getUTCDay()]} del ${inicio} al ${fin}`
    case 'mensual': return `el día ${new Date(fechaInicio).getUTCDate()} de cada mes, del ${inicio} al ${fin}`
    default: return `el ${inicio}`
  }
}

// Resumen en vivo de la reserva antes de confirmar.
export default function ReservaResumen({ valores, cuposNuevos, esPlus }) {
  const recursos = useSelector((state) => state.recursos.todos)
  const nombres = valores.resources.map((id) => recursos.find((r) => r._id === id)?.name).filter(Boolean)
  const horarios = [...valores.bloques].sort()

  return (
    <div className="rounded-xl bg-paper-alt p-4 dark:bg-night">
      <p className="eyebrow">Resumen</p>
      <p className="mt-1 leading-relaxed">
        Reservás{' '}
        <strong>{nombres.length ? nombres.join(', ') : 'ningún recurso todavía'}</strong>
        {horarios.length > 0 && <> a las <strong>{horarios.join(', ')}</strong></>}
        {', '}{describirCuando(valores)}.
      </p>
      {esPlus && cuposNuevos > 0 && (
        <p className="mt-2 font-mono text-xs text-ink-muted dark:text-slate-400">Consume {cuposNuevos} cupo{cuposNuevos !== 1 && 's'} de tu plan</p>
      )}
    </div>
  )
}
