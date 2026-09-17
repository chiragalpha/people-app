import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import { APP_NAME, APP_TAGLINE } from '../lib/branding'

const emptyForm = {
  workEmail: '',
  password: '',
  bearerToken: '',
  rememberMe: false,
}

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.from || '/dashboard'
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function onSubmit(event) {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      await login(form)
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const tokenSignIn = Boolean(form.bearerToken?.trim())

  return (
    <div className="auth">
      <section className="auth-art">
        <div>
          <div className="logo-mark">P</div>
          <h2>A quieter place to manage the working day.</h2>
          <p>Attendance, leave, team care, and the people around you — without the clutter.</p>
        </div>
        <div>{APP_NAME} · {APP_TAGLINE}</div>
      </section>
      <section className="auth-panel">
        <form className="auth-card" onSubmit={onSubmit}>
          <h3>Sign in</h3>
          <p>Paste your bearer token, or use work email and password.</p>
          {error && <div className="alert">{error}</div>}
          <div className="form-stack">
            <div className="field">
              <label>Bearer token</label>
              <textarea
                rows={3}
                value={form.bearerToken}
                onChange={(event) => setForm({ ...form, bearerToken: event.target.value })}
                placeholder="Paste bearer token"
              />
            </div>
            <div className="field">
              <label>Work email</label>
              <input
                type="email"
                required={!tokenSignIn}
                value={form.workEmail}
                onChange={(event) => setForm({ ...form, workEmail: event.target.value })}
                placeholder="you@company.com"
              />
            </div>
            <div className="field">
              <label>Password</label>
              <input
                type="password"
                required={!tokenSignIn}
                minLength={tokenSignIn ? 0 : 5}
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
                placeholder={tokenSignIn ? 'Optional when using token' : 'Required'}
              />
            </div>
            <label className="check">
              <input
                type="checkbox"
                checked={form.rememberMe}
                onChange={(event) => setForm({ ...form, rememberMe: event.target.checked })}
              />
              Keep me signed in
            </label>
            <button className="btn forest wide" disabled={busy}>{busy ? 'Signing in…' : 'Continue'}</button>
            <Link className="muted-link" to="/forgot-password">Forgot password?</Link>
          </div>
        </form>
      </section>
    </div>
  )
}
