import RequestPage from '../components/RequestPage'
import { emptyCopy } from '../lib/demo'

export default function Overtime() {
  return (
    <RequestPage
      title="Overtime"
      copy="Record extra hours that need approval."
      actionLabel="Request overtime"
      empty={emptyCopy.overtime}
      columns={['From', 'To', 'Hours', 'Status']}
      rows={[]}
      fields={[
        { name: 'startDate', label: 'From', type: 'date', value: '2026-09-11', required: true },
        { name: 'endDate', label: 'To', type: 'date', value: '2026-09-11', required: true },
        { name: 'note', label: 'Reason', type: 'textarea', required: true },
      ]}
    />
  )
}
