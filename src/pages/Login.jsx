import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import { APP_NAME, APP_TAGLINE } from '../lib/branding'
import { validateLoginForm } from '../lib/loginValidation'

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
  const [fieldErrors, setFieldErrors] = useState({})
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }))
    if (fieldErrors[key]) {
      setFieldErrors((current) => {
        const next = { ...current }
        delete next[key]
        return next
      })
    }
  }

  async function onSubmit(event) {
    event.preventDefault()
    setError('')

    const nextFieldErrors = validateLoginForm(form)
    if (Object.keys(nextFieldErrors).length) {
      setFieldErrors(nextFieldErrors)
      return
    }

    setFieldErrors({})
    setBusy(true)
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
        <form className="auth-card" onSubmit={onSubmit} noValidate>
          <h3>Sign in</h3>
          <p>Paste your bearer token, or use work email and password.</p>
          {error && <div className="alert">{error}</div>}
          <div className="form-stack">
            <div className="field">
              <label htmlFor="bearer-token">Bearer token</label>
              <textarea
                id="bearer-token"
                rows={3}
                value={form.bearerToken}
                onChange={(event) => updateField('bearerToken', event.target.value)}
                placeholder="Paste bearer token"
              />
            </div>
            <div className={`field${fieldErrors.workEmail ? ' invalid' : ''}`}>
              <label htmlFor="work-email">Work email</label>
              <input
                id="work-email"
                type="email"
                autoComplete="email"
                required={!tokenSignIn}
                aria-invalid={Boolean(fieldErrors.workEmail)}
                aria-describedby={fieldErrors.workEmail ? 'work-email-error' : undefined}
                value={form.workEmail}
                onChange={(event) => updateField('workEmail', event.target.value)}
                placeholder="you@company.com"
              />
              {fieldErrors.workEmail && (
                <p className="field-error" id="work-email-error" role="alert">{fieldErrors.workEmail}</p>
              )}
            </div>
            <div className={`field${fieldErrors.password ? ' invalid' : ''}`}>
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required={!tokenSignIn}
                minLength={tokenSignIn ? undefined : 5}
                aria-invalid={Boolean(fieldErrors.password)}
                aria-describedby={fieldErrors.password ? 'password-error' : undefined}
                value={form.password}
                onChange={(event) => updateField('password', event.target.value)}
                placeholder={tokenSignIn ? 'Optional when using token' : 'Required'}
              />
              {fieldErrors.password && (
                <p className="field-error" id="password-error" role="alert">{fieldErrors.password}</p>
              )}
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
