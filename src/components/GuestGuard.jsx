import { Navigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'

function AuthLoading() {
  return (
    <div className="auth-loading">
      <div className="auth-loading-card">Checking sign-in…</div>
    </div>
  )
}

/** Only login (and similar public auth pages) — redirect signed-in users to the app. */
export default function GuestGuard({ children }) {
  const { authReady, isAuthenticated } = useAuth()

  if (!authReady) return <AuthLoading />
  if (isAuthenticated) return <Navigate to="/dashboard" replace />

  return children
}
