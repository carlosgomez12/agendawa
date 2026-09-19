import { useState, type FormEvent } from 'react'
import { Modal } from '../ui/Modal'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { Button } from '../ui/Button'
import { supabase, type Appointment, type Contact } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'

interface Props {
  appointment?: Appointment | null
  contactos: Contact[]
  contactoPreseleccionado?: string
  onClose: () => void
  onSaved: () => void
}

function aInputDatetime(iso?: string) {
  if (!iso) return ''
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export function AppointmentFormModal({
  appointment,
  contactos,
  contactoPreseleccionado,
  onClose,
  onSaved,
}: Props) {
  const { user } = useAuth()
  const [contactId, setContactId] = useState(
    appointment?.contact_id ?? contactoPreseleccionado ?? contactos[0]?.id ?? ''
  )
  const [servicio, setServicio] = useState(appointment?.servicio ?? '')
  const [fechaHora, setFechaHora] = useState(aInputDatetime(appointment?.fecha_hora))
  const [precio, setPrecio] = useState(appointment?.precio?.toString() ?? '')
  const [estado, setEstado] = useState(appointment?.estado ?? 'pendiente')
  const [estadoPago, setEstadoPago] = useState(appointment?.estado_pago ?? 'pendiente')
  const [error, setError] = useState<string | null>(null)
  const [guardando, setGuardando] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!user) return
    if (!contactId) {
      setError('Primero registra al menos un contacto.')
      return
    }
    setError(null)
    setGuardando(true)

    const payload: Record<string, unknown> = {
      contact_id: contactId,
      servicio: servicio || null,
      fecha_hora: new Date(fechaHora).toISOString(),
      precio: precio ? Number(precio) : null,
      estado,
      estado_pago: estadoPago,
    }

    // Si estamos editando y la fecha/hora cambió, reiniciamos el ciclo de
    // recordatorios (para que se vuelvan a disparar con el nuevo horario) y
    // limpiamos la solicitud de reprogramación, ya que se acaba de resolver.
    if (appointment && new Date(fechaHora).toISOString() !== appointment.fecha_hora) {
      payload.confirmacion_enviada = false
      payload.recordatorio_24h_enviado = false
      payload.recordatorio_2h_enviado = false
      payload.solicito_reprogramar = false
    }

    const { error } = appointment
      ? await supabase.from('appointments').update(payload).eq('id', appointment.id)
      : await supabase.from('appointments').insert({ ...payload, user_id: user.id })

    setGuardando(false)
    if (error) {
      setError('No se pudo guardar. Intenta de nuevo.')
      return
    }
    onSaved()
  }

  return (
    <Modal titulo={appointment ? 'Editar cita' : 'Nueva cita'} onClose={onClose}>
      {contactos.length === 0 ? (
        <p className="text-sm text-neutral-500">
          Primero registra un contacto en la pestaña "Contactos" para poder
          agendarle una cita.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Select
            id="contacto"
            label="Cliente"
            value={contactId}
            onChange={(e) => setContactId(e.target.value)}
            options={contactos.map((c) => ({ value: c.id, label: c.nombre }))}
          />
          <Input
            id="servicio"
            label="Servicio"
            placeholder="Ej. Revisión de motor"
            value={servicio}
            onChange={(e) => setServicio(e.target.value)}
          />
          <Input
            id="fechaHora"
            type="datetime-local"
            label="Fecha y hora"
            value={fechaHora}
            onChange={(e) => setFechaHora(e.target.value)}
            required
          />
          <Input
            id="precio"
            type="number"
            label="Precio / anticipo (opcional)"
            placeholder="Ej. 40000"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-3">
            <Select
              id="estado"
              label="Estado de la cita"
              value={estado}
              onChange={(e) => setEstado(e.target.value as typeof estado)}
              options={[
                { value: 'pendiente', label: 'Pendiente' },
                { value: 'confirmada', label: 'Confirmada' },
                { value: 'completada', label: 'Completada' },
                { value: 'cancelada', label: 'Cancelada' },
              ]}
            />
            <Select
              id="estadoPago"
              label="Pago"
              value={estadoPago}
              onChange={(e) => setEstadoPago(e.target.value as typeof estadoPago)}
              options={[
                { value: 'pendiente', label: 'Pendiente' },
                { value: 'pagado', label: 'Pagado' },
              ]}
            />
          </div>

          {error && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
          )}

          <Button
            type="submit"
            variant="solid"
            size="lg"
            disabled={guardando}
            className="justify-center"
          >
            {guardando ? 'Guardando…' : 'Guardar cita'}
          </Button>
        </form>
      )}
    </Modal>
  )
}
