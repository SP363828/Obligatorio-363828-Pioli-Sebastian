// Label + input + mensaje de error, para usar con react-hook-form.
export default function Field({ label, error, children }) {
  return (
    <div>
      {label && <label className="label">{label}</label>}
      {children}
      {error && <p className="field-error">{error.message}</p>}
    </div>
  )
}
