import { useSearchParams } from 'react-router-dom'
import PageHeader from '../components/ui/PageHeader'
import ReservaForm from '../components/reservas/ReservaForm'
import ReservaList from '../components/reservas/ReservaList'

export default function Reservas() {
  // ?recurso=<id> llega desde el recomendador de IA o desde un recurso para precargar el formulario.
  const [params] = useSearchParams()

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Reservas"
        title="Reservá en 3 pasos"
        description="Elegí qué necesitás, cuándo lo necesitás y confirmá. Abajo podés editar o eliminar tus reservas."
      />
      <ReservaForm recursoPreseleccionado={params.get('recurso')} />
      <ReservaList />
    </div>
  )
}
