import { useAuth } from '../lib/AuthContext'
import { fetchLeaveBalance, fetchLeaveRows } from '../lib/api'
import { useLive } from '../lib/useLive'
import RequestPage from '../components/RequestPage'

export default function Leave() {
  const { user } = useAuth()
  const live = useLive(async () => {
    const [casual, unpaid, rows] = await Promise.all([
      fetchLeaveBalance('casual', user.userId).catch(() => ({})),
      fetchLeaveBalance('unpaid', user.userId).catch(() => ({})),
      fetchLeaveRows(user.userId).catch(() => []),
    ])
    return { casual, unpaid, rows }
  }, [user.userId])

  const casual = live.data?.casual || {}
  const unpaid = live.data?.unpaid || {}
  const rows = (live.data?.rows || []).map((row) => ({
    Dates: `${row.start_date || row.startDate || ''} – ${row.end_date || row.endDate || ''}`,
    Type: row.leave_type || row.leaveType || row.leave_type_name || 'Leave',
    Days: row.total_days || row.totalDays || row.days || '—',
    Status: row.status || '—',
    id: row.id,
  }))

  return (
    <div>
      <div className="page" style={{ paddingBottom: 0 }}>
        {live.error && <div className="alert">{live.error}</div>}
        <div className="grid cols-3">
          <div className="card stat"><span>Casual leave</span><b>{casual.available ?? '—'}</b><span>{casual.consumed ?? 0} used</span></div>
          <div className="card stat"><span>Unpaid leave</span><b>{unpaid.available ?? 0}</b><span>{unpaid.consumed ?? 0} used</span></div>
          <div className="card stat"><span>Annual quota</span><b>{casual.annualQuota ?? '—'}</b><span>From live leave API</span></div>
        </div>
      </div>
      <RequestPage
        title="Leave"
        copy={live.loading ? 'Loading live leave history…' : 'Live leave history. New requests stay on screen only.'}
        actionLabel="Request leave"
        empty="No leave requests in this month."
        columns={['Dates', 'Type', 'Days', 'Status']}
        rows={rows}
        fields={[
          { name: 'startDate', label: 'From', type: 'date', value: '2026-09-12', required: true },
          { name: 'endDate', label: 'To', type: 'date', value: '2026-09-12', required: true },
          { name: 'leaveType', label: 'Leave type', value: 'Casual Leave', required: true },
          { name: 'note', label: 'Reason', type: 'textarea', required: true },
        ]}
      />
    </div>
  )
}
