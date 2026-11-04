import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, Legend, AreaChart, Area,
} from 'recharts'

// Paleta categórica en orden fijo, con colores de FADU: azul, naranja y un menta más profundo
// (el menta original #76ebb3 es muy claro para una gráfica). Validada para daltonismo.
const SERIES = ['#5584ff', '#fb6435', '#1baf7a']
const ESTADO_LABEL = { active: 'Activas', completed: 'Completadas', cancelled: 'Canceladas' }
const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

const axis = { stroke: '#646464', fontSize: 12, fontFamily: 'DM Mono', tickLine: false, axisLine: false }
const tooltipStyle = { borderRadius: 12, border: 'none', background: '#000', color: '#fff', fontSize: 12 }

export default function Charts() {
  const reservas = useSelector((s) => s.reservas.todas)
  const recursos = useSelector((s) => s.recursos.todos)

  // Reservas por recurso: cuántas reservas incluyen cada recurso.
  const porRecurso = useMemo(() => {
    const counts = {}
    reservas.forEach((r) => r.resources.forEach((id) => { counts[id] = (counts[id] || 0) + 1 }))
    return Object.entries(counts)
      .map(([id, total]) => ({ name: recursos.find((x) => x._id === id)?.name || 'Eliminado', total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 6)
  }, [reservas, recursos])

  const porEstado = useMemo(() => {
    const counts = {}
    reservas.forEach((r) => { counts[r.status] = (counts[r.status] || 0) + 1 })
    return Object.keys(ESTADO_LABEL)
      .map((k) => ({ name: ESTADO_LABEL[k], value: counts[k] || 0 }))
      .filter((d) => d.value > 0)
  }, [reservas])

  // Reservas por mes de inicio (últimos 6 meses hasta el próximo).
  const porMes = useMemo(() => {
    const now = new Date()
    const months = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1)
      return { key: `${d.getFullYear()}-${d.getMonth()}`, name: MESES[d.getMonth()], total: 0 }
    })
    reservas.forEach((r) => {
      const d = new Date(r.fechaInicio)
      const m = months.find((x) => x.key === `${d.getUTCFullYear()}-${d.getUTCMonth()}`)
      if (m) m.total++
    })
    return months
  }, [reservas])

  if (reservas.length === 0) {
    return (
      <div className="card text-center text-sm text-ink-muted">
        Cuando tengas reservas vas a ver acá tus estadísticas 📈
      </div>
    )
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ChartCard title="Recursos más reservados">
        <BarChart data={porRecurso} margin={{ left: -20 }}>
          <CartesianGrid vertical={false} stroke="#e3e7f0" strokeOpacity={0.5} />
          <XAxis dataKey="name" {...axis} />
          <YAxis allowDecimals={false} {...axis} />
          <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: '#fff' }} labelStyle={{ color: '#def294' }} cursor={{ fill: 'rgba(148,163,184,0.15)' }} />
          <Bar dataKey="total" name="Reservas" fill={SERIES[0]} radius={[4, 4, 0, 0]} maxBarSize={36} />
        </BarChart>
      </ChartCard>

      <ChartCard title="Reservas por estado">
        <PieChart>
          <Pie data={porEstado} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={2} stroke="none" label>
            {porEstado.map((_, i) => <Cell key={i} fill={SERIES[i]} />)}
          </Pie>
          <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: '#fff' }} labelStyle={{ color: '#def294' }} />
          <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
        </PieChart>
      </ChartCard>

      <ChartCard title="Reservas por mes de inicio" className="lg:col-span-2">
        <AreaChart data={porMes} margin={{ left: -20 }}>
          <CartesianGrid vertical={false} stroke="#e3e7f0" strokeOpacity={0.5} />
          <XAxis dataKey="name" {...axis} />
          <YAxis allowDecimals={false} {...axis} />
          <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: '#fff' }} labelStyle={{ color: '#def294' }} />
          <Area type="monotone" dataKey="total" name="Reservas" stroke={SERIES[0]} strokeWidth={2} fill={SERIES[0]} fillOpacity={0.15} dot={{ r: 4 }} />
        </AreaChart>
      </ChartCard>
    </div>
  )
}

function ChartCard({ title, children, className = '' }) {
  return (
    <div className={`card ${className}`}>
      <h3 className="mb-4 eyebrow">{title}</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">{children}</ResponsiveContainer>
      </div>
    </div>
  )
}
