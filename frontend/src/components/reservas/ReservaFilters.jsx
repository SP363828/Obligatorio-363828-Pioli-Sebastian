import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Search, X } from 'lucide-react'
import { cambiarFiltros, FILTROS_INICIALES } from '../../features/reservas/reservasSlice'
import { useDebounce } from '../../utils/useDebounce'
import { RECURRENCIAS, ETIQUETA_RECURRENCIA, formatDate } from '../../utils/constants'

const ESTADOS = { active: 'Activas', completed: 'Completadas', cancelled: 'Canceladas' }
const ORDENES = [
  { value: 'fechaInicio', label: 'Fecha: más próxima' },
  { value: '-fechaInicio', label: 'Fecha: más lejana' },
  { value: '-createdAt', label: 'Creación: más nuevas' },
  { value: 'createdAt', label: 'Creación: más viejas' },
]

// Filtros del listado. Viven en Redux y el listado los envía como query params al backend.
export default function ReservaFilters() {
  const dispatch = useDispatch()
  const filtros = useSelector((state) => state.reservas.filtros)
  const recursos = useSelector((state) => state.recursos.todos)

  // El texto se guarda local y pasa a Redux con debounce: un request por búsqueda, no por tecla.
  const [texto, setTexto] = useState(filtros.q)
  const q = useDebounce(texto, 400)

  useEffect(() => {
    if (q !== filtros.q) dispatch(cambiarFiltros({ q }))
    // Solo debe reaccionar al texto escrito, no a cada cambio de filtros.
  }, [q, dispatch]) // eslint-disable-line react-hooks/exhaustive-deps

  const cambiar = (campo) => (e) => dispatch(cambiarFiltros({ [campo]: e.target.value }))
  const quitar = (campo) => {
    if (campo === 'q') setTexto('')
    dispatch(cambiarFiltros({ [campo]: '' }))
  }
  const limpiar = () => {
    setTexto('')
    dispatch(cambiarFiltros({ ...FILTROS_INICIALES, limit: filtros.limit, sort: filtros.sort }))
  }

  // Chips: muestran qué filtros están aplicados y permiten quitarlos de a uno.
  const activos = [
    filtros.q && { campo: 'q', label: `"${filtros.q}"` },
    filtros.status && { campo: 'status', label: ESTADOS[filtros.status] },
    filtros.resource && { campo: 'resource', label: recursos.find((r) => r._id === filtros.resource)?.name || 'Recurso' },
    filtros.tipoRecurrencia && { campo: 'tipoRecurrencia', label: ETIQUETA_RECURRENCIA[filtros.tipoRecurrencia] },
    filtros.desde && { campo: 'desde', label: `Desde ${formatDate(filtros.desde)}` },
    filtros.hasta && { campo: 'hasta', label: `Hasta ${formatDate(filtros.hasta)}` },
  ].filter(Boolean)

  return (
    <div className="space-y-3">
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative sm:col-span-2">
          <Search size={16} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-ink-muted" />
          <input className="input pl-9" placeholder="Buscar por nombre de recurso" aria-label="Buscar por nombre de recurso" maxLength={100} value={texto} onChange={(e) => setTexto(e.target.value)} />
        </div>
        <select className="input" aria-label="Estado" value={filtros.status} onChange={cambiar('status')}>
          <option value="">Todos los estados</option>
          {Object.entries(ESTADOS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
        <select className="input" aria-label="Orden" value={filtros.sort} onChange={cambiar('sort')}>
          {ORDENES.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <select className="input" aria-label="Recurso" value={filtros.resource} onChange={cambiar('resource')}>
          <option value="">Todos los recursos</option>
          {recursos.map((r) => <option key={r._id} value={r._id}>{r.name}</option>)}
        </select>
        <select className="input" aria-label="Repetición" value={filtros.tipoRecurrencia} onChange={cambiar('tipoRecurrencia')}>
          <option value="">Toda repetición</option>
          {RECURRENCIAS.map((r) => <option key={r} value={r}>{ETIQUETA_RECURRENCIA[r]}</option>)}
        </select>
        <input type="date" className="input" aria-label="Desde" max={filtros.hasta || undefined} value={filtros.desde} onChange={cambiar('desde')} />
        <input type="date" className="input" aria-label="Hasta" min={filtros.desde || undefined} value={filtros.hasta} onChange={cambiar('hasta')} />
      </div>

      {activos.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {activos.map(({ campo, label }) => (
            <button key={campo} onClick={() => quitar(campo)} aria-label={`Quitar filtro ${label}`} className="inline-flex items-center gap-1 rounded-full bg-brand-lima px-3 py-1 text-xs font-medium text-ink">
              {label} <X size={12} />
            </button>
          ))}
          <button className="text-xs font-semibold underline underline-offset-4" onClick={limpiar}>Limpiar todo</button>
        </div>
      )}
    </div>
  )
}
