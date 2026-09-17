import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import { createMaster, deleteMaster, fetchMaster, fetchMasterRecord, plainText, updateMaster } from '../lib/api'
import { getMaster } from '../lib/masters'
import { useLive } from '../lib/useLive'

function cell(row, key) {
  const value = row?.[key]
  if (value == null || value === '') return '—'
  if (typeof value === 'object') return value.name || value.title || JSON.stringify(value)
  return plainText(value)
}

function emptyForm(master, row) {
  const next = {}
  for (const field of master.form || []) {
    if (row && row[field.name] != null) next[field.name] = row[field.name] === true || row[field.name] === false ? row[field.name] : String(row[field.name])
    else next[field.name] = field.type === 'checkbox' ? !!field.value : (field.value ?? '')
  }
  if (row?.id) next.id = row.id
  return next
}

function toPayload(master, form) {
  const body = {}
  for (const field of master.form || []) {
    let value = form[field.name]
    if (field.type === 'checkbox') value = !!value
    else if (field.type === 'number' && value !== '') value = Number(value)
    body[field.name] = value
  }
  if (form.id) body.id = form.id
  return body
}

function resolvePath(path, id) {
  return typeof path === 'function' ? path(id) : path
}

export default function MasterList() {
  const { slug } = useParams()
  const master = getMaster(slug)
  const [tick, setTick] = useState(0)
  const [mode, setMode] = useState(null)
  const [form, setForm] = useState({})
  const [busy, setBusy] = useState(false)
  const [toast, setToast] = useState('')
  const [error, setError] = useState('')

  const live = useLive(async () => {
    if (!master) return { rows: [], record: null }
    if (master.record) return { rows: [], record: await fetchMasterRecord(master.path) }
    return { rows: await fetchMaster(master.path), record: null }
  }, [slug, tick])

  if (!master) {
    return (
      <div className="page">
        <PageHeader title="Master not found" copy="That settings page is not in the catalogue." />
        <Link to="/masters" className="muted-link">Back to master settings</Link>
      </div>
    )
  }

  const rows = live.data?.rows || []
  const record = live.data?.record
  const columns = master.fields.filter((field) => {
    if (record) return record[field] != null
    return rows.some((row) => row[field] != null && row[field] !== '')
  })
  const shown = columns.length ? columns : master.fields.filter((field) => field !== 'id')
  const canCreate = Boolean(master.createPath && master.form?.length)
  const canEdit = Boolean((master.updatePath || master.createPath) && master.form?.length)
  const canDelete = Boolean(master.deletePath)

  function notice(message) {
    setToast(message)
    setTimeout(() => setToast(''), 3200)
  }

  function openCreate() {
    setError('')
    setForm(emptyForm(master))
    setMode('create')
  }

  function openEdit(row) {
    setError('')
    setForm(emptyForm(master, row || record || {}))
    setMode('edit')
  }

  async function save(event) {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      const body = toPayload(master, form)
      if (mode === 'create') {
        await createMaster(master.createPath, body)
        notice('Created.')
      } else {
        const path = resolvePath(master.updatePath, form.id)
        await updateMaster(path, body, master.updateMethod || 'PUT')
        notice('Updated.')
      }
      setMode(null)
      setTick((value) => value + 1)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  async function remove(row) {
    const label = row.name || row.title || row.holidayName || row.ipAddress || row.id
    if (!window.confirm(`Delete “${label}”? This cannot be undone from here.`)) return
    setBusy(true)
    try {
      await deleteMaster(resolvePath(master.deletePath, row.id))
      notice('Deleted.')
      setTick((value) => value + 1)
    } catch (err) {
      notice(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="page">
      <PageHeader
        title={master.title}
        copy={master.copy}
        action={
          <div style={{ display: 'flex', gap: 8 }}>
            <Link className="btn secondary" to="/masters">All masters</Link>
            {canCreate && <button className="btn forest" onClick={openCreate}>Create</button>}
            {master.record && canEdit && <button className="btn forest" onClick={() => openEdit(record)}>Edit</button>}
          </div>
        }
      />
      <p style={{ color: 'var(--muted)', marginTop: -12 }}>GET {master.path}</p>
      {live.error && <div className="alert">{live.error}</div>}
      <div className="card">
        {record && (
          <table className="table">
            <tbody>
              {shown.map((field) => (
                <tr key={field}>
                  <th>{field}</th>
                  <td>{cell(record, field)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!record && (
          <table className="table">
            <thead>
              <tr>
                {shown.map((field) => <th key={field}>{field}</th>)}
                {(canEdit || canDelete) && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={row.id || index}>
                  {shown.map((field) => <td key={field}>{cell(row, field)}</td>)}
                  {(canEdit || canDelete) && (
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        {canEdit && <button className="btn secondary" onClick={() => openEdit(row)}>Edit</button>}
                        {canDelete && <button className="btn secondary" onClick={() => remove(row)}>Delete</button>}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {live.loading && <div className="empty">Loading live master data…</div>}
        {!live.loading && !record && !rows.length && !live.error && <div className="empty">No records returned.</div>}
      </div>

      {mode && (
        <div className="drawer-backdrop" style={{ position: 'fixed', inset: 0, background: 'rgba(28,23,18,0.35)', display: 'grid', placeItems: 'center', zIndex: 10 }} onClick={() => setMode(null)}>
          <form className="card" style={{ width: 460, maxHeight: '86vh', overflow: 'auto' }} onClick={(event) => event.stopPropagation()} onSubmit={save}>
            <h3>{mode === 'create' ? `Create ${master.title}` : `Edit ${master.title}`}</h3>
            {error && <div className="alert" style={{ marginTop: 12 }}>{error}</div>}
            <div className="form-stack" style={{ marginTop: 16 }}>
              {(master.form || []).map((field) => (
                <div className="field" key={field.name}>
                  {field.type === 'checkbox' ? (
                    <label className="check">
                      <input
                        type="checkbox"
                        checked={!!form[field.name]}
                        onChange={(event) => setForm({ ...form, [field.name]: event.target.checked })}
                      />
                      {field.label}
                    </label>
                  ) : (
                    <>
                      <label>{field.label}</label>
                      <input
                        type={field.type || 'text'}
                        required={field.required}
                        value={form[field.name] ?? ''}
                        onChange={(event) => setForm({ ...form, [field.name]: event.target.value })}
                      />
                    </>
                  )}
                </div>
              ))}
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button type="button" className="btn secondary" onClick={() => setMode(null)}>Cancel</button>
                <button className="btn forest" disabled={busy}>{busy ? 'Saving…' : 'Save'}</button>
              </div>
            </div>
          </form>
        </div>
      )}
      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}
