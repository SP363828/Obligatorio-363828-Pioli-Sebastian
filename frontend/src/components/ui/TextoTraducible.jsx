import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useTraduccion } from '../../utils/useTraduccion'

// Muestra contenido dinámico (descripciones, textos de la IA) en el idioma de la interfaz.
// compacto: sin la nota de traducción, para listas de una sola línea.
export default function TextoTraducible({ texto, className = '', compacto = false }) {
  const { t } = useTranslation()
  const { traduccion, cargando } = useTraduccion(texto)
  const [verOriginal, setVerOriginal] = useState(false)

  const mostrar = traduccion && !verOriginal ? traduccion : texto

  return (
    <>
      <p className={`${className} ${cargando ? 'animate-pulse' : ''}`}>{mostrar}</p>
      {traduccion && !compacto && (
        <button type="button" onClick={() => setVerOriginal((v) => !v)} className="mt-1 text-left text-xs text-ink-muted underline underline-offset-4 dark:text-slate-400">
          {verOriginal ? t('traduccion.verTraducido') : t('traduccion.verOriginal')}
        </button>
      )}
    </>
  )
}
