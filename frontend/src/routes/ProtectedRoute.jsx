import { useSelector } from 'react-redux'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

// Solo deja pasar a usuarios logueados.
export default function ProtectedRoute() {
  const token = useSelector((s) => s.auth.token)
  const location = useLocation()
  if (!token) return <Navigate to="/login" replace state={{ from: location }} />
  return <Outlet />
}
