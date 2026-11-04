import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { CalendarX } from 'lucide-react'
import EmptyState from '../ui/EmptyState'
import DateBlock from '../ui/DateBlock'
import { ETIQUETA_RECURRENCIA } from '../../utils/constants'

// Las 3 próximas reservas activas (estilo "agenda" de FADU).
export default function UpcomingReservations() {
  const reservas = useSelector((state) => state.reservas.todas)
  const recursos = useSelector((state) => state.recursos.todos)

  const proximas = useMemo(() => {
    const hoy = new Date().toISOString().slice(0, 10)
    return reservas
      // Una recurrente sigue siendo "próxima" mientras no terminó su fecha de fin.
      .filter((r) => r.status === 'active' && r.fechaFin.slice(0, 10) >= hoy)
      .sort((a, b) => a.fechaInicio.localeCompare(b.fechaInicio))
      .slice(0, 3)
  }, [reservas])

  const nombre = (id) => recursos.find((r) => r._id === id)?.name || 'Recurso'

  return (
    <div className="card h-full">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Próximas reservas</h2>
        <Link to="/reservas" className="text-xs font-semibold underline underline-offset-4">Ver todas</Link>
      </div>

      {proximas.length === 0 ? (
        <EmptyState icon={CalendarX} title="Nada agendado" description="Cuando reserves algo, lo vas a ver acá." color="bg-brand-celeste">
          <Link to="/reservas" className="btn-primary btn-sm">Hacer una reserva</Link>
        </EmptyState>
      ) : (
        <ul className="mt-4 space-y-3">
          {proximas.map((r) => (
            <li key={r._id} className="flex items-center gap-4">
              <DateBlock fecha={r.fechaInicio} />
              <div className="min-w-0">
                <p className="truncate font-medium">{r.resources.map(nombre).join(', ')}</p>
                <p className="font-mono text-xs text-ink-muted dark:text-slate-400">
                  {r.bloques.slice(0, 3).join(' · ')}{r.bloques.length > 3 && ` +${r.bloques.length - 3}`} · {ETIQUETA_RECURRENCIA[r.tipoRecurrencia]}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
