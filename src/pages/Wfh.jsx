import RequestPage from '../components/RequestPage'
import { emptyCopy } from '../lib/demo'

export default function Wfh() {
  return (
    <RequestPage
      title="Work from home"
      copy="Ask to work away from the office for a day or a stretch of days."
      actionLabel="Request WFH"
      empty={emptyCopy.wfh}
      columns={['From', 'To', 'Days', 'Status']}
      rows={[]}
      fields={[
        { name: 'fromDate', label: 'From', type: 'date', value: '2026-09-15', required: true },
        { name: 'toDate', label: 'To', type: 'date', value: '2026-09-15', required: true },
        { name: 'note', label: 'Reason', type: 'textarea', required: true },
      ]}
    />
  )
}
