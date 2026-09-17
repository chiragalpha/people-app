import { useState } from 'react'
import PageHeader from './PageHeader'

export default function RequestPage({
  title,
  copy,
  actionLabel,
  fields,
  columns,
  rows,
  empty,
}) {
  const [open, setOpen] = useState(false)
  const [toast, setToast] = useState('')
  const [form, setForm] = useState(() => Object.fromEntries(fields.map((field) => [field.name, field.value || ''])))

  function submit(event) {
    event.preventDefault()
    setOpen(false)
    setToast('Saved locally for review. Live records were not changed.')
    setTimeout(() => setToast(''), 3200)
  }

  return (
    <div className="page">
      <PageHeader
        title={title}
        copy={copy}
        action={<button className="btn forest" onClick={() => setOpen(true)}>{actionLabel}</button>}
      />
      <div className="card">
        <div className="toolbar">
          <div className="field">
            <label>Search</label>
            <input placeholder="Name or request id" />
          </div>
          <div className="field">
            <label>From</label>
            <input type="date" defaultValue="2026-09-01" />
          </div>
          <div className="field">
            <label>To</label>
            <input type="date" defaultValue="2026-09-10" />
          </div>
        </div>
        {rows?.length ? (
          <table className="table">
            <thead>
              <tr>{columns.map((col) => <th key={col}>{col}</th>)}</tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id || row[columns[0]]}>
                  {columns.map((col) => <td key={col}>{row[col] ?? row[col.toLowerCase()] ?? '—'}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty">{empty}</div>
        )}
      </div>

      {open && (
        <div className="drawer-backdrop" style={{ position: 'fixed', inset: 0, background: 'rgba(28,23,18,0.35)', display: 'grid', placeItems: 'center', zIndex: 10 }} onClick={() => setOpen(false)}>
          <form className="card" style={{ width: 460 }} onClick={(event) => event.stopPropagation()} onSubmit={submit}>
            <h3>{actionLabel}</h3>
            <div className="form-stack" style={{ marginTop: 16 }}>
              {fields.map((field) => (
                <div className="field" key={field.name}>
                  <label>{field.label}</label>
                  {field.type === 'textarea' ? (
                    <textarea rows="4" value={form[field.name]} onChange={(event) => setForm({ ...form, [field.name]: event.target.value })} required={field.required} />
                  ) : (
                    <input
                      type={field.type || 'text'}
                      value={form[field.name]}
                      onChange={(event) => setForm({ ...form, [field.name]: event.target.value })}
                      required={field.required}
                    />
                  )}
                </div>
              ))}
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button type="button" className="btn secondary" onClick={() => setOpen(false)}>Cancel</button>
                <button className="btn forest" type="submit">Submit request</button>
              </div>
            </div>
          </form>
        </div>
      )}
      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}
