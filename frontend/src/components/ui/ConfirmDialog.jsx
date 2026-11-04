import { useEffect } from 'react'
import { TriangleAlert } from 'lucide-react'
import Spinner from './Spinner'

// Modal de confirmación para acciones destructivas. Se cierra con Escape o clic afuera.
export default function ConfirmDialog({ open, title, message, onConfirm, onCancel, loading, confirmText = 'Eliminar' }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onCancel()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onCancel])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/50 p-4 backdrop-blur-sm" onClick={onCancel}>
      <div role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" className="card w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-naranja text-ink"><TriangleAlert size={22} /></span>
        <h3 id="confirm-title" className="mt-4 text-lg font-semibold">{title}</h3>
        <p className="mt-1 text-sm text-ink-muted dark:text-slate-400">{message}</p>
        <div className="mt-6 flex justify-end gap-2">
          <button className="btn-secondary" onClick={onCancel} autoFocus>Cancelar</button>
          <button className="btn-accent" onClick={onConfirm} disabled={loading}>
            {loading && <Spinner />} {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
