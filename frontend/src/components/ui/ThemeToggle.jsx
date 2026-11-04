import { useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { aplicarTema } from '../../utils/theme'

export default function ThemeToggle() {
  const [oscuro, setOscuro] = useState(() => document.documentElement.classList.contains('dark'))

  const cambiar = () => {
    aplicarTema(oscuro ? 'light' : 'dark')
    setOscuro(!oscuro)
  }

  return (
    <button onClick={cambiar} className="btn-secondary btn-sm btn-icon" aria-label={oscuro ? 'Usar tema claro' : 'Usar tema oscuro'}>
      {oscuro ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  )
}
