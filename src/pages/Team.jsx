import PageHeader from '../components/PageHeader'
import { team } from '../lib/demo'

export default function Team() {
  return (
    <div className="page">
      <PageHeader title="Team summary" copy="Who is in, who is away, and who sits near you." />
      <div className="grid cols-3" style={{ marginBottom: 16 }}>
        <div className="card stat"><span>Present</span><b>16</b></div>
        <div className="card stat"><span>On leave</span><b>2</b></div>
        <div className="card stat"><span>On break</span><b>1</b></div>
      </div>
      <div className="people">
        {team.map((person) => (
          <div className="person" key={person.name}>
            <div className="avatar" style={{ marginBottom: 12 }}>{person.name[0]}</div>
            <strong>{person.name}</strong>
            <div style={{ color: 'var(--muted)', margin: '4px 0 10px' }}>{person.title}</div>
            <span className={`pill ${person.status === 'In' ? 'good' : 'warn'}`}>{person.status}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
