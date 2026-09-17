import RequestPage from '../components/RequestPage'
import { emptyCopy } from '../lib/demo'

export default function Regularization() {
  return (
    <RequestPage
      title="Regularization"
      copy="Correct a missed swipe or an unusual in/out time."
      actionLabel="New correction"
      empty={emptyCopy.regularization}
      columns={['Date', 'Requested in', 'Requested out', 'Status']}
      rows={[]}
      fields={[
        { name: 'attendanceDate', label: 'Attendance date', type: 'date', value: '2026-09-09', required: true },
        { name: 'requestedInTime', label: 'Requested in', type: 'time', value: '09:00', required: true },
        { name: 'requestedOutTime', label: 'Requested out', type: 'time', value: '18:00', required: true },
        { name: 'note', label: 'Note', type: 'textarea', required: true },
      ]}
    />
  )
}
