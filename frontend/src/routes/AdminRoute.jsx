import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

// Solo deja pasar a administradores (el backend también lo valida con 403).
export default function AdminRoute() {
  const usuario = useSelector((state) => state.auth.usuario)
  return usuario?.rol === 'admin' ? <Outlet /> : <Navigate to="/dashboard" replace />
}
