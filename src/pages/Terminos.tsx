import { Link } from 'react-router-dom'

export function Terminos() {
  return (
    <div className="min-h-screen bg-neutral-50 px-5 py-12">
      <div className="mx-auto max-w-2xl">
        <Link to="/" className="mb-8 inline-flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-sm bg-accent font-display text-lg font-black text-asphalt">
            A
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-neutral-900">
            AgendaWA
          </span>
        </Link>

        <div className="rounded-lg border border-neutral-200 bg-white p-6 sm:p-8">
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            Condiciones del Servicio
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Última actualización:{' '}
            {new Date().toLocaleDateString('es-CO', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>

          <div className="mt-6 flex flex-col gap-5 text-sm leading-relaxed text-neutral-700">
            <section>
              <h2 className="mb-1.5 font-semibold text-neutral-900">1. Aceptación</h2>
              <p>
                Al registrarte y usar AgendaWA aceptas estas condiciones. Si no
                estás de acuerdo, por favor no uses la plataforma.
              </p>
            </section>

            <section>
              <h2 className="mb-1.5 font-semibold text-neutral-900">2. Qué es AgendaWA</h2>
              <p>
                AgendaWA es una herramienta de agenda, gestión de contactos y
                cobros pensada para técnicos y negocios de servicios a domicilio.
                Algunas funciones dependen de un toque manual tuyo para enviarse
                (por ejemplo, los mensajes de WhatsApp) — no es un sistema de
                envío 100% automático sin tu intervención.
              </p>
            </section>

            <section>
              <h2 className="mb-1.5 font-semibold text-neutral-900">3. Planes y pagos</h2>
              <ul className="list-disc space-y-1 pl-5">
                <li>
                  El plan Free incluye una prueba con acceso limitado a
                  contactos.
                </li>
                <li>
                  El plan Pro tiene un costo mensual, cobrado a través de Wompi.
                </li>
                <li>
                  Los cobros que generas hacia tus propios clientes (por tus
                  servicios) se procesan también a través de Wompi; AgendaWA no
                  retiene ni administra ese dinero, solo genera el enlace de
                  cobro.
                </li>
                <li>
                  Eres responsable de la relación comercial, precios y calidad de
                  los servicios que ofreces a tus propios clientes.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="mb-1.5 font-semibold text-neutral-900">
                4. Tu responsabilidad sobre los datos de tus clientes
              </h2>
              <p>
                Los contactos, citas y datos que registras en AgendaWA pertenecen
                a tu operación. Eres responsable de contar con el consentimiento
                adecuado de tus propios clientes para almacenar y contactarlos
                con esa información.
              </p>
            </section>

            <section>
              <h2 className="mb-1.5 font-semibold text-neutral-900">5. Uso del asistente de IA</h2>
              <p>
                El asistente dentro de la plataforma puede consultar tu
                información y ayudarte a redactar mensajes. No toma acciones ni
                modifica tus datos por sí solo. Las respuestas son generadas
                automáticamente y pueden contener errores — revísalas antes de
                usarlas.
              </p>
            </section>

            <section>
              <h2 className="mb-1.5 font-semibold text-neutral-900">6. Disponibilidad</h2>
              <p>
                Hacemos lo posible por mantener la plataforma disponible, pero no
                garantizamos un servicio ininterrumpido. Algunas funciones dependen
                de proveedores externos (WhatsApp, Google, Wompi) fuera de nuestro
                control directo.
              </p>
            </section>

            <section>
              <h2 className="mb-1.5 font-semibold text-neutral-900">7. Cancelación</h2>
              <p>
                Puedes dejar de usar AgendaWA cuando quieras. Para cancelar tu
                suscripción Pro, escríbenos al correo de soporte.
              </p>
            </section>

            <section>
              <h2 className="mb-1.5 font-semibold text-neutral-900">8. Cambios a estas condiciones</h2>
              <p>
                Podemos actualizar estas condiciones ocasionalmente. Si hacemos
                cambios importantes, lo indicaremos dentro de la plataforma.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
