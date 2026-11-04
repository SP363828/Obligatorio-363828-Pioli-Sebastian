import { useEffect, useMemo } from 'react'

// Selector de imagen con vista previa. Devuelve el File (o null) por onChange.
export default function ImageUpload({ value, urlActual, onChange }) {
  // URL temporal del archivo elegido para mostrarlo antes de subirlo.
  const urlLocal = useMemo(() => (value ? URL.createObjectURL(value) : null), [value])
  useEffect(() => () => urlLocal && URL.revokeObjectURL(urlLocal), [urlLocal])

  const preview = urlLocal || urlActual

  return (
    <div className="flex items-center gap-4">
      <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
        {preview ? <img src={preview} alt="Vista previa" className="h-full w-full object-cover" /> : <span className="text-2xl">🖼️</span>}
      </div>
      <div className="flex flex-col gap-1">
        <label className="btn-secondary btn-sm cursor-pointer">
          {preview ? 'Cambiar imagen' : 'Subir imagen'}
          <input type="file" accept="image/*" className="hidden" onChange={(e) => onChange(e.target.files?.[0] || null)} />
        </label>
        <span className="text-xs text-slate-400">JPG, PNG o WEBP · máx. 5MB</span>
      </div>
    </div>
  )
}
