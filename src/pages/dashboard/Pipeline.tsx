import { useEffect, useState, type DragEvent } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import {
  supabase,
  ETAPAS,
  enlaceWhatsApp,
  type Contact,
  type EstadoPipeline,
} from '../../lib/supabase'
import { ContactFormModal } from '../../components/dashboard/ContactFormModal'
import { MessageCircle, Pencil, Plus, CalendarClock } from 'lucide-react'

function formatearProxima(iso: string) {
  const d = new Date(iso)
  const dia = d.toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric', month: 'short' })
  const hora = d.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })
  return `${dia} · ${hora}`
}

export function Pipeline() {
  const { user } = useAuth()
  const [contactos, setContactos] = useState<Contact[]>([])
  const [proximasCitas, setProximasCitas] = useState<Record<string, string>>({})
  const [cargando, setCargando] = useState(true)
  const [editando, setEditando] = useState<Contact | null>(null)
  const [creando, setCreando] = useState(false)
  const [arrastrando, setArrastrando] = useState<string | null>(null)

  async function cargar() {
    if (!user) return
    setCargando(true)
    const [{ data: contactosData }, { data: citasData }] = await Promise.all([
      supabase.from('contacts').select('*').order('updated_at', { ascending: false }),
      supabase
        .from('appointments')
        .select('contact_id, fecha_hora')
        .gte('fecha_hora', new Date().toISOString())
        .order('fecha_hora', { ascending: true }),
    ])
    setContactos(contactosData ?? [])

    // Nos quedamos solo con la próxima cita (la más cercana) de cada contacto
    const mapa: Record<string, string> = {}
    for (const cita of citasData ?? []) {
      if (cita.contact_id && !mapa[cita.contact_id]) {
        mapa[cita.contact_id] = cita.fecha_hora
      }
    }
    setProximasCitas(mapa)
    setCargando(false)
  }

  useEffect(() => {
    cargar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  async function moverEtapa(id: string, etapa: EstadoPipeline) {
    setContactos((prev) =>
      prev.map((c) => (c.id === id ? { ...c, estado_pipeline: etapa } : c))
    )
    await supabase
      .from('contacts')
      .update({ estado_pipeline: etapa, updated_at: new Date().toISOString() })
      .eq('id', id)
  }

  function handleDrop(e: DragEvent, etapa: EstadoPipeline) {
    e.preventDefault()
    const id = e.dataTransfer.getData('text/plain')
    if (id) moverEtapa(id, etapa)
    setArrastrando(null)
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900">
            Pipeline de clientes
          </h1>
          <p className="text-sm text-neutral-500">
            Arrastra una tarjeta o usa el selector para cambiarla de etapa.
          </p>
        </div>
        <button
          onClick={() => setCreando(true)}
          className="flex items-center gap-1.5 rounded-md bg-accent px-3 py-2 text-sm font-semibold text-white hover:bg-accent-dark"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">Nuevo contacto</span>
        </button>
      </div>

      {cargando ? (
        <p className="text-sm text-neutral-400">Cargando…</p>
      ) : (
        <div className="-mx-5 flex gap-3 overflow-x-auto px-5 pb-4 sm:mx-0 sm:grid sm:grid-cols-4 sm:gap-4 sm:overflow-visible sm:px-0">
          {ETAPAS.map((etapa) => {
            const items = contactos.filter((c) => c.estado_pipeline === etapa.key)
            return (
              <div
                key={etapa.key}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, etapa.key)}
                className={`w-64 shrink-0 rounded-lg border p-3 sm:w-auto ${
                  arrastrando ? 'border-accent/40 bg-accent/5' : 'border-neutral-200 bg-neutral-100/60'
                }`}
              >
                <div className="mb-3 flex items-center justify-between px-1">
                  <h2 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                    {etapa.label}
                  </h2>
                  <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-neutral-400">
                    {items.length}
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  {items.map((contacto) => (
                    <div
                      key={contacto.id}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('text/plain', contacto.id)
                        setArrastrando(contacto.id)
                      }}
                      onDragEnd={() => setArrastrando(null)}
                      className={`cursor-grab rounded-md border border-neutral-200 bg-white p-3 shadow-sm active:cursor-grabbing ${
                        arrastrando === contacto.id ? 'opacity-40' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold text-neutral-900">
                          {contacto.nombre}
                        </p>
                        <button
                          onClick={() => setEditando(contacto)}
                          className="shrink-0 text-neutral-300 hover:text-neutral-600"
                        >
                          <Pencil size={13} />
                        </button>
                      </div>
                      {contacto.servicio && (
                        <p className="mt-0.5 text-xs text-neutral-500">
                          {contacto.servicio}
                        </p>
                      )}
                      {proximasCitas[contacto.id] && (
                        <p className="mt-1 flex items-center gap-1 text-[11px] font-medium text-accent-dark">
                          <CalendarClock size={11} />
                          {formatearProxima(proximasCitas[contacto.id])}
                        </p>
                      )}

                      <div className="mt-2.5 flex items-center gap-2">
                        <a
                          href={enlaceWhatsApp(
                            contacto.telefono,
                            `¡Hola ${contacto.nombre.split(' ')[0]}! Te escribo por tu servicio de ${
                              contacto.servicio || 'agenda'
                            }.`
                          )}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 rounded-full bg-whatsapp/10 px-2 py-1 text-[11px] font-semibold text-whatsapp hover:bg-whatsapp/20"
                        >
                          <MessageCircle size={11} />
                          WhatsApp
                        </a>
                        <select
                          value={contacto.estado_pipeline}
                          onChange={(e) =>
                            moverEtapa(contacto.id, e.target.value as EstadoPipeline)
                          }
                          className="ml-auto rounded border border-neutral-200 bg-white px-1.5 py-1 text-[11px] text-neutral-500 outline-none"
                        >
                          {ETAPAS.map((et) => (
                            <option key={et.key} value={et.key}>
                              {et.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}

                  {items.length === 0 && (
                    <p className="px-1 py-4 text-center text-xs text-neutral-400">
                      Sin contactos aquí
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {(creando || editando) && (
        <ContactFormModal
          contact={editando}
          onClose={() => {
            setCreando(false)
            setEditando(null)
          }}
          onSaved={() => {
            setCreando(false)
            setEditando(null)
            cargar()
          }}
        />
      )}
    </div>
  )
}
