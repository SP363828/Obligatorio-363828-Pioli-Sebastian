import { CalendarCheck, Boxes, Sparkles } from 'lucide-react'
import { Logo } from './Sidebar'
import ThemeToggle from '../ui/ThemeToggle'
import LanguageToggle from '../ui/LanguageToggle'

// Las 3 ideas de la app, en tarjetas de color plano estilo FADU.
const FEATURES = [
  { icon: CalendarCheck, title: 'Reservá', text: 'Salas y equipos por bloques de 30 minutos, únicas o recurrentes.', color: 'bg-brand-lima' },
  { icon: Boxes, title: 'Controlá', text: 'Stock en tiempo real: nunca se superponen dos reservas.', color: 'bg-brand-celeste' },
  { icon: Sparkles, title: 'Preguntale a la IA', text: 'Describí lo que necesitás y te recomienda el recurso ideal.', color: 'bg-brand-rosa' },
]

// Layout de login/registro: panel de marca a la izquierda y formulario a la derecha.
export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="grid min-h-screen bg-paper lg:grid-cols-2 dark:bg-night">
      <div className="hidden flex-col justify-between bg-ink p-12 text-paper lg:flex">
        <Logo invert />
        <div>
          <p className="eyebrow text-slate-400">Inventario y reservas</p>
          <h2 className="mt-3 max-w-md text-5xl leading-[1.05] font-bold tracking-tight">Todo lo que necesitás, reservado en segundos.</h2>
          <div className="mt-10 grid gap-3">
            {FEATURES.map(({ icon: Icon, title, text, color }) => (
              <div key={title} className={`flex items-start gap-4 rounded-xl p-4 text-ink ${color}`}>
                <Icon size={22} strokeWidth={1.75} className="mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold">{title}</p>
                  <p className="text-sm text-ink/75">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <p className="font-mono text-xs text-slate-500">© 2026 ReservaYa · Obligatorio Full Stack</p>
      </div>

      <div className="flex flex-col p-6">
        <div className="flex items-center justify-between">
          <div className="lg:invisible"><Logo /></div>
          <div className="flex items-center gap-2"><LanguageToggle /><ThemeToggle /></div>
        </div>
        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-10">
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="mt-2 mb-8 text-ink-muted dark:text-slate-400">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  )
}

// Mensaje de error de la API dentro del formulario.
export function FormError({ children }) {
  if (!children) return null
  return (
    <div role="alert" className="rounded-xl border border-brand-naranja/40 bg-brand-naranja/10 p-3 text-sm font-medium text-[#9a3412] dark:text-brand-naranja">
      {children}
    </div>
  )
}
