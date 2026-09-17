import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import { APP_NAME, APP_TAGLINE } from '../lib/branding'

const groups = [
  {
    label: 'Home',
    items: [{ to: '/dashboard', label: 'Dashboard' }],
  },
  {
    label: 'Me',
    items: [
      { to: '/break', label: 'Break in / out' },
      { to: '/attendance', label: 'Attendance' },
      { to: '/regularization', label: 'Regularization' },
      { to: '/wfh', label: 'Work from home' },
      { to: '/shift', label: 'Shift change' },
      { to: '/overtime', label: 'Overtime' },
      { to: '/leave', label: 'Leave' },
    ],
  },
  {
    label: 'Team',
    items: [
      { to: '/team', label: 'Team summary' },
      { to: '/approvals', label: 'Approvals' },
    ],
  },
  {
    label: 'Workplace',
    items: [
      { to: '/employees', label: 'People' },
      { to: '/holidays', label: 'Holidays' },
      { to: '/profile', label: 'My profile' },
    ],
  },
  {
    label: 'Masters',
    items: [
      { to: '/masters', label: 'Master settings' },
      { to: '/masters/departments', label: 'Departments' },
      { to: '/masters/job-titles', label: 'Job titles' },
      { to: '/masters/shifts', label: 'Shifts' },
      { to: '/masters/leave-type', label: 'Leave types' },
      { to: '/masters/attendance-lock', label: 'Attendance lock' },
    ],
  },
]

export default function AppShell() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const initials = (user.name || 'N').split(' ').map((part) => part[0]).join('').slice(0, 2)

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="logo">
          <div className="logo-mark">P</div>
          <div>
            <h1>{APP_NAME}</h1>
            <p>{APP_TAGLINE}</p>
          </div>
        </div>
        {groups.map((group) => (
          <div className="nav-group" key={group.label}>
            <small>{group.label}</small>
            {group.items.map((item) => (
              <NavLink key={item.to} to={item.to} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                {item.label}
              </NavLink>
            ))}
          </div>
        ))}
        <div className="sidebar-foot">{APP_TAGLINE}</div>
      </aside>
      <div className="content">
        <header className="topbar">
          <div>
            <strong>Good day</strong>
            <div style={{ color: 'var(--muted)', fontSize: 13 }}>Thursday, 10 September 2026</div>
          </div>
          <div className="who">
            <div className="avatar">{initials}</div>
            <div>
              <strong>{user.name}</strong>
              <div style={{ color: 'var(--muted)', fontSize: 12 }}>{user.email}</div>
            </div>
            <button
              className="btn secondary"
              onClick={() => {
                logout()
                navigate('/login')
              }}
            >
              Sign out
            </button>
          </div>
        </header>
        <Outlet />
      </div>
    </div>
  )
}
