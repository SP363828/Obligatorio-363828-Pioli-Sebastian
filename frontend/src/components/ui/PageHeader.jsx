// Encabezado de cada pantalla: etiqueta, título, para qué sirve y la acción principal.
export default function PageHeader({ eyebrow, title, description, children }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-2xl">
        {eyebrow && <p className="eyebrow mb-1">{eyebrow}</p>}
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{title}</h1>
        {description && <p className="mt-2 text-ink-muted dark:text-slate-400">{description}</p>}
      </div>
      {children && <div className="flex flex-wrap gap-2">{children}</div>}
    </div>
  )
}
