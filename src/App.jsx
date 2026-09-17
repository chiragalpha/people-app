import { Navigate, Route, Routes } from 'react-router-dom'
import AppShell from './components/AppShell'
import Guard from './components/Guard'
import GuestGuard from './components/GuestGuard'
import Approvals from './pages/Approvals'
import Attendance from './pages/Attendance'
import BreakPage from './pages/BreakPage'
import Dashboard from './pages/Dashboard'
import Employees from './pages/Employees'
import ForgotPassword from './pages/ForgotPassword'
import Holidays from './pages/Holidays'
import Leave from './pages/Leave'
import Login from './pages/Login'
import MasterList from './pages/MasterList'
import Masters from './pages/Masters'
import Overtime from './pages/Overtime'
import Profile from './pages/Profile'
import Regularization from './pages/Regularization'
import Shift from './pages/Shift'
import Team from './pages/Team'
import Wfh from './pages/Wfh'

export default function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={(
          <GuestGuard>
            <Login />
          </GuestGuard>
        )}
      />
      <Route
        path="/forgot-password"
        element={(
          <GuestGuard>
            <ForgotPassword />
          </GuestGuard>
        )}
      />
      <Route
        path="/"
        element={(
          <Guard>
            <AppShell />
          </Guard>
        )}
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="break" element={<BreakPage />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="regularization" element={<Regularization />} />
        <Route path="wfh" element={<Wfh />} />
        <Route path="shift" element={<Shift />} />
        <Route path="overtime" element={<Overtime />} />
        <Route path="leave" element={<Leave />} />
        <Route path="team" element={<Team />} />
        <Route path="approvals" element={<Approvals />} />
        <Route path="employees" element={<Employees />} />
        <Route path="holidays" element={<Holidays />} />
        <Route path="profile" element={<Profile />} />
        <Route path="masters" element={<Masters />} />
        <Route path="masters/:slug" element={<MasterList />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
