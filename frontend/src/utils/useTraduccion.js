import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { translateApi } from '../api/extras'
import { guardarTraduccion } from '../features/traducciones/traduccionesSlice'

const IDIOMA_ORIGINAL = 'es'
const LARGO_MAXIMO = 500 // el mismo límite que valida el backend

// Evita pedir dos veces el mismo texto si aparece en varios componentes a la vez.
const enCurso = new Set()

// Devuelve { traduccion, cargando } para un texto dinámico según el idioma de la interfaz.
// Con la interfaz en español, o si la traducción falla, traduccion es null y se usa el original.
export function useTraduccion(texto) {
  const dispatch = useDispatch()
  const { i18n } = useTranslation()
  const idioma = i18n.language

  const hayQueTraducir = Boolean(texto) && idioma !== IDIOMA_ORIGINAL && texto.length <= LARGO_MAXIMO
  const clave = `${idioma}:${texto}`
  const guardada = useSelector((state) => state.traducciones.porClave[clave])
  const pendiente = hayQueTraducir && guardada === undefined

  useEffect(() => {
    if (!pendiente || enCurso.has(clave)) return
    enCurso.add(clave)

    translateApi(texto, idioma)
      .then((data) => dispatch(guardarTraduccion({ clave, traduccion: data.translated ?? null })))
      .catch(() => dispatch(guardarTraduccion({ clave, traduccion: null })))
      .finally(() => enCurso.delete(clave))
  }, [pendiente, clave, texto, idioma, dispatch])

  return { traduccion: hayQueTraducir ? guardada ?? null : null, cargando: pendiente }
}
