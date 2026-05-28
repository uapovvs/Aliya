import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import HomePage from '@/pages/HomePage'
import LoginPage from '@/pages/LoginPage'
import DashboardPage from '@/pages/DashboardPage'
import StagePage from '@/pages/StagePage'
import AdminPage from '@/pages/admin/AdminPage'
import AdminReviewPage from '@/pages/admin/AdminReviewPage'

function RequireRole({ role, children }: { role: 'ADMIN' | 'PARTICIPANT'; children: JSX.Element }) {
  const auth = useAuthStore()
  if (!auth.token) return <Navigate to="/login" replace />
  if (auth.role !== role) return <Navigate to="/" replace />
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/dashboard"
          element={
            <RequireRole role="PARTICIPANT">
              <DashboardPage />
            </RequireRole>
          }
        />
        <Route
          path="/dashboard/stage/:stage"
          element={
            <RequireRole role="PARTICIPANT">
              <StagePage />
            </RequireRole>
          }
        />

        <Route
          path="/admin"
          element={
            <RequireRole role="ADMIN">
              <AdminPage />
            </RequireRole>
          }
        />
        <Route
          path="/admin/review/:userId"
          element={
            <RequireRole role="ADMIN">
              <AdminReviewPage />
            </RequireRole>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
