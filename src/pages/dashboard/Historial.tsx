import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { supabase, enlaceWhatsApp, type Appointment, type EstadoCita } from '../../lib/supabase'
import { MessageCircle, Search } from 'lucide-react'

const ESTADO_ESTILOS: Record<EstadoCita, string> = {
  pendiente: 'bg-neutral-100 text-neutral-600',
  confirmada: 'bg-blue-50 text-blue-600',
  completada: 'bg-green-50 text-green-600',
  cancelada: 'bg-red-50 text-red-500',
}

const DIAS_HISTORIAL = 90

export function Historial() {
  const { user } = useAuth()
  const [citas, setCitas] = useState<Appointment[]>([])
  const [busqueda, setBusqueda] = useState('')
  const [cargando, setCargando] = useState(true)

  async function cargar() {
    if (!user) return
    setCargando(true)
    const desde = new Date()
    desde.setDate(desde.getDate() - DIAS_HISTORIAL)

    const { data } = await supabase
      .from('appointments')
      .select('*, contacts(nombre, telefono)')
      .lt('fecha_hora', new Date().toISOString())
      .gte('fecha_hora', desde.toISOString())
      .order('fecha_hora', { ascending: false })

    setCitas((data as Appointment[]) ?? [])
    setCargando(false)
  }

  useEffect(() => {
    cargar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const filtradas = useMemo(() => {
    const q = busqueda.trim().toLowerCase()
    if (!q) return citas
    return citas.filter(
      (c) =>
        (c.contacts?.nombre ?? '').toLowerCase().includes(q) ||
        (c.servicio ?? '').toLowerCase().includes(q)
    )
  }, [citas, busqueda])

  const resumen = useMemo(() => {
    const completadas = citas.filter((c) => c.estado === 'completada').length
    const cobrado = citas
      .filter((c) => c.estado_pago === 'pagado')
      .reduce((suma, c) => suma + (c.precio ?? 0), 0)
    return { completadas, cobrado }
  }, [citas])

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-xl font-bold tracking-tight text-neutral-900">Historial</h1>
        <p className="text-sm text-neutral-500">
          Últimos {DIAS_HISTORIAL} días · {resumen.completadas} completadas · $
          {resumen.cobrado.toLocaleString('es-CO')} cobrados
        </p>
      </div>

      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
        <input
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por cliente o servicio…"
          className="w-full rounded-md border border-neutral-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
        />
      </div>

      {cargando ? (
        <p className="text-sm text-neutral-400">Cargando…</p>
      ) : filtradas.length === 0 ? (
        <div className="rounded-lg border border-dashed border-neutral-300 bg-white p-8 text-center">
          <p className="text-sm text-neutral-500">
            {citas.length === 0
              ? 'Todavía no tienes citas pasadas en este rango.'
              : 'No hay citas que coincidan con tu búsqueda.'}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtradas.map((cita) => (
            <div
              key={cita.id}
              className="flex flex-col gap-3 rounded-lg border border-neutral-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs text-neutral-400">
                    {new Date(cita.fecha_hora).toLocaleDateString('es-CO', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                  <p className="font-semibold text-neutral-900">
                    {cita.contacts?.nombre ?? 'Cliente'}
                  </p>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${ESTADO_ESTILOS[cita.estado]}`}
                  >
                    {cita.estado}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                      cita.estado_pago === 'pagado'
                        ? 'bg-green-50 text-green-600'
                        : 'bg-amber-50 text-amber-600'
                    }`}
                  >
                    {cita.estado_pago === 'pagado' ? 'Pagado' : 'Sin pagar'}
                  </span>
                </div>
                <p className="mt-0.5 text-sm text-neutral-500">
                  {cita.servicio || 'Servicio sin especificar'}
                  {cita.precio ? ` · $${cita.precio.toLocaleString('es-CO')}` : ''}
                </p>
              </div>

              {cita.contacts?.telefono && (
                <a
                  href={enlaceWhatsApp(
                    cita.contacts.telefono,
                    `¡Hola ${cita.contacts?.nombre?.split(' ')[0] ?? ''}!`
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-whatsapp/10 text-whatsapp hover:bg-whatsapp/20"
                  title="Enviar WhatsApp"
                >
                  <MessageCircle size={15} />
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
