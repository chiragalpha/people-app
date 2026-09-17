import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import { fetchBreaks, plainText } from '../lib/api'
import { useLive } from '../lib/useLive'

export default function BreakPage() {
  const [toast, setToast] = useState('')
  const live = useLive(() => fetchBreaks(), [])

  function note(kind) {
    setToast(`${kind} stays on this screen only. Live punch was not sent.`)
    setTimeout(() => setToast(''), 2800)
  }

  const rows = live.data || []

  return (
    <div className="page">
      <PageHeader
        title="Break in / out"
        copy="Live board for today."
        action={
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn secondary" onClick={() => note('Break out')}>Break out</button>
            <button className="btn forest" onClick={() => note('Break in')}>Break in</button>
          </div>
        }
      />
      {live.error && <div className="alert">{live.error}</div>}
      <div className="card">
        <table className="table">
          <thead>
            <tr><th>Name</th><th>User</th><th>In / Out</th><th>Time</th><th>Department</th></tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{plainText(row.nick_name)}</td>
                <td>{row.user_id}</td>
                <td><span className={`pill ${String(row.status).toUpperCase() === 'IN' ? 'good' : 'warn'}`}>{row.status}</span></td>
                <td>{row.time || row.log_time}</td>
                <td>{row.department}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {live.loading && <div className="empty">Loading live breaks…</div>}
        {!live.loading && !rows.length && <div className="empty">No break rows for today.</div>}
      </div>
      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}
