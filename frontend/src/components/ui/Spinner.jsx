import { LoaderCircle } from 'lucide-react'

// Ícono girando para botones en estado "cargando".
export default function Spinner({ size = 16 }) {
  return <LoaderCircle size={size} className="animate-spin" aria-hidden="true" />
}
