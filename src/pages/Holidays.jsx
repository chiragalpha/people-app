import PageHeader from '../components/PageHeader'
import { fetchHolidays } from '../lib/api'
import { useLive } from '../lib/useLive'

export default function Holidays() {
  const live = useLive(() => fetchHolidays(), [])
  const rows = live.data || []

  return (
    <div className="page">
      <PageHeader title="Holidays" copy="Live holiday list." />
      {live.error && <div className="alert">{live.error}</div>}
      <div className="card">
        <table className="table">
          <thead>
            <tr><th>Holiday</th><th>Date</th></tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id || row.holidayName}>
                <td>{row.holidayName}</td>
                <td>{String(row.holidayDate || '').slice(0, 10)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {live.loading && <div className="empty">Loading holidays…</div>}
        {!live.loading && !rows.length && <div className="empty">No holidays returned.</div>}
      </div>
    </div>
  )
}
