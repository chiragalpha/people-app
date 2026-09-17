import { useMemo, useState } from 'react'
import PageHeader from '../components/PageHeader'
import { fetchPeople } from '../lib/api'
import { useLive } from '../lib/useLive'

export default function Employees() {
  const [q, setQ] = useState('')
  const live = useLive(() => fetchPeople(), [])
  const people = live.data || []
  const rows = useMemo(
    () => people.filter((item) => `${item.nickName || item.nick_name || item.name || ''} ${item.employeeId || ''} ${item.workEmail || ''}`.toLowerCase().includes(q.toLowerCase())),
    [people, q],
  )

  return (
    <div className="page">
      <PageHeader title="People" copy="Live directory from your organisation." />
      {live.error && <div className="alert">{live.error}</div>}
      <div className="card">
        <div className="toolbar">
          <div className="field" style={{ flex: 1 }}>
            <label>Search</label>
            <input value={q} onChange={(event) => setQ(event.target.value)} placeholder="Name or employee ID" />
          </div>
        </div>
        <table className="table">
          <thead>
            <tr><th>Name</th><th>ID</th><th>Email</th></tr>
          </thead>
          <tbody>
            {rows.slice(0, 40).map((row) => (
              <tr key={row.id || row.user_id}>
                <td>{row.nickName || row.nick_name || row.name || [row.firstName, row.lastName].filter(Boolean).join(' ')}</td>
                <td>{row.employeeId || row.employee_id || row.id}</td>
                <td>{row.workEmail || row.work_email || ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {live.loading && <div className="empty">Loading people…</div>}
        {!live.loading && !rows.length && <div className="empty">No people returned.</div>}
      </div>
    </div>
  )
}
