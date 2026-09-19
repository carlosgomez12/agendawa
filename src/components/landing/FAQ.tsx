import { useState } from 'react'
import { Plus } from 'lucide-react'

const preguntas = [
  {
    q: '¿Necesito instalar algo en mi WhatsApp?',
    a: 'No. Conectas tu número una sola vez desde el panel y listo — sin apps raras ni sesiones que se caen a mitad del día.',
  },
  {
    q: '¿Mis datos y los de mis clientes están seguros?',
    a: 'Sí. Tu información se guarda cifrada en una base de datos privada a la que solo tú tienes acceso. Nunca compartimos tus contactos con terceros.',
  },
  {
    q: '¿Cuánto cuesta?',
    a: 'Empiezas gratis 7 días con hasta 10 contactos y automatizaciones manuales. Después, el plan Pro cuesta $29/mes con contactos ilimitados, calendario y recordatorios automáticos.',
  },
  {
    q: '¿Funciona en cualquier celular?',
    a: 'Sí. AgendaWA funciona desde el navegador de tu teléfono o computador, sin importar la marca ni el sistema operativo.',
  },
]

export function FAQ() {
  const [abierta, setAbierta] = useState<number | null>(0)

  return (
    <section id="faq" className="border-b border-cream/10 bg-asphalt-2 px-5 py-24">
      <div className="mx-auto max-w-3xl">
        <div className="mb-12">
          <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.25em] text-accent">
            Preguntas frecuentes
          </p>
          <h2 className="font-display text-4xl font-black uppercase tracking-tight text-cream md:text-5xl">
            Antes de que preguntes.
          </h2>
        </div>

        <div className="divide-y divide-cream/10 border-y border-cream/10">
          {preguntas.map((item, i) => {
            const abiertaAhora = abierta === i
            return (
              <div key={item.q}>
                <button
                  onClick={() => setAbierta(abiertaAhora ? null : i)}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left"
                  aria-expanded={abiertaAhora}
                >
                  <span className="font-display text-lg font-semibold tracking-tight text-cream md:text-xl">
                    {item.q}
                  </span>
                  <Plus
                    size={20}
                    className={`shrink-0 text-accent transition-transform duration-200 ${
                      abiertaAhora ? 'rotate-45' : ''
                    }`}
                  />
                </button>
                <div
                  className={`grid overflow-hidden transition-all duration-200 ${
                    abiertaAhora ? 'grid-rows-[1fr] pb-5' : 'grid-rows-[0fr]'
                  }`}
                >
                  <p className="overflow-hidden text-sm leading-relaxed text-cream/60">
                    {item.a}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
