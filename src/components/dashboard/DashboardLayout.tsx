import { useEffect, useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { supabase, generarEnlaceSuscripcion, type Subscription } from '../../lib/supabase'
import { CalendarDays, KanbanSquare, Users, BellRing, History, LogOut, Crown, CalendarSync, Sparkles } from 'lucide-react'
import { CalendarSyncModal } from './CalendarSyncModal'

const TABS = [
  { to: '/dashboard/hoy', label: 'Hoy', icon: CalendarDays },
  { to: '/dashboard/pipeline', label: 'Pipeline', icon: KanbanSquare },
  { to: '/dashboard/contactos', label: 'Contactos', icon: Users },
  { to: '/dashboard/recordatorios', label: 'Recordatorios', icon: BellRing },
  { to: '/dashboard/historial', label: 'Historial', icon: History },
  { to: '/dashboard/asistente', label: 'Asistente', icon: Sparkles },
]

function diasRestantes(fechaIso: string) {
  const ms = new Date(fechaIso).getTime() - Date.now()
  return Math.max(0, Math.ceil(ms / 86_400_000))
}

export function DashboardLayout() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [suscripcion, setSuscripcion] = useState<Subscription | null>(null)
  const [generando, setGenerando] = useState(false)
  const [mostrarCalendario, setMostrarCalendario] = useState(false)

  useEffect(() => {
    if (!user) return
    supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single()
      .then(({ data }) => setSuscripcion(data))
  }, [user])

  async function handleLogout() {
    await signOut()
    navigate('/')
  }

  async function handleActualizar() {
    setGenerando(true)
    try {
      const enlace = await generarEnlaceSuscripcion()
      window.open(enlace, '_blank')
    } catch (e) {
      alert(e instanceof Error ? e.message : 'No se pudo generar el enlace de pago.')
    }
    setGenerando(false)
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-sm bg-accent font-display text-lg font-black text-asphalt">
              A
            </span>
            <span className="font-display text-lg font-bold tracking-tight text-neutral-900">
              AgendaWA
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setMostrarCalendario(true)}
              className="flex items-center gap-1.5 rounded-md border border-neutral-200 px-2.5 py-1.5 text-xs font-medium text-neutral-600 hover:bg-neutral-50"
              title="Sincronizar con Google Calendar"
            >
              <CalendarSync size={14} />
              <span className="hidden sm:inline">Calendario</span>
            </button>

            {suscripcion &&
              (suscripcion.estado === 'activa' ? (
                <span className="flex items-center gap-1 rounded-full bg-accent/10 px-2.5 py-1 text-xs font-semibold text-accent-dark">
                  <Crown size={12} />
                  Pro
                </span>
              ) : (
                <>
                  <span className="hidden text-xs text-neutral-400 sm:inline">
                    {suscripcion.trial_ends_at && diasRestantes(suscripcion.trial_ends_at) > 0
                      ? `Prueba: ${diasRestantes(suscripcion.trial_ends_at)} días`
                      : 'Prueba vencida'}
                  </span>
                  <button
                    onClick={handleActualizar}
                    disabled={generando}
                    className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-white hover:bg-accent-dark disabled:opacity-50"
                  >
                    {generando ? 'Generando…' : 'Actualizar a Pro'}
                  </button>
                </>
              ))}

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm font-medium text-neutral-500 hover:text-neutral-800"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Cerrar sesión</span>
            </button>
          </div>
        </div>

        <nav className="mx-auto flex max-w-5xl gap-1 overflow-x-auto px-5">
          {TABS.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) =>
                `flex shrink-0 items-center gap-1.5 border-b-2 px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'border-accent text-neutral-900'
                    : 'border-transparent text-neutral-500 hover:text-neutral-800'
                }`
              }
            >
              <tab.icon size={16} />
              {tab.label}
            </NavLink>
          ))}
        </nav>
      </header>

      {mostrarCalendario && (
        <CalendarSyncModal onClose={() => setMostrarCalendario(false)} />
      )}

      <main className="mx-auto max-w-5xl px-5 py-6">
        <Outlet />
      </main>
    </div>
  )
}
