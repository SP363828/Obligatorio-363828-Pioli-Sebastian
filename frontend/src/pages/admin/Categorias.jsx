import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import Field from '../../components/ui/Field'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import PageHeader from '../../components/ui/PageHeader'
import EmptyState from '../../components/ui/EmptyState'
import TextoTraducible from '../../components/ui/TextoTraducible'
import { Pencil, Trash2, Tags } from 'lucide-react'
import { categoriaSchema } from '../../validation/schemas'
import { createCategoryApi, updateCategoryApi, deleteCategoryApi } from '../../api/categories'
import { agregarCategoria, modificarCategoria, eliminarCategoria } from '../../features/categorias/categoriasSlice'

const VACIO = { name: '', description: '' }
// Cada categoría toma un color FADU (como los códigos de carrera del sitio).
const COLORES = ['bg-brand-lima', 'bg-brand-celeste', 'bg-brand-rosa', 'bg-brand-amarillo', 'bg-brand-lavanda', 'bg-brand-menta', 'bg-brand-naranja', 'bg-brand-azul']

// ABM de categorías (solo admin).
export default function Categorias() {
  const dispatch = useDispatch()
  const categorias = useSelector((state) => state.categorias.todas)
  const recursos = useSelector((state) => state.recursos.todos)
  const [editandoId, setEditandoId] = useState(null)
  const [aEliminar, setAEliminar] = useState(null)

  const { register, handleSubmit, reset, formState: { errors, isSubmitting, isValid } } = useForm({
    resolver: yupResolver(categoriaSchema),
    mode: 'onChange',
    defaultValues: VACIO,
  })

  const onSubmit = async (data) => {
    try {
      if (editandoId) {
        dispatch(modificarCategoria(await updateCategoryApi(editandoId, data)))
        toast.success('Categoría actualizada')
      } else {
        dispatch(agregarCategoria(await createCategoryApi(data)))
        toast.success('Categoría creada')
      }
      cancelarEdicion()
    } catch (error) {
      toast.error(error.message) // ej: 409 nombre duplicado
    }
  }

  const editar = (c) => {
    setEditandoId(c._id)
    reset({ name: c.name, description: c.description || '' })
  }
  const cancelarEdicion = () => {
    setEditandoId(null)
    reset(VACIO)
  }

  // El backend responde 409 si la categoría tiene recursos; en el front además se deshabilita el botón.
  const confirmarEliminar = async () => {
    try {
      await deleteCategoryApi(aEliminar._id)
      dispatch(eliminarCategoria(aEliminar._id))
      toast.success('Categoría eliminada')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setAEliminar(null)
    }
  }

  const cantidadRecursos = (id) => recursos.filter((r) => r.category === id).length

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Administración"
        title="Categorías"
        description="Agrupan los recursos del catálogo. Una categoría con recursos asociados no se puede eliminar."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <form onSubmit={handleSubmit(onSubmit)} className="card h-fit space-y-4" noValidate>
          <h2 className="font-semibold">{editandoId ? 'Editar categoría' : 'Nueva categoría'}</h2>
          <Field label="Nombre" error={errors.name}>
            <input className="input" {...register('name')} />
          </Field>
          <Field label="Descripción" error={errors.description}>
            <textarea rows={3} className="input" {...register('description')} />
          </Field>
          <div className="flex gap-2">
            <button className="btn-primary" disabled={!isValid || isSubmitting}>{editandoId ? 'Guardar' : 'Crear'}</button>
            {editandoId && <button type="button" className="btn-secondary" onClick={cancelarEdicion}>Cancelar</button>}
          </div>
        </form>

        <div className="card lg:col-span-2">
          {categorias.length === 0 ? (
            <EmptyState icon={Tags} title="Sin categorías" description="Creá la primera con el formulario para empezar a cargar recursos." color="bg-brand-amarillo" />
          ) : (
            <ul className="divide-y divide-line dark:divide-night-line">
              {categorias.map((c, i) => {
                const n = cantidadRecursos(c._id)
                return (
                  <li key={c._id} className="flex items-center gap-3 py-3">
                    <span className={`h-10 w-1.5 shrink-0 rounded-full ${COLORES[i % COLORES.length]}`} />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium">{c.name}</p>
                      {c.description
                        ? <TextoTraducible compacto texto={c.description} className="truncate text-xs text-ink-muted dark:text-slate-400" />
                        : <p className="text-xs text-ink-muted dark:text-slate-400">Sin descripción</p>}
                    </div>
                    <span className="badge bg-paper-alt text-ink-soft dark:bg-night dark:text-slate-300">{n} recursos</span>
                    <button className="btn-secondary btn-sm" onClick={() => editar(c)}><Pencil size={14} /> Editar</button>
                    <button
                      className="btn-danger btn-sm btn-icon"
                      onClick={() => setAEliminar(c)}
                      disabled={n > 0}
                      title={n > 0 ? 'No se puede eliminar: tiene recursos asociados' : 'Eliminar'}
                      aria-label={`Eliminar ${c.name}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={!!aEliminar}
        title="Eliminar categoría"
        message={`¿Eliminar la categoría "${aEliminar?.name}"?`}
        onConfirm={confirmarEliminar}
        onCancel={() => setAEliminar(null)}
      />
    </div>
  )
}
