const nichos = [
  {
    id: '002',
    oficio: 'Fontanero',
    texto:
      'Cotiza la visita, agenda la reparación y cobra el anticipo antes de salir de casa.',
  },
  {
    id: '014',
    oficio: 'Mecánico a domicilio',
    texto:
      'Ordena tu día por zona y servicio, y avisa solo cuando el carro esté listo para recoger.',
  },
  {
    id: '027',
    oficio: 'Entrenador personal',
    texto:
      'Confirma la sesión, cobra la mensualidad y pide la reseña sin escribir el mismo mensaje dos veces.',
  },
  {
    id: '033',
    oficio: 'Servicio de limpieza',
    texto:
      'Programa visitas recurrentes y que cada cliente reciba su recordatorio automáticamente.',
  },
]

export function CasosDeUso() {
  return (
    <section id="nichos" className="border-b border-cream/10 bg-asphalt-2 px-5 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 max-w-xl">
          <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.25em] text-accent">
            Hecho a tu medida
          </p>
          <h2 className="font-display text-4xl font-black uppercase tracking-tight text-cream md:text-5xl">
            Un oficio, una forma de trabajar.
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {nichos.map((n) => (
            <div
              key={n.id}
              className="relative rounded-sm bg-paper p-6 text-ink shadow-lg"
            >
              <div className="flex items-baseline justify-between border-b border-dashed border-ink/20 pb-3">
                <h3 className="font-display text-lg font-bold uppercase tracking-tight">
                  {n.oficio}
                </h3>
                <span className="font-mono text-xs text-ink/40">
                  ORDEN #{n.id}
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-ink/70">
                {n.texto}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
