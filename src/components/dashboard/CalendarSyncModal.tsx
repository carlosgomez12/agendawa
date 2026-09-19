import { useEffect, useState } from 'react'
import { Modal } from '../ui/Modal'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import { Copy, Check } from 'lucide-react'

interface Props {
  onClose: () => void
}

const BASE_FUNCIONES = 'https://jscmbbpyzreceygkidfg.supabase.co/functions/v1/feed-calendario-ics'

export function CalendarSyncModal({ onClose }: Props) {
  const { user } = useAuth()
  const [url, setUrl] = useState<string | null>(null)
  const [copiado, setCopiado] = useState(false)

  useEffect(() => {
    if (!user) return
    supabase
      .from('profiles')
      .select('calendar_token')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        if (data?.calendar_token) {
          setUrl(`${BASE_FUNCIONES}?token=${data.calendar_token}`)
        }
      })
  }, [user])

  function copiar() {
    if (!url) return
    navigator.clipboard.writeText(url)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  return (
    <Modal titulo="Sincronizar con Google Calendar" onClose={onClose}>
      <div className="flex flex-col gap-4">
        <p className="text-sm text-neutral-600">
          Copia este enlace y pégalo en Google Calendar como un calendario externo.
          Tus citas van a aparecer ahí automáticamente, y se actualizan cada pocas
          horas.
        </p>

        {url ? (
          <div className="flex items-center gap-2 rounded-md border border-neutral-200 bg-neutral-50 p-2.5">
            <code className="flex-1 overflow-x-auto whitespace-nowrap text-xs text-neutral-600">
              {url}
            </code>
            <button
              onClick={copiar}
              className="flex shrink-0 items-center gap-1 rounded-md bg-accent px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-accent-dark"
            >
              {copiado ? <Check size={13} /> : <Copy size={13} />}
              {copiado ? 'Copiado' : 'Copiar'}
            </button>
          </div>
        ) : (
          <p className="text-sm text-neutral-400">Generando tu enlace…</p>
        )}

        <div className="rounded-md bg-neutral-50 p-3 text-sm text-neutral-600">
          <p className="mb-1.5 font-semibold text-neutral-800">Cómo agregarlo:</p>
          <ol className="list-decimal space-y-1 pl-4">
            <li>Abre Google Calendar en tu computador (no funciona desde la app móvil).</li>
            <li>
              A la izquierda, en "Otros calendarios", dale al <strong>+</strong> →{' '}
              <strong>Desde URL</strong>.
            </li>
            <li>Pega el enlace de arriba y dale a "Añadir calendario".</li>
          </ol>
        </div>

        <p className="text-xs text-neutral-400">
          Nota: Google revisa este tipo de calendarios cada pocas horas, no al
          instante — es normal si una cita nueva tarda un rato en aparecer.
        </p>
      </div>
    </Modal>
  )
}
