export default function PageHeader({ title, copy, action }) {
  return (
    <div className="page-title">
      <div>
        <h2>{title}</h2>
        {copy && <p>{copy}</p>}
      </div>
      {action}
    </div>
  )
}
