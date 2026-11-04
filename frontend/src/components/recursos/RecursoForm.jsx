import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import Field from '../ui/Field'
import ImageUpload from './ImageUpload'
import { recursoSchema } from '../../validation/schemas'
import { createResourceApi, updateResourceApi } from '../../api/resources'
import { agregarRecurso, modificarRecurso } from '../../features/recursos/recursosSlice'
import { ESTADOS_RECURSO } from '../../utils/constants'

const ESTADO_RECURSO_LABEL = { available: 'Disponible', maintenance: 'Mantenimiento', inactive: 'Inactivo' }

// Modal de alta/edición de recurso (admin). recurso = null → alta.
export default function RecursoForm({ recurso, onClose, onGuardado }) {
  const dispatch = useDispatch()
  const categorias = useSelector((state) => state.categorias.todas)

  const { register, control, handleSubmit, formState: { errors, isSubmitting, isValid } } = useForm({
    resolver: yupResolver(recursoSchema),
    mode: 'onChange',
    defaultValues: {
      name: recurso?.name || '',
      description: recurso?.description || '',
      stock: recurso?.stock ?? 1,
      category: recurso?.category || '',
      status: recurso?.status || 'available',
      imagen: null,
    },
  })

  const onSubmit = async (data) => {
    try {
      // Con imagen se envía como multipart/form-data (campo "imagen") y el backend la sube a Cloudinary.
      if (recurso) {
        dispatch(modificarRecurso(await updateResourceApi(recurso._id, data)))
        toast.success('Recurso actualizado')
      } else {
        dispatch(agregarRecurso(await createResourceApi(data)))
        toast.success('Recurso creado')
      }
      onGuardado?.()
      onClose()
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/40 p-4" onClick={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} onClick={(e) => e.stopPropagation()} className="card w-full max-w-lg space-y-4" noValidate>
        <h2 className="text-lg font-semibold">{recurso ? 'Editar recurso' : 'Nuevo recurso'}</h2>

        <Field error={errors.imagen}>
          <Controller name="imagen" control={control} render={({ field }) => (
            <ImageUpload value={field.value} urlActual={recurso?.imagenUrl} onChange={field.onChange} />
          )} />
        </Field>
        <Field label="Nombre" error={errors.name}>
          <input className="input" {...register('name')} />
        </Field>
        <Field label="Descripción" error={errors.description}>
          <textarea rows={3} className="input" {...register('description')} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Stock" error={errors.stock}>
            <input type="number" min={0} className="input" {...register('stock')} />
          </Field>
          <Field label="Categoría" error={errors.category}>
            <select className="input" {...register('category')}>
              <option value="">Elegir...</option>
              {categorias.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </Field>
          <Field label="Estado" error={errors.status}>
            <select className="input" {...register('status')}>
              {ESTADOS_RECURSO.map((s) => <option key={s} value={s}>{ESTADO_RECURSO_LABEL[s]}</option>)}
            </select>
          </Field>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" className="btn-secondary" onClick={onClose}>Cancelar</button>
          <button type="submit" className="btn-primary" disabled={!isValid || isSubmitting}>
            {isSubmitting ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </form>
    </div>
  )
}
