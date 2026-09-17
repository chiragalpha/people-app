import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import { MASTER_PAGES } from '../lib/masters'

export default function Masters() {
  return (
    <div className="page">
      <PageHeader
        title="Master settings"
        copy="Live lists from /backend/api/master. These pages only read data."
      />
      <div className="people">
        {MASTER_PAGES.map((item) => (
          <Link className="person" key={item.slug} to={`/masters/${item.slug}`} style={{ textDecoration: 'none' }}>
            <strong>{item.title}</strong>
            <div style={{ color: 'var(--muted)', margin: '8px 0 10px' }}>{item.copy}</div>
            <span className="pill">{item.path.replace('/backend/api/', '')}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
