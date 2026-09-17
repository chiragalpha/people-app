import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import { useAuth } from '../lib/AuthContext'
import { fetchAttendanceSummary } from '../lib/api'
import { useLive } from '../lib/useLive'

function currentMonth() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`
}

export default function Attendance() {
  const { user } = useAuth()
  const [month, setMonth] = useState(currentMonth().slice(0, 7))
  const live = useLive(
    () => fetchAttendanceSummary(user.userId, `${month}-01`),
    [user.userId, month],
  )
  const rows = live.data || []
  const present = rows.filter((row) => row.inTime).length
  const late = rows.filter((row) => row.isArrivedLate).length
  const leave = rows.filter((row) => row.isOnLeave).length

  return (
    <div className="page">
      <PageHeader title="Attendance" copy="Live monthly attendance summary." />
      {live.error && <div className="alert">{live.error}</div>}
      <div className="grid cols-4" style={{ marginBottom: 16 }}>
        <div className="card stat"><span>Present</span><b>{present}</b></div>
        <div className="card stat"><span>Late</span><b>{late}</b></div>
        <div className="card stat"><span>Leave</span><b>{leave}</b></div>
        <div className="card stat"><span>Days</span><b>{rows.length}</b></div>
      </div>
      <div className="card">
        <div className="toolbar">
          <div className="field">
            <label>Month</label>
            <input type="month" value={month} onChange={(event) => setMonth(event.target.value)} />
          </div>
        </div>
        <table className="table">
          <thead>
            <tr><th>Date</th><th>In</th><th>Out</th><th>Hours</th><th>Status</th></tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id || row.attendanceDate}>
                <td>{String(row.attendanceDate || '').slice(0, 10)}</td>
                <td>{row.inTime || '—'}</td>
                <td>{row.outTime || '—'}</td>
                <td>{row.grossHoursInHHMM || '—'}</td>
                <td>
                  <span className={`pill ${row.isOnLeave ? 'bad' : row.isArrivedLate ? 'warn' : 'good'}`}>
                    {row.status?.name || (row.isOnLeave ? 'Leave' : row.isArrivedLate ? 'Late' : 'On time')}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {live.loading && <div className="empty">Loading live attendance…</div>}
        {!live.loading && !rows.length && <div className="empty">No attendance rows for this month.</div>}
      </div>
    </div>
  )
}
