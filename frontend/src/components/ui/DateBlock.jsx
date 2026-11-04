const MESES = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC']

// Fecha en bloque: día grande + mes en mono (como la agenda de FADU).
// Se usa UTC porque las fechas se guardan como medianoche de ese día.
export default function DateBlock({ fecha, color = 'bg-paper-alt dark:bg-night' }) {
  const d = new Date(fecha)
  return (
    <div className={`flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl ${color}`}>
      <span className="text-xl leading-none font-bold">{d.getUTCDate()}</span>
      <span className="mt-0.5 font-mono text-[10px] tracking-wider">{MESES[d.getUTCMonth()]}</span>
    </div>
  )
}
