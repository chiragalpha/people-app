import { Link } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import { fetchBreaks, fetchDashboard, fetchHolidays, fetchLeaveBalance, fetchServerTime, plainText } from '../lib/api'
import { useLive } from '../lib/useLive'
import PageHeader from '../components/PageHeader'

export default function Dashboard() {
  const { user } = useAuth()
  const live = useLive(async () => {
    const [home, holidays, breaks, time, casual, unpaid] = await Promise.all([
      fetchDashboard().catch(() => ({})),
      fetchHolidays().catch(() => []),
      fetchBreaks().catch(() => []),
      fetchServerTime().catch(() => ({})),
      fetchLeaveBalance('casual', user.userId).catch(() => ({})),
      fetchLeaveBalance('unpaid', user.userId).catch(() => ({})),
    ])
    return { home, holidays, breaks, time, casual, unpaid }
  }, [user.userId])

  const data = live.data || { home: {}, holidays: [], breaks: [], time: {}, casual: {}, unpaid: {} }
  const clock = data.time?.time || data.time?.serverTime || data.time?.currentTime || '—'
  const birthdays = data.home?.birthdays_today || []

  return (
    <div className="page">
      <PageHeader
        title={`Welcome, ${user.name?.split(' ')[0] || 'there'}`}
        copy={`${user.title || 'People'} · ${user.employeeId || user.userId || ''} · live data`}
        action={<Link className="btn forest" to="/leave">Request leave</Link>}
      />
      {live.error && <div className="alert">{live.error}</div>}
      {live.loading && <p style={{ color: 'var(--muted)' }}>Loading live data…</p>}

      <div className="grid cols-3" style={{ marginBottom: 16 }}>
        <div className="card stat">
          <span>Server time</span>
          <b>{String(clock).slice(0, 8)}</b>
          <span>From /backend/api/server-time</span>
        </div>
        <div className="card stat">
          <span>Casual leave left</span>
          <b>{data.casual.available ?? '—'}</b>
          <span>{data.casual.consumed ?? 0} used</span>
        </div>
        <div className="card stat">
          <span>Birthdays today</span>
          <b>{birthdays.length}</b>
          <span>{birthdays[0]?.display_name || birthdays[0]?.name || 'No birthdays listed'}</span>
        </div>
      </div>

      <div className="grid cols-2">
        <div className="card">
          <h3>Leave balance</h3>
          {[
            { name: 'Casual Leave', used: data.casual.consumed, available: data.casual.available },
            { name: 'Unpaid Leave', used: data.unpaid.consumed, available: data.unpaid.available ?? 0 },
          ].map((item) => (
            <div key={item.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--line)' }}>
              <div>
                <strong>{item.name}</strong>
                <div style={{ color: 'var(--muted)', fontSize: 13 }}>{item.used ?? 0} used</div>
              </div>
              <span className="pill good">{item.available ?? 0} available</span>
            </div>
          ))}
        </div>
        <div className="card">
          <h3>Holidays</h3>
          {(data.holidays.slice(0, 6)).map((item) => (
            <div key={item.id || item.holidayName} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--line)' }}>
              <strong>{item.holidayName}</strong>
              <span style={{ color: 'var(--muted)' }}>{String(item.holidayDate || '').slice(0, 10)}</span>
            </div>
          ))}
          {!data.holidays.length && !live.loading && <div className="empty">No holidays returned.</div>}
        </div>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>Break in / out</h3>
          <Link to="/break" className="muted-link">Open board</Link>
        </div>
        <table className="table">
          <thead>
            <tr><th>Name</th><th>ID</th><th>Type</th><th>Time</th><th>Department</th></tr>
          </thead>
          <tbody>
            {data.breaks.map((row) => (
              <tr key={row.id}>
                <td>{plainText(row.nick_name || row.name)}</td>
                <td>{row.user_id}</td>
                <td><span className={`pill ${String(row.status).toUpperCase() === 'IN' ? 'good' : 'warn'}`}>{row.status}</span></td>
                <td>{row.time || row.log_time}</td>
                <td>{row.department}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!data.breaks.length && !live.loading && <div className="empty">No break rows for today.</div>}
      </div>
    </div>
  )
}
