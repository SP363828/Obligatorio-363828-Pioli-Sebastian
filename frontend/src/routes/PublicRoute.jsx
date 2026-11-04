import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

// Login y registro: si ya hay sesión, se va directo al dashboard.
export default function PublicRoute() {
  const token = useSelector((s) => s.auth.token)
  return token ? <Navigate to="/dashboard" replace /> : <Outlet />
}
