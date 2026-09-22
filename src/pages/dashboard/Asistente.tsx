import { useEffect, useRef, useState, type FormEvent } from 'react'
import { supabase } from '../../lib/supabase'
import { Send, Sparkles } from 'lucide-react'

interface Mensaje {
  role: 'user' | 'assistant'
  content: string
}

const SUGERENCIAS = [
  '¿Cuántas citas tengo esta semana?',
  '¿Quién me debe pagar todavía?',
  'Ayúdame a redactar un mensaje de seguimiento',
]

export function Asistente() {
  const [mensajes, setMensajes] = useState<Mensaje[]>([])
  const [texto, setTexto] = useState('')
  const [enviando, setEnviando] = useState(false)
  const finRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    finRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [mensajes, enviando])

  async function enviar(mensaje: string) {
    if (!mensaje.trim() || enviando) return
    const nuevos: Mensaje[] = [...mensajes, { role: 'user', content: mensaje }]
    setMensajes(nuevos)
    setTexto('')
    setEnviando(true)

    const { data, error } = await supabase.functions.invoke<{
      respuesta?: string
      error?: string
    }>('asistente-chat', { body: { messages: nuevos } })

    let respuesta = data?.respuesta
    if (error || !respuesta) {
      let mensajeError = 'No pude responder. Intenta de nuevo.'
      try {
        const cuerpo = await error?.context?.json()
        if (cuerpo?.error) mensajeError = cuerpo.error
      } catch {
        // sin cuerpo legible
      }
      respuesta = mensajeError
    }

    setMensajes((prev) => [...prev, { role: 'assistant', content: respuesta! }])
    setEnviando(false)
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    enviar(texto)
  }

  return (
    <div className="flex h-[calc(100vh-160px)] flex-col">
      <div className="mb-3">
        <h1 className="text-xl font-bold tracking-tight text-neutral-900">Asistente</h1>
        <p className="text-sm text-neutral-500">
          Pregúntale por tus citas, contactos o pagos — o pídele que te redacte un mensaje.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto rounded-lg border border-neutral-200 bg-white p-4">
        {mensajes.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-accent/10 text-accent-dark">
              <Sparkles size={18} />
            </span>
            <p className="text-sm text-neutral-400">
              Pregúntame algo sobre tu negocio, o pídeme ayuda redactando un mensaje.
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              {SUGERENCIAS.map((s) => (
                <button
                  key={s}
                  onClick={() => enviar(s)}
                  className="rounded-full border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-600 hover:bg-neutral-50"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {mensajes.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] rounded-lg px-3.5 py-2.5 text-sm ${
                  m.role === 'user'
                    ? 'ml-auto bg-accent text-white'
                    : 'bg-neutral-100 text-neutral-800'
                }`}
              >
                <p className="whitespace-pre-wrap">{m.content}</p>
              </div>
            ))}
            {enviando && (
              <div className="max-w-[85%] rounded-lg bg-neutral-100 px-3.5 py-2.5 text-sm text-neutral-400">
                Pensando…
              </div>
            )}
            <div ref={finRef} />
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mt-3 flex items-center gap-2">
        <input
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Escribe tu pregunta…"
          className="flex-1 rounded-md border border-neutral-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
        />
        <button
          type="submit"
          disabled={enviando || !texto.trim()}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-accent text-white hover:bg-accent-dark disabled:opacity-50"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  )
}
