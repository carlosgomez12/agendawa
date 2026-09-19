import { useEffect, useState } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { useAuth } from '../../contexts/AuthContext'
import {
  supabase,
  PLANTILLAS_INFO,
  PLANTILLAS_DEFAULT,
  type TipoPlantilla,
} from '../../lib/supabase'

interface Props {
  onClose: () => void
}

export function TemplatesModal({ onClose }: Props) {
  const { user } = useAuth()
  const [valores, setValores] = useState<Record<TipoPlantilla, string>>(PLANTILLAS_DEFAULT)
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [guardado, setGuardado] = useState(false)

  useEffect(() => {
    if (!user) return
    supabase
      .from('message_templates')
      .select('tipo, contenido')
      .eq('user_id', user.id)
      .then(({ data }) => {
        if (data) {
          setValores((prev) => {
            const nuevo = { ...prev }
            for (const fila of data) {
              nuevo[fila.tipo as TipoPlantilla] = fila.contenido
            }
            return nuevo
          })
        }
        setCargando(false)
      })
  }, [user])

  async function guardar() {
    if (!user) return
    setGuardando(true)
    for (const { key } of PLANTILLAS_INFO) {
      await supabase
        .from('message_templates')
        .upsert(
          { user_id: user.id, tipo: key, contenido: valores[key] },
          { onConflict: 'user_id,tipo' }
        )
    }
    setGuardando(false)
    setGuardado(true)
    setTimeout(onClose, 700)
  }

  return (
    <Modal titulo="Plantillas de mensajes" onClose={onClose}>
      {cargando ? (
        <p className="text-sm text-neutral-400">Cargando…</p>
      ) : (
        <div className="flex flex-col gap-5">
          <p className="text-xs text-neutral-500">
            Usa <code className="rounded bg-neutral-100 px-1">{'{nombre}'}</code>,{' '}
            <code className="rounded bg-neutral-100 px-1">{'{servicio}'}</code>,{' '}
            <code className="rounded bg-neutral-100 px-1">{'{fecha}'}</code>,{' '}
            <code className="rounded bg-neutral-100 px-1">{'{hora}'}</code>,{' '}
            <code className="rounded bg-neutral-100 px-1">{'{enlace}'}</code> y{' '}
            <code className="rounded bg-neutral-100 px-1">{'{monto}'}</code> — se reemplazan
            solos al enviar.
          </p>

          {PLANTILLAS_INFO.map(({ key, label }) => (
            <div key={key} className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-neutral-700">{label}</label>
              <textarea
                value={valores[key]}
                onChange={(e) => setValores({ ...valores, [key]: e.target.value })}
                rows={3}
                className="rounded-md border border-neutral-200 bg-white px-3.5 py-2.5 text-sm text-neutral-900 outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
            </div>
          ))}

          <Button
            onClick={guardar}
            variant="solid"
            size="lg"
            disabled={guardando}
            className="justify-center"
          >
            {guardando ? 'Guardando…' : guardado ? '¡Guardado! ✓' : 'Guardar plantillas'}
          </Button>
        </div>
      )}
    </Modal>
  )
}
