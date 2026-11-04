import { useTranslation } from 'react-i18next'

// Selector ES / EN con el idioma actual resaltado.
export default function LanguageToggle() {
  const { i18n } = useTranslation()

  const cambiar = (lng) => {
    i18n.changeLanguage(lng)
    try { localStorage.setItem('lang', lng) } catch { /* sin storage */ }
  }

  return (
    <div className="flex rounded-full border border-line p-0.5 font-mono text-[11px] dark:border-night-line" role="group" aria-label="Idioma">
      {['es', 'en'].map((lng) => (
        <button
          key={lng}
          onClick={() => cambiar(lng)}
          aria-pressed={i18n.language === lng}
          className={`rounded-full px-2.5 py-1 uppercase ${i18n.language === lng ? 'bg-ink text-paper dark:bg-paper dark:text-ink' : 'text-ink-muted'}`}
        >
          {lng}
        </button>
      ))}
    </div>
  )
}
