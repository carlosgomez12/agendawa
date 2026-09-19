import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { CalendarX2, CalendarClock, CheckCircle2 } from 'lucide-react'

interface CitaPublica {
  servicio: string | null
  fecha_hora: string
  estado: string
  solicito_reprogramar: boolean
  nombre_cliente: string | null
  nombre_negocio: string | null
}

export function PublicAppointment() {
  const { token } = useParams()
  const [cita, setCita] = useState<CitaPublica | null>(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(false)
  const [accion, setAccion] = useState<'cancelar' | 'reprogramar' | null>(null)
  const [confirmando, setConfirmando] = useState<'cancelar' | 'reprogramar' | null>(null)

  async function cargar() {
    setCargando(true)
    const { data, error } = await supabase.rpc('obtener_cita_publica', {
      p_token: token,
    })
    if (error || !data || data.length === 0) {
      setError(true)
    } else {
      setCita(data[0])
    }
    setCargando(false)
  }

  useEffect(() => {
    cargar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  async function confirmarCancelacion() {
    setConfirmando('cancelar')
    await supabase.rpc('cancelar_cita_publica', { p_token: token })
    setConfirmando(null)
    setAccion(null)
    cargar()
  }

  async function confirmarReprogramacion() {
    setConfirmando('reprogramar')
    await supabase.rpc('pedir_reprogramar_cita_publica', { p_token: token })
    setConfirmando(null)
    setAccion(null)
    cargar()
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 p-6">
      <div className="w-full max-w-sm rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-sm bg-accent font-display text-lg font-black text-asphalt">
            A
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-neutral-900">
            AgendaWA
          </span>
        </div>

        {cargando ? (
          <p className="text-sm text-neutral-400">Cargando tu cita…</p>
        ) : error || !cita ? (
          <p className="text-sm text-neutral-500">
            Este enlace no es válido o ya expiró.
          </p>
        ) : (
          <>
            <p className="text-sm text-neutral-500">
              {cita.nombre_negocio || 'Tu cita'}
            </p>
            <h1 className="mt-1 text-lg font-bold text-neutral-900">
              {cita.servicio || 'Servicio agendado'}
            </h1>
            <p className="mt-1 text-sm text-neutral-600">
              {new Date(cita.fecha_hora).toLocaleDateString('es-CO', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })}{' '}
              ·{' '}
              {new Date(cita.fecha_hora).toLocaleTimeString('es-CO', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>

            {cita.estado === 'cancelada' ? (
              <p className="mt-5 flex items-center gap-2 rounded-md bg-red-50 p-3 text-sm text-red-600">
                <CalendarX2 size={16} />
                Esta cita ya fue cancelada.
              </p>
            ) : cita.estado === 'completada' ? (
              <p className="mt-5 flex items-center gap-2 rounded-md bg-green-50 p-3 text-sm text-green-600">
                <CheckCircle2 size={16} />
                Este servicio ya fue completado.
              </p>
            ) : cita.solicito_reprogramar ? (
              <p className="mt-5 flex items-center gap-2 rounded-md bg-amber-50 p-3 text-sm text-amber-600">
                <CalendarClock size={16} />
                Ya avisamos que quieres reprogramar. Pronto te escriben para
                acordar un nuevo horario.
              </p>
            ) : accion === null ? (
              <div className="mt-5 flex flex-col gap-2">
                <button
                  onClick={() => setAccion('reprogramar')}
                  className="w-full rounded-md border border-neutral-200 bg-white py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50"
                >
                  Pedir reprogramar
                </button>
                <button
                  onClick={() => setAccion('cancelar')}
                  className="w-full rounded-md bg-red-50 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-100"
                >
                  Cancelar cita
                </button>
              </div>
            ) : (
              <div className="mt-5 rounded-md border border-neutral-200 p-4">
                <p className="text-sm text-neutral-600">
                  {accion === 'cancelar'
                    ? '¿Seguro que quieres cancelar esta cita?'
                    : '¿Confirmas que quieres pedir un nuevo horario para esta cita?'}
                </p>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => setAccion(null)}
                    className="flex-1 rounded-md py-2 text-sm font-medium text-neutral-500 hover:bg-neutral-100"
                  >
                    No, dejarlo así
                  </button>
                  <button
                    onClick={
                      accion === 'cancelar' ? confirmarCancelacion : confirmarReprogramacion
                    }
                    disabled={confirmando !== null}
                    className="flex-1 rounded-md bg-accent py-2 text-sm font-semibold text-white hover:bg-accent-dark disabled:opacity-50"
                  >
                    {confirmando ? 'Enviando…' : 'Sí, confirmar'}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
