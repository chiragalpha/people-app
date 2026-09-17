import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import { APP_NAME } from '../lib/branding'

export default function ForgotPassword() {
  const { forgotPassword } = useAuth()
  const [workEmail, setWorkEmail] = useState('')
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [busy, setBusy] = useState(false)

  async function onSubmit(event) {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      await forgotPassword(workEmail)
      setDone(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="auth">
      <section className="auth-art">
        <div>
          <div className="logo-mark">P</div>
          <h2>We’ll help you back in.</h2>
          <p>Enter the work email on your profile. If it matches an account, a reset path is sent there.</p>
        </div>
        <div>{APP_NAME}</div>
      </section>
      <section className="auth-panel">
        <form className="auth-card" onSubmit={onSubmit}>
          <h3>Forgot password</h3>
          <p>No password is shown here. We’ll only send a reset if the email exists.</p>
          {error && <div className="alert">{error}</div>}
          {done && <div className="alert ok">If that email is on file, a reset message is on its way.</div>}
          <div className="form-stack">
            <div className="field">
              <label>Work email</label>
              <input type="email" required value={workEmail} onChange={(event) => setWorkEmail(event.target.value)} />
            </div>
            <button className="btn forest wide" disabled={busy || done}>{busy ? 'Sending…' : 'Send reset link'}</button>
            <Link className="muted-link" to="/login">Back to sign in</Link>
          </div>
        </form>
      </section>
    </div>
  )
}
