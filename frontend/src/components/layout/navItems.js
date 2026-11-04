import { LayoutGrid, CalendarDays, Boxes, Tags } from 'lucide-react'

// Única definición de la navegación: la usan Sidebar, MobileNav y Topbar (título de la página).
export const NAV_ITEMS = [
  { to: '/dashboard', key: 'dashboard', icon: LayoutGrid, color: 'bg-brand-lima' },
  { to: '/reservas', key: 'reservas', icon: CalendarDays, color: 'bg-brand-celeste' },
  { to: '/recursos', key: 'recursos', icon: Boxes, color: 'bg-brand-rosa' },
  { to: '/admin/categorias', key: 'categorias', icon: Tags, color: 'bg-brand-amarillo', admin: true },
]

export const visibleItems = (esAdmin) => NAV_ITEMS.filter((item) => !item.admin || esAdmin)
