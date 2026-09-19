import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'
import { Button } from '../ui/Button'

const planes = [
  {
    nombre: 'Prueba gratis',
    precio: '$0',
    periodo: '7 días',
    detalle: 'Hasta 10 contactos',
    items: [
      'Hasta 10 contactos',
      'Agenda y pipeline Kanban',
      'Automatizaciones manuales',
      'Enlaces directos a WhatsApp',
    ],
    variant: 'outline-ink' as const,
    cta: 'Empezar gratis',
    destacado: false,
  },
  {
    nombre: 'Pro',
    precio: '$29',
    periodo: '/ mes',
    detalle: 'Todo ilimitado',
    items: [
      'Contactos ilimitados',
      'Sincronización con Google Calendar',
      'Recordatorios automáticos (24h y 2h)',
      'Cobros y anticipos integrados',
    ],
    variant: 'stamp' as const,
    cta: 'Probar 7 días gratis',
    destacado: true,
  },
]

export function Precios() {
  return (
    <section id="precios" className="border-b border-cream/10 px-5 py-24">
      <div className="mx-auto max-w-5xl">
        <div className="mb-14 max-w-xl">
          <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.25em] text-accent">
            Precios
          </p>
          <h2 className="font-display text-4xl font-black uppercase tracking-tight text-cream md:text-5xl">
            Empieza gratis. Escala cuando llenes la agenda.
          </h2>
        </div>

        <div className="grid gap-8 sm:grid-cols-2">
          {planes.map((plan) => (
            <div
              key={plan.nombre}
              className={`relative rounded-sm bg-paper text-ink shadow-xl ${
                plan.destacado ? 'ring-2 ring-accent' : ''
              }`}
            >
              <div className="perforated-top" />
              {plan.destacado && (
                <span className="absolute -top-3 right-6 rounded-sm bg-accent px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-widest text-asphalt">
                  Más elegido
                </span>
              )}
              <div className="px-7 pt-7">
                <p className="font-mono text-xs uppercase tracking-widest text-ink/50">
                  {plan.detalle}
                </p>
                <h3 className="mt-1 font-display text-2xl font-bold uppercase tracking-tight">
                  {plan.nombre}
                </h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="font-display text-5xl font-black">
                    {plan.precio}
                  </span>
                  <span className="font-mono text-sm text-ink/50">
                    {plan.periodo}
                  </span>
                </div>
              </div>

              <div className="mx-7 my-5 border-t border-dashed border-ink/20" />

              <ul className="space-y-3 px-7 pb-3 font-mono text-sm">
                {plan.items.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Check size={16} className="mt-0.5 shrink-0 text-accent-dark" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="p-7 pt-4">
                <Link to="/registro" className="block">
                  <Button variant={plan.variant} className="w-full justify-center">
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
