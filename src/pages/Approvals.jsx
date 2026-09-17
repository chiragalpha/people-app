import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import { emptyCopy } from '../lib/demo'

const tabs = ['Leave', 'WFH', 'Regularization', 'Shift', 'Overtime']

export default function Approvals() {
  const [tab, setTab] = useState('Leave')
  return (
    <div className="page">
      <PageHeader title="Approvals" copy="Requests from your team, waiting on a yes or a note." />
      <div className="card">
        <div className="toolbar">
          {tabs.map((item) => (
            <button key={item} className={tab === item ? 'btn forest' : 'btn secondary'} onClick={() => setTab(item)}>
              {item}
            </button>
          ))}
        </div>
        <div className="empty">{emptyCopy.approvals}</div>
      </div>
    </div>
  )
}
