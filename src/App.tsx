import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { Landing } from './pages/Landing'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { ForgotPassword } from './pages/ForgotPassword'
import { ResetPassword } from './pages/ResetPassword'
import { PublicAppointment } from './pages/PublicAppointment'
import { ProtectedRoute } from './pages/ProtectedRoute'
import { DashboardLayout } from './components/dashboard/DashboardLayout'
import { Hoy } from './pages/dashboard/Hoy'
import { Pipeline } from './pages/dashboard/Pipeline'
import { Contactos } from './pages/dashboard/Contactos'
import { Recordatorios } from './pages/dashboard/Recordatorios'
import { Historial } from './pages/dashboard/Historial'
import { Asistente } from './pages/dashboard/Asistente'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />
          <Route path="/olvide-contrasena" element={<ForgotPassword />} />
          <Route path="/nueva-contrasena" element={<ResetPassword />} />
          <Route path="/c/:token" element={<PublicAppointment />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard/hoy" replace />} />
            <Route path="hoy" element={<Hoy />} />
            <Route path="pipeline" element={<Pipeline />} />
            <Route path="contactos" element={<Contactos />} />
            <Route path="recordatorios" element={<Recordatorios />} />
            <Route path="historial" element={<Historial />} />
            <Route path="asistente" element={<Asistente />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
