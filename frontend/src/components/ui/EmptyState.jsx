// Estado vacío: explica qué pasa y ofrece el siguiente paso (en vez de una pantalla en blanco).
export default function EmptyState({ icon: Icon, title, description, color = 'bg-brand-lima', children }) {
  return (
    <div className="flex flex-col items-center px-4 py-12 text-center">
      {Icon && (
        <span className={`grid h-14 w-14 place-items-center rounded-2xl text-ink ${color}`}>
          <Icon size={26} strokeWidth={1.75} />
        </span>
      )}
      <p className="mt-4 text-lg font-semibold">{title}</p>
      {description && <p className="mt-1 max-w-sm text-sm text-ink-muted dark:text-slate-400">{description}</p>}
      {children && <div className="mt-5 flex flex-wrap justify-center gap-2">{children}</div>}
    </div>
  )
}
