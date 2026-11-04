import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Sparkles, ArrowRight } from 'lucide-react'
import Spinner from '../ui/Spinner'
import TextoTraducible from '../ui/TextoTraducible'
import { recommendResourceApi } from '../../api/extras'

const EJEMPLOS = ['Presentación para 10 personas', 'Grabar un podcast', 'Reunión por videollamada']

// Recomendador con IA: el usuario describe qué necesita y Gemini (vía backend) sugiere un recurso.
export default function AiRecommender() {
  const navigate = useNavigate()
  const recursos = useSelector((state) => state.recursos.todos)
  const [descripcion, setDescripcion] = useState('')
  const [resultado, setResultado] = useState(null)
  const [error, setError] = useState(null)
  const [cargando, setCargando] = useState(false)

  const valida = descripcion.trim().length >= 5

  const preguntar = async (e) => {
    e.preventDefault()
    if (!valida) return
    setCargando(true)
    setError(null)
    setResultado(null)
    try {
      const data = await recommendResourceApi(descripcion.trim())
      // Si la IA no está disponible el backend responde 200 con recommendation: null.
      if (!data.recommendation) setError(data.message || 'La IA no está disponible en este momento. Probá más tarde.')
      else setResultado(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setCargando(false)
    }
  }

  const recurso = resultado && recursos.find((r) => r.name === resultado.recommendation)

  return (
    <div id="ia" className="scroll-mt-24 rounded-xl bg-brand-rosa p-5 text-ink md:p-6">
      <div className="flex items-center gap-2">
        <Sparkles size={20} />
        <p className="eyebrow text-ink/70">Asistente IA</p>
      </div>
      <h2 className="mt-2 text-2xl font-bold tracking-tight">¿No sabés qué reservar?</h2>
      <p className="text-sm text-ink/70">Contale qué necesitás y te recomendamos el recurso ideal.</p>

      <form onSubmit={preguntar} className="mt-4 flex flex-col gap-2 sm:flex-row">
        <input
          className="input border-transparent"
          placeholder="Ej: necesito proyectar una presentación para 10 personas"
          value={descripcion}
          maxLength={300}
          onChange={(e) => setDescripcion(e.target.value)}
          aria-label="Describí lo que necesitás"
        />
        <button className="btn-primary shrink-0" disabled={!valida || cargando}>
          {cargando ? <><Spinner /> Pensando...</> : 'Recomendar'}
        </button>
      </form>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {EJEMPLOS.map((ej) => (
          <button key={ej} type="button" onClick={() => setDescripcion(ej)} className="rounded-full bg-paper/60 px-3 py-1 text-xs hover:bg-paper">
            {ej}
          </button>
        ))}
      </div>

      {error && <p className="mt-3 text-sm font-medium">{error}</p>}
      {resultado && (
        <div className="mt-4 rounded-xl bg-paper p-4">
          <p className="eyebrow">Te recomendamos</p>
          <p className="mt-1 text-lg font-semibold">{resultado.recommendation}</p>
          <TextoTraducible texto={resultado.reason} className="mt-1 text-sm text-ink-soft" />
          {recurso && (
            <button className="btn-primary btn-sm mt-3" onClick={() => navigate(`/reservas?recurso=${recurso._id}`)}>
              Reservar este recurso <ArrowRight size={14} />
            </button>
          )}
        </div>
      )}
    </div>
  )
}
