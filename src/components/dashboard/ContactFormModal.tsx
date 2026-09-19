import { useState, type FormEvent } from 'react'
import { Modal } from '../ui/Modal'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { Button } from '../ui/Button'
import { supabase, ETAPAS, type Contact } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'

interface Props {
  contact?: Contact | null
  onClose: () => void
  onSaved: () => void
}

export function ContactFormModal({ contact, onClose, onSaved }: Props) {
  const { user } = useAuth()
  const [nombre, setNombre] = useState(contact?.nombre ?? '')
  const [telefono, setTelefono] = useState(contact?.telefono ?? '')
  const [servicio, setServicio] = useState(contact?.servicio ?? '')
  const [notas, setNotas] = useState(contact?.notas ?? '')
  const [estado, setEstado] = useState(contact?.estado_pipeline ?? 'contacto_inicial')
  const [error, setError] = useState<string | null>(null)
  const [guardando, setGuardando] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!user) return
    setError(null)
    setGuardando(true)

    const payload = {
      nombre,
      telefono,
      servicio: servicio || null,
      notas: notas || null,
      estado_pipeline: estado,
    }

    const { error } = contact
      ? await supabase.from('contacts').update(payload).eq('id', contact.id)
      : await supabase.from('contacts').insert({ ...payload, user_id: user.id })

    setGuardando(false)
    if (error) {
      setError('No se pudo guardar. Intenta de nuevo.')
      return
    }
    onSaved()
  }

  return (
    <Modal titulo={contact ? 'Editar contacto' : 'Nuevo contacto'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          id="nombre"
          label="Nombre del cliente"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        <Input
          id="telefono"
          label="WhatsApp (con indicativo)"
          placeholder="Ej. 573001234567"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          required
        />
        <Input
          id="servicio"
          label="Servicio"
          placeholder="Ej. Cambio de tubería"
          value={servicio}
          onChange={(e) => setServicio(e.target.value)}
        />
        <Select
          id="estado"
          label="Etapa"
          value={estado}
          onChange={(e) => setEstado(e.target.value as typeof estado)}
          options={ETAPAS.map((et) => ({ value: et.key, label: et.label }))}
        />
        <div className="flex flex-col gap-1.5">
          <label htmlFor="notas" className="text-sm font-medium text-neutral-700">
            Notas (opcional)
          </label>
          <textarea
            id="notas"
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            rows={2}
            className="rounded-md border border-neutral-200 bg-white px-3.5 py-2.5 text-[15px] text-neutral-900 outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
        </div>

        {error && (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
        )}

        <Button type="submit" variant="solid" size="lg" disabled={guardando} className="justify-center">
          {guardando ? 'Guardando…' : 'Guardar contacto'}
        </Button>
      </form>
    </Modal>
  )
}
