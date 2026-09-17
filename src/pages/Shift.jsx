import RequestPage from '../components/RequestPage'
import { emptyCopy } from '../lib/demo'

export default function Shift() {
  return (
    <RequestPage
      title="Shift change"
      copy="Move to another shift for a defined period."
      actionLabel="Request shift change"
      empty={emptyCopy.shift}
      columns={['From', 'To', 'New shift', 'Status']}
      rows={[]}
      fields={[
        { name: 'fromDate', label: 'From', type: 'date', value: '2026-09-14', required: true },
        { name: 'toDate', label: 'To', type: 'date', value: '2026-09-20', required: true },
        { name: 'newShift', label: 'New shift', value: 'General', required: true },
        { name: 'note', label: 'Reason', type: 'textarea', required: true },
      ]}
    />
  )
}
