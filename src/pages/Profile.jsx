import PageHeader from '../components/PageHeader'
import { useAuth } from '../lib/AuthContext'
import { fetchAttendanceProfile, fetchUserDetails } from '../lib/api'
import { useLive } from '../lib/useLive'

export default function Profile() {
  const { user } = useAuth()
  const live = useLive(async () => {
    const [profile, details] = await Promise.all([
      fetchAttendanceProfile(),
      fetchUserDetails(user.userId).catch(() => ({})),
    ])
    return { profile, details }
  }, [user.userId])

  const profile = live.data?.profile || {}
  const details = live.data?.details || {}

  return (
    <div className="page">
      <PageHeader title="My profile" copy="Live profile record." />
      {live.error && <div className="alert">{live.error}</div>}
      <div className="grid cols-2">
        <div className="card">
          <h3>Personal</h3>
          <div className="form-stack">
            <div className="field"><label>Full name</label><input readOnly value={[profile.firstName, profile.lastName].filter(Boolean).join(' ') || user.name || ''} /></div>
            <div className="field"><label>Work email</label><input readOnly value={profile.workEmail || user.email || ''} /></div>
            <div className="field"><label>Preferred name</label><input readOnly value={profile.nickName || details.nickName || ''} /></div>
          </div>
        </div>
        <div className="card">
          <h3>Work</h3>
          <div className="form-stack">
            <div className="field"><label>Employee ID</label><input readOnly value={profile.employeeCode || details.employeeId || ''} /></div>
            <div className="field"><label>Title</label><input readOnly value={profile.jobTitle || ''} /></div>
            <div className="field"><label>Department</label><input readOnly value={profile.department || ''} /></div>
            <div className="field"><label>Username</label><input readOnly value={details.userName || ''} /></div>
          </div>
        </div>
      </div>
    </div>
  )
}
