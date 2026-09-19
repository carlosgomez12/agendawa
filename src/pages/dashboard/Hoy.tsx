import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import {
  supabase,
  enlaceWhatsApp,
  aplicarPlantilla,
  generarEnlacePago,
  PLANTILLAS_DEFAULT,
  type Appointment,
  type Contact,
  type EstadoCita,
  type TipoPlantilla,
} from '../../lib/supabase'
import { AppointmentFormModal } from '../../components/dashboard/AppointmentFormModal'
import { MessageCircle, Plus, DollarSign, Pencil, Link2 } from 'lucide-react'

const ESTADO_ESTILOS: Record<EstadoCita, string> = {
  pendiente: 'bg-neutral-100 text-neutral-600',
  confirmada: 'bg-blue-50 text-blue-600',
  completada: 'bg-green-50 text-green-600',
  cancelada: 'bg-red-50 text-red-500',
}

const DIAS_VISIBLES = 7

function inicioDeHoy() {
  const ahora = new Date()
  return new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate())
}

function claveFecha(iso: string) {
  const d = new Date(iso)
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
}

function etiquetaDia(iso: string) {
  const d = new Date(iso)
  const hoy = inicioDeHoy()
  const manana = new Date(hoy)
  manana.setDate(manana.getDate() + 1)
  const soloFecha = new Date(d.getFullYear(), d.getMonth(), d.getDate())

  if (soloFecha.getTime() === hoy.getTime()) return 'Hoy'
  if (soloFecha.getTime() === manana.getTime()) return 'Mañana'
  return d.toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' })
}

export function Hoy() {
  const { user } = useAuth()
  const [citas, setCitas] = useState<Appointment[]>([])
  const [contactos, setContactos] = useState<Contact[]>([])
  const [cargando, setCargando] = useState(true)
  const [nombre, setNombre] = useState('')
  const [creando, setCreando] = useState(false)
  const [editando, setEditando] = useState<Appointment | null>(null)
  const [generandoCobro, setGenerandoCobro] = useState<string | null>(null)
  const [plantillas, setPlantillas] =
    useState<Record<TipoPlantilla, string>>(PLANTILLAS_DEFAULT)

  async function cargar() {
    if (!user) return
    setCargando(true)
    const inicio = inicioDeHoy()
    const fin = new Date(inicio)
    fin.setDate(fin.getDate() + DIAS_VISIBLES)

    const [{ data: citasData }, { data: contactosData }, { data: perfil }, { data: plantillasData }] =
      await Promise.all([
        supabase
          .from('appointments')
          .select('*, contacts(nombre, telefono)')
          .gte('fecha_hora', inicio.toISOString())
          .lt('fecha_hora', fin.toISOString())
          .order('fecha_hora', { ascending: true }),
        supabase.from('contacts').select('*').order('nombre'),
        supabase.from('profiles').select('nombre_negocio').eq('id', user.id).single(),
        supabase.from('message_templates').select('tipo, contenido').eq('user_id', user.id),
      ])

    setCitas((citasData as Appointment[]) ?? [])
    setContactos(contactosData ?? [])
    setNombre(perfil?.nombre_negocio || user.email?.split('@')[0] || 'ahí')
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

  async function actualizarCita(id: string, cambios: Partial<Appointment>) {
    setCitas((prev) => prev.map((c) => (c.id === id ? { ...c, ...cambios } : c)))
    await supabase.from('appointments').update(cambios).eq('id', id)
  }

  async function generarCobro(cita: Appointment) {
    setGenerandoCobro(cita.id)
    try {
      const enlace = await generarEnlacePago(cita.id)
      const mensaje = aplicarPlantilla(plantillas.cobro, {
        nombre: cita.contacts?.nombre?.split(' ')[0] ?? 'cliente',
        servicio: cita.servicio || 'el servicio',
        fecha: new Date(cita.fecha_hora).toLocaleDateString('es-CO', {
          day: 'numeric',
          month: 'long',
        }),
        hora: new Date(cita.fecha_hora).toLocaleTimeString('es-CO', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        enlace,
        monto: cita.precio?.toLocaleString('es-CO') ?? '',
      })

      if (cita.contacts?.telefono) {
        window.open(enlaceWhatsApp(cita.contacts.telefono, mensaje), '_blank')
      } else {
        window.open(enlace, '_blank')
      }
    } catch (e) {
      alert(e instanceof Error ? e.message : 'No se pudo generar el enlace de pago.')
    }
    setGenerandoCobro(null)
  }

  // Agrupamos las citas por día conservando el orden cronológico
  const grupos: { clave: string; etiqueta: string; citas: Appointment[] }[] = []
  for (const cita of citas) {
    const clave = claveFecha(cita.fecha_hora)
    let grupo = grupos.find((g) => g.clave === clave)
    if (!grupo) {
      grupo = { clave, etiqueta: etiquetaDia(cita.fecha_hora), citas: [] }
      grupos.push(grupo)
    }
    grupo.citas.push(cita)
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900">
            Hola, {nombre} 👋
          </h1>
          <p className="text-sm text-neutral-500">Próximos {DIAS_VISIBLES} días</p>
        </div>
        <button
          onClick={() => setCreando(true)}
          className="flex items-center gap-1.5 rounded-md bg-accent px-3 py-2 text-sm font-semibold text-white hover:bg-accent-dark"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">Nueva cita</span>
        </button>
      </div>

      {cargando ? (
        <p className="text-sm text-neutral-400">Cargando…</p>
      ) : grupos.length === 0 ? (
        <div className="rounded-lg border border-dashed border-neutral-300 bg-white p-8 text-center">
          <p className="text-sm text-neutral-500">
            No tienes citas en los próximos {DIAS_VISIBLES} días.
          </p>
          <button
            onClick={() => setCreando(true)}
            className="mt-3 text-sm font-medium text-accent-dark hover:underline"
          >
            Agendar una
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {grupos.map((grupo) => (
            <div key={grupo.clave}>
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-neutral-400">
                {grupo.etiqueta}
              </h2>
              <div className="flex flex-col gap-2">
                {grupo.citas.map((cita) => (
                  <div
                    key={cita.id}
                    className="flex flex-col gap-3 rounded-lg border border-neutral-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-sm font-semibold text-neutral-900">
                          {new Date(cita.fecha_hora).toLocaleTimeString('es-CO', {
                            hour: '2-digit',
                            minute: '2-digit',
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
                      </div>
                      <p className="mt-0.5 text-sm text-neutral-500">
                        {cita.servicio || 'Servicio sin especificar'}
                        {cita.precio ? ` · $${cita.precio.toLocaleString('es-CO')}` : ''}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-1.5">
                      {cita.contacts?.telefono && (
                        <a
                          href={enlaceWhatsApp(
                            cita.contacts.telefono,
                            `¡Hola! Te confirmo tu cita del ${new Date(
                              cita.fecha_hora
                            ).toLocaleDateString('es-CO', { day: 'numeric', month: 'long' })} a las ${new Date(
                              cita.fecha_hora
                            ).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}.`
                          )}
                          target="_blank"
                          rel="noreferrer"
                          className="grid h-8 w-8 place-items-center rounded-md bg-whatsapp/10 text-whatsapp hover:bg-whatsapp/20"
                          title="Enviar WhatsApp"
                        >
                          <MessageCircle size={15} />
                        </a>
                      )}
                      <button
                        onClick={() =>
                          actualizarCita(cita.id, {
                            estado_pago: cita.estado_pago === 'pagado' ? 'pendiente' : 'pagado',
                          })
                        }
                        className={`flex h-8 items-center gap-1 rounded-md px-2 text-[11px] font-semibold ${
                          cita.estado_pago === 'pagado'
                            ? 'bg-green-50 text-green-600'
                            : 'bg-amber-50 text-amber-600'
                        }`}
                        title="Marcar pago"
                      >
                        <DollarSign size={13} />
                        {cita.estado_pago === 'pagado' ? 'Pagado' : 'Pendiente'}
                      </button>
                      {cita.precio && cita.precio > 0 && cita.estado_pago !== 'pagado' && (
                        <button
                          onClick={() => generarCobro(cita)}
                          disabled={generandoCobro === cita.id}
                          className="flex h-8 items-center gap-1 rounded-md bg-blue-50 px-2 text-[11px] font-semibold text-blue-600 hover:bg-blue-100 disabled:opacity-50"
                          title="Generar enlace de pago"
                        >
                          <Link2 size={13} />
                          {generandoCobro === cita.id ? 'Generando…' : 'Cobrar'}
                        </button>
                      )}
                      <select
                        value={cita.estado}
                        onChange={(e) =>
                          actualizarCita(cita.id, { estado: e.target.value as EstadoCita })
                        }
                        className="h-8 rounded-md border border-neutral-200 bg-white px-1.5 text-[11px] text-neutral-500 outline-none"
                      >
                        <option value="pendiente">Pendiente</option>
                        <option value="confirmada">Confirmada</option>
                        <option value="completada">Completada</option>
                        <option value="cancelada">Cancelada</option>
                      </select>
                      <button
                        onClick={() => setEditando(cita)}
                        className="grid h-8 w-8 place-items-center rounded-md text-neutral-300 hover:bg-neutral-100 hover:text-neutral-600"
                        title="Editar cita"
                      >
                        <Pencil size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {(creando || editando) && (
        <AppointmentFormModal
          appointment={editando}
          contactos={contactos}
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
