// Tema claro/oscuro: se aplica al arrancar la app (main.jsx) y lo cambia ThemeToggle.
export function temaGuardado() {
  try {
    const saved = localStorage.getItem('theme')
    if (saved) return saved
  } catch { /* sin storage */ }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function aplicarTema(tema) {
  document.documentElement.classList.toggle('dark', tema === 'dark')
  try { localStorage.setItem('theme', tema) } catch { /* sin storage */ }
}
