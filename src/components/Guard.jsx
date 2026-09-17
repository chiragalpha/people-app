import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'

function AuthLoading() {
  return (
    <div className="auth-loading">
      <div className="auth-loading-card">Checking sign-in…</div>
    </div>
  )
}

export default function Guard({ children }) {
  const { session, authReady, isAuthenticated } = useAuth()
  const location = useLocation()

  if (!authReady) return <AuthLoading />

  if (!isAuthenticated || !session?.token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return children
}
