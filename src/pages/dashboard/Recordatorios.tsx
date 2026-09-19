import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import {
  supabase,
  enlaceWhatsApp,
  aplicarPlantilla,
  PLANTILLAS_DEFAULT,
  type Appointment,
  type Contact,
  type TipoPlantilla,
} from '../../lib/supabase'
import { TemplatesModal } from '../../components/dashboard/TemplatesModal'
import { AppointmentFormModal } from '../../components/dashboard/AppointmentFormModal'
import { MessageCircle, Settings2, Check, BellRing, CalendarClock, Pencil } from 'lucide-react'

type TipoAccionAutomatica = Exclude<TipoPlantilla, 'cobro'>

interface Accion {
  tipo: TipoAccionAutomatica
  cita: Appointment
}

const ETIQUETA_TIPO: Record<TipoAccionAutomatica, { label: string; estilo: string }> = {
  confirmacion: { label: 'Confirmar cita', estilo: 'bg-blue-50 text-blue-600' },
  recordatorio_24h: { label: 'Recordatorio 24h', estilo: 'bg-amber-50 text-amber-600' },
  recordatorio_2h: { label: 'Recordatorio 2h', estilo: 'bg-red-50 text-red-500' },
  seguimiento: { label: 'Pedir reseña', estilo: 'bg-green-50 text-green-600' },
}

const CAMPO_ENVIADO: Record<TipoAccionAutomatica, keyof Appointment> = {
  confirmacion: 'confirmacion_enviada',
  recordatorio_24h: 'recordatorio_24h_enviado',
  recordatorio_2h: 'recordatorio_2h_enviado',
  seguimiento: 'seguimiento_enviado',
}

const PRIORIDAD: TipoAccionAutomatica[] = [
  'recordatorio_2h',
  'seguimiento',
  'recordatorio_24h',
  'confirmacion',
]

export function Recordatorios() {
  const { user } = useAuth()
  const [citas, setCitas] = useState<Appointment[]>([])
  const [contactos, setContactos] = useState<Contact[]>([])
  const [plantillas, setPlantillas] =
    useState<Record<TipoPlantilla, string>>(PLANTILLAS_DEFAULT)
  const [cargando, setCargando] = useState(true)
  const [editandoPlantillas, setEditandoPlantillas] = useState(false)
  const [editandoCita, setEditandoCita] = useState<Appointment | null>(null)

  async function cargar() {
    if (!user) return
    setCargando(true)
    const hace14dias = new Date()
    hace14dias.setDate(hace14dias.getDate() - 14)
    const en7dias = new Date()
    en7dias.setDate(en7dias.getDate() + 7)

    const [{ data: citasData }, { data: plantillasData }, { data: contactosData }] =
      await Promise.all([
        supabase
          .from('appointments')
          .select('*, contacts(nombre, telefono)')
          .gte('fecha_hora', hace14dias.toISOString())
          .lt('fecha_hora', en7dias.toISOString())
          .neq('estado', 'cancelada')
          .order('fecha_hora', { ascending: true }),
        supabase.from('message_templates').select('tipo, contenido').eq('user_id', user.id),
        supabase.from('contacts').select('*').order('nombre'),
      ])

    setCitas((citasData as Appointment[]) ?? [])
    setContactos(contactosData ?? [])
    if (plantillasData) {
      setPlantillas((prev) => {
        const nuevo = { ...prev }
        for (const fila of plantillasData) {
          nuevo[fila.tipo as TipoPlantilla] = fila.contenido
        }
        return nuevo
      })
    }
    setCargando(false)
  }

  useEffect(() => {
    cargar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const acciones: Accion[] = []
  const ahora = Date.now()
  for (const cita of citas) {
    const horasRestantes = (new Date(cita.fecha_hora).getTime() - ahora) / 3_600_000

    if (!cita.confirmacion_enviada && horasRestantes > 0) {
      acciones.push({ tipo: 'confirmacion', cita })
    }
    if (!cita.recordatorio_24h_enviado && horasRestantes > 0 && horasRestantes <= 24) {
      acciones.push({ tipo: 'recordatorio_24h', cita })
    }
    if (!cita.recordatorio_2h_enviado && horasRestantes > 0 && horasRestantes <= 2) {
      acciones.push({ tipo: 'recordatorio_2h', cita })
    }
    if (cita.estado === 'completada' && !cita.seguimiento_enviado) {
      acciones.push({ tipo: 'seguimiento', cita })
    }
  }
  acciones.sort((a, b) => PRIORIDAD.indexOf(a.tipo) - PRIORIDAD.indexOf(b.tipo))

  const solicitudes = citas.filter((c) => c.solicito_reprogramar)

  async function resolverSolicitud(id: string) {
    setCitas((prev) =>
      prev.map((c) => (c.id === id ? { ...c, solicito_reprogramar: false } : c))
    )
    await supabase.from('appointments').update({ solicito_reprogramar: false }).eq('id', id)
  }

  async function marcarEnviado(accion: Accion) {
    const campo = CAMPO_ENVIADO[accion.tipo]
    setCitas((prev) =>
      prev.map((c) => (c.id === accion.cita.id ? { ...c, [campo]: true } : c))
    )
    await supabase.from('appointments').update({ [campo]: true }).eq('id', accion.cita.id)
  }

  function mensajePara(accion: Accion) {
    const { cita } = accion
    const fecha = new Date(cita.fecha_hora).toLocaleDateString('es-CO', {
      day: 'numeric',
      month: 'long',
    })
    const hora = new Date(cita.fecha_hora).toLocaleTimeString('es-CO', {
      hour: '2-digit',
      minute: '2-digit',
    })
    const enlace = `${window.location.origin}/c/${cita.token_publico}`
    return aplicarPlantilla(plantillas[accion.tipo], {
      nombre: cita.contacts?.nombre?.split(' ')[0] ?? 'cliente',
      servicio: cita.servicio || 'tu servicio',
      fecha,
      hora,
      enlace,
    })
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900">
            Recordatorios
          </h1>
          <p className="text-sm text-neutral-500">
            Mensajes listos para mandar, tú das el toque final.
          </p>
        </div>
        <button
          onClick={() => setEditandoPlantillas(true)}
          className="flex items-center gap-1.5 rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-50"
        >
          <Settings2 size={15} />
          <span className="hidden sm:inline">Plantillas</span>
        </button>
      </div>

      {cargando ? (
        <p className="text-sm text-neutral-400">Cargando…</p>
      ) : (
        <>
          {solicitudes.length > 0 && (
            <div className="mb-6">
              <h2 className="mb-2 flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wide text-amber-600">
                <CalendarClock size={14} />
                Tus clientes pidieron reprogramar
              </h2>
              <div className="flex flex-col gap-2">
                {solicitudes.map((cita) => (
                  <div
                    key={cita.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-neutral-900">
                        {cita.contacts?.nombre ?? 'Cliente'}
                      </p>
                      <p className="text-xs text-neutral-500">
                        Cita original:{' '}
                        {new Date(cita.fecha_hora).toLocaleDateString('es-CO', {
                          day: 'numeric',
                          month: 'short',
                        })}{' '}
                        ·{' '}
                        {new Date(cita.fecha_hora).toLocaleTimeString('es-CO', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {cita.contacts?.telefono && (
                        <a
                          href={enlaceWhatsApp(
                            cita.contacts.telefono,
                            `¡Hola ${cita.contacts?.nombre?.split(' ')[0] ?? ''}! Vi que necesitas reprogramar tu cita — ¿qué día y hora te queda bien?`
                          )}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 rounded-md bg-whatsapp px-3 py-1.5 text-xs font-semibold text-white hover:brightness-95"
                        >
                          <MessageCircle size={13} />
                          Escribirle
                        </a>
                      )}
                      <button
                        onClick={() => setEditandoCita(cita)}
                        className="flex items-center gap-1 rounded-md bg-white px-2.5 py-1.5 text-xs font-semibold text-neutral-600 hover:bg-neutral-100"
                      >
                        <Pencil size={12} />
                        Cambiar fecha
                      </button>
                      <button
                        onClick={() => resolverSolicitud(cita.id)}
                        className="text-xs font-medium text-neutral-400 hover:text-neutral-600"
                      >
                        Marcar resuelto
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {acciones.length === 0 ? (
            <div className="rounded-lg border border-dashed border-neutral-300 bg-white p-8 text-center">
              <BellRing size={22} className="mx-auto mb-2 text-neutral-300" />
              <p className="text-sm text-neutral-500">
                No hay nada pendiente por ahora — al día.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {acciones.map((accion) => (
                <div
                  key={`${accion.tipo}-${accion.cita.id}`}
                  className="rounded-lg border border-neutral-200 bg-white p-4"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${ETIQUETA_TIPO[accion.tipo].estilo}`}
                    >
                      {ETIQUETA_TIPO[accion.tipo].label}
                    </span>
                    <p className="text-sm font-semibold text-neutral-900">
                      {accion.cita.contacts?.nombre ?? 'Cliente'}
                    </p>
                    <span className="font-mono text-xs text-neutral-400">
                      {new Date(accion.cita.fecha_hora).toLocaleDateString('es-CO', {
                        day: 'numeric',
                        month: 'short',
                      })}{' '}
                      ·{' '}
                      {new Date(accion.cita.fecha_hora).toLocaleTimeString('es-CO', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <p className="mt-2 rounded-md bg-neutral-50 p-2.5 text-sm text-neutral-600">
                    {mensajePara(accion)}
                  </p>

                  <div className="mt-3 flex items-center gap-2">
                    {accion.cita.contacts?.telefono && (
                      <a
                        href={enlaceWhatsApp(accion.cita.contacts.telefono, mensajePara(accion))}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => marcarEnviado(accion)}
                        className="flex items-center gap-1.5 rounded-md bg-whatsapp px-3 py-1.5 text-xs font-semibold text-white hover:brightness-95"
                      >
                        <MessageCircle size={13} />
                        Abrir en WhatsApp
                      </a>
                    )}
                    <button
                      onClick={() => marcarEnviado(accion)}
                      className="flex items-center gap-1 text-xs font-medium text-neutral-400 hover:text-neutral-600"
                    >
                      <Check size={13} />
                      Ya la envié
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {editandoPlantillas && (
        <TemplatesModal
          onClose={() => {
            setEditandoPlantillas(false)
            cargar()
          }}
        />
      )}

      {editandoCita && (
        <AppointmentFormModal
          appointment={editandoCita}
          contactos={contactos}
          onClose={() => setEditandoCita(null)}
          onSaved={() => {
            setEditandoCita(null)
            cargar()
          }}
        />
      )}
    </div>
  )
}
