import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { CalendarPlus, Boxes, Sparkles, Crown, ArrowUpRight } from 'lucide-react'

// Accesos rápidos en tarjetas de color plano (como la grilla de carreras de FADU).
export default function QuickActions() {
  const usuario = useSelector((state) => state.auth.usuario)
  const esPlus = usuario?.plan === 'plus' && usuario?.rol !== 'admin'

  const acciones = [
    { to: '/reservas', icon: CalendarPlus, code: 'RES', title: 'Nueva reserva', text: 'Elegí recurso y horario', color: 'bg-brand-lima' },
    { to: '/recursos', icon: Boxes, code: 'CAT', title: 'Ver recursos', text: 'Salas, equipos y stock', color: 'bg-brand-celeste' },
    { to: '#ia', icon: Sparkles, code: 'IA', title: 'Pedir recomendación', text: 'La IA elige por vos', color: 'bg-brand-rosa' },
    esPlus
      ? { to: '#plan', icon: Crown, code: 'PRO', title: 'Pasar a Premium', text: 'Reservas sin límite', color: 'bg-brand-naranja' }
      : { to: '/reservas', icon: CalendarPlus, code: 'MIS', title: 'Mis reservas', text: 'Editar o cancelar', color: 'bg-brand-amarillo' },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {acciones.map(({ to, icon: Icon, code, title, text, color }) => {
        const contenido = (
          <>
            <div className="flex items-start justify-between">
              <span className="font-mono text-xs font-medium">{code}</span>
              <ArrowUpRight size={18} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
            <Icon size={28} strokeWidth={1.5} className="mt-6" />
            <p className="mt-3 font-semibold leading-tight">{title}</p>
            <p className="text-xs text-ink/70">{text}</p>
          </>
        )
        const clases = `group block rounded-xl p-4 text-ink transition hover:-translate-y-0.5 ${color}`
        // Los anclas (#ia, #plan) hacen scroll dentro del dashboard; el resto navega con el router.
        return to.startsWith('#')
          ? <a key={code} href={to} className={clases}>{contenido}</a>
          : <Link key={code} to={to} className={clases}>{contenido}</Link>
      })}
    </div>
  )
}
