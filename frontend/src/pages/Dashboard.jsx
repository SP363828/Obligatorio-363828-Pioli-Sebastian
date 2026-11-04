import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Plus } from 'lucide-react'
import PageHeader from '../components/ui/PageHeader'
import QuickActions from '../components/dashboard/QuickActions'
import UpcomingReservations from '../components/dashboard/UpcomingReservations'
import UsageReport from '../components/dashboard/UsageReport'
import PlanUpgrade from '../components/dashboard/PlanUpgrade'
import Charts from '../components/dashboard/Charts'
import AiRecommender from '../components/reservas/AiRecommender'

const saludo = () => {
  const h = new Date().getHours()
  return h < 12 ? 'Buenos días' : h < 20 ? 'Buenas tardes' : 'Buenas noches'
}

export default function Dashboard() {
  const { t } = useTranslation()
  const usuario = useSelector((state) => state.auth.usuario)
  const reservas = useSelector((state) => state.reservas.todas)
  const recursos = useSelector((state) => state.recursos.todos)
  const categorias = useSelector((state) => state.categorias.todas.length)
  const esAdmin = usuario?.rol === 'admin'

  return (
    <div className="space-y-8">
      <PageHeader eyebrow={saludo()} title={`${usuario?.username} 👋`} description={t('dashboard.subtitle')}>
        <Link to="/reservas" className="btn-primary"><Plus size={16} /> {t('reservas.new')}</Link>
      </PageHeader>

      <QuickActions />

      <div className="grid gap-4 lg:grid-cols-3">
        <UsageReport />
        {esAdmin ? (
          <div className="card grid grid-cols-2 gap-4">
            <Stat label="Recursos" value={recursos.length} />
            <Stat label="Categorías" value={categorias} />
          </div>
        ) : (
          <PlanUpgrade />
        )}
        <div className="card grid grid-cols-2 content-center gap-4">
          <Stat label="Reservas activas" value={reservas.filter((r) => r.status === 'active').length} />
          <Stat label="Recursos disponibles" value={recursos.filter((r) => r.status === 'available').length} />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <div className="lg:col-span-3"><AiRecommender /></div>
        <div className="lg:col-span-2"><UpcomingReservations /></div>
      </div>

      <section>
        <p className="eyebrow">Tu actividad</p>
        <h2 className="mt-1 mb-4 text-2xl font-bold tracking-tight">{t('dashboard.charts')}</h2>
        <Charts />
      </section>
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div>
      <p className="text-4xl font-bold tracking-tight">{value}</p>
      <p className="eyebrow mt-1">{label}</p>
    </div>
  )
}
