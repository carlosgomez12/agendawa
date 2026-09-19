import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { supabase, ETAPAS, enlaceWhatsApp, type Contact } from '../../lib/supabase'
import { ContactFormModal } from '../../components/dashboard/ContactFormModal'
import { AppointmentFormModal } from '../../components/dashboard/AppointmentFormModal'
import { MessageCircle, Pencil, Plus, Search, Trash2, CalendarPlus } from 'lucide-react'

export function Contactos() {
  const { user } = useAuth()
  const [contactos, setContactos] = useState<Contact[]>([])
  const [busqueda, setBusqueda] = useState('')
  const [cargando, setCargando] = useState(true)
  const [editando, setEditando] = useState<Contact | null>(null)
  const [creando, setCreando] = useState(false)
  const [agendando, setAgendando] = useState<Contact | null>(null)
  const [borrando, setBorrando] = useState<Contact | null>(null)

  async function cargar() {
    if (!user) return
    setCargando(true)
    const { data } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false })
    setContactos(data ?? [])
    setCargando(false)
  }

  useEffect(() => {
    cargar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase()
    if (!q) return contactos
    return contactos.filter(
      (c) =>
        c.nombre.toLowerCase().includes(q) ||
        c.telefono.includes(q) ||
        (c.servicio ?? '').toLowerCase().includes(q)
    )
  }, [contactos, busqueda])

  async function confirmarBorrado() {
    if (!borrando) return
    await supabase.from('contacts').delete().eq('id', borrando.id)
    setBorrando(null)
    cargar()
  }

  function etiquetaEtapa(key: Contact['estado_pipeline']) {
    return ETAPAS.find((e) => e.key === key)?.label ?? key
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900">
            Contactos
          </h1>
          <p className="text-sm text-neutral-500">
            {contactos.length} en total
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

      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
        <input
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por nombre, teléfono o servicio…"
          className="w-full rounded-md border border-neutral-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
        />
      </div>

      {cargando ? (
        <p className="text-sm text-neutral-400">Cargando…</p>
      ) : filtrados.length === 0 ? (
        <div className="rounded-lg border border-dashed border-neutral-300 bg-white p-8 text-center">
          <p className="text-sm text-neutral-500">
            {contactos.length === 0
              ? 'Todavía no tienes contactos. Crea el primero.'
              : 'No hay contactos que coincidan con tu búsqueda.'}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtrados.map((c) => (
            <div
              key={c.id}
              className="flex flex-col gap-3 rounded-lg border border-neutral-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-neutral-900">{c.nombre}</p>
                  <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-500">
                    {etiquetaEtapa(c.estado_pipeline)}
                  </span>
                </div>
                <p className="mt-0.5 text-sm text-neutral-500">
                  {c.telefono}
                  {c.servicio ? ` · ${c.servicio}` : ''}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-1.5">
                <a
                  href={enlaceWhatsApp(
                    c.telefono,
                    `¡Hola ${c.nombre.split(' ')[0]}! Te escribo por tu servicio.`
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="grid h-8 w-8 place-items-center rounded-md bg-whatsapp/10 text-whatsapp hover:bg-whatsapp/20"
                  title="Enviar WhatsApp"
                >
                  <MessageCircle size={15} />
                </a>
                <button
                  onClick={() => setAgendando(c)}
                  className="grid h-8 w-8 place-items-center rounded-md bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
                  title="Agendar cita"
                >
                  <CalendarPlus size={15} />
                </button>
                <button
                  onClick={() => setEditando(c)}
                  className="grid h-8 w-8 place-items-center rounded-md bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
                  title="Editar"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => setBorrando(c)}
                  className="grid h-8 w-8 place-items-center rounded-md bg-red-50 text-red-400 hover:bg-red-100"
                  title="Eliminar"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
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

      {agendando && (
        <AppointmentFormModal
          contactos={contactos}
          contactoPreseleccionado={agendando.id}
          onClose={() => setAgendando(null)}
          onSaved={() => setAgendando(null)}
        />
      )}

      {borrando && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-5 shadow-xl">
            <p className="font-semibold text-neutral-900">
              ¿Eliminar a {borrando.nombre}?
            </p>
            <p className="mt-1 text-sm text-neutral-500">
              También se eliminan sus citas. Esta acción no se puede deshacer.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setBorrando(null)}
                className="rounded-md px-3 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarBorrado}
                className="rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white hover:bg-red-600"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
