import { QrCode, CalendarCheck, BellRing } from 'lucide-react'

const pasos = [
  {
    numero: '01',
    icono: QrCode,
    titulo: 'Conecta tu WhatsApp',
    texto:
      'Vincula tu número en segundos y envía tu primer mensaje de prueba antes de que se enfríe el café.',
  },
  {
    numero: '02',
    icono: CalendarCheck,
    titulo: 'Agenda tus servicios',
    texto:
      'Registra cliente, servicio y hora. Cada cita se acomoda sola en tu pipeline: contacto, cita, en servicio, cobrado.',
  },
  {
    numero: '03',
    icono: BellRing,
    titulo: 'Cobra y automatiza',
    texto:
      'Envía el enlace de cobro y deja que los recordatorios de 24h y 2h antes hagan el resto por ti.',
  },
]

export function ComoFunciona() {
  return (
    <section id="como-funciona" className="border-b border-cream/10 px-5 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 max-w-xl">
          <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.25em] text-accent">
            El proceso
          </p>
          <h2 className="font-display text-4xl font-black uppercase tracking-tight text-cream md:text-5xl">
            Tres pasos. Cero fricción.
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {pasos.map((paso) => (
            <div
              key={paso.numero}
              className="group relative flex flex-col rounded-sm border border-cream/10 bg-asphalt-2 p-7 transition-colors hover:border-accent/40"
            >
              <span className="font-mono text-5xl font-bold text-cream/10 transition-colors group-hover:text-accent/25">
                {paso.numero}
              </span>
              <div className="mt-4 flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-accent/15 text-accent">
                  <paso.icono size={20} strokeWidth={2.2} />
                </span>
                <h3 className="font-display text-xl font-bold uppercase tracking-tight text-cream">
                  {paso.titulo}
                </h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-cream/60">
                {paso.texto}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
