import { Link } from 'react-router-dom'

export function Privacidad() {
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
            Política de Privacidad
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
              <h2 className="mb-1.5 font-semibold text-neutral-900">1. Quiénes somos</h2>
              <p>
                AgendaWA es un producto operado desde Colombia, dirigido a técnicos y
                negocios de servicios a domicilio para que gestionen citas, contactos
                y cobros. Si tienes dudas sobre esta política, puedes escribirnos al
                correo de soporte indicado en la aplicación.
              </p>
            </section>

            <section>
              <h2 className="mb-1.5 font-semibold text-neutral-900">2. Qué datos recogemos</h2>
              <p>Dependiendo de cómo uses AgendaWA, podemos tratar:</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>
                  Datos de tu cuenta: correo, nombre del negocio, y si usas Google
                  para iniciar sesión, tu nombre y foto de perfil de Google.
                </li>
                <li>
                  Datos que tú ingresas sobre tus propios clientes: nombre, teléfono,
                  servicio contratado, notas, citas y estado de pago.
                </li>
                <li>
                  Mensajes que intercambias con el asistente de IA dentro de la
                  plataforma, para poder responderte.
                </li>
                <li>
                  Datos técnicos básicos de uso de la plataforma, para poder operarla
                  y corregir errores.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="mb-1.5 font-semibold text-neutral-900">
                3. Para qué usamos estos datos
              </h2>
              <ul className="list-disc space-y-1 pl-5">
                <li>Darte acceso a tu cuenta y a tus propios datos de manera segura.</li>
                <li>Permitirte generar enlaces de WhatsApp y de cobro para tus clientes.</li>
                <li>Procesar pagos a través de nuestro proveedor de pagos (Wompi).</li>
                <li>Responder tus preguntas a través del asistente de IA dentro de la app.</li>
                <li>Mejorar la plataforma y corregir fallas.</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-1.5 font-semibold text-neutral-900">
                4. Con quién compartimos datos
              </h2>
              <p>
                No vendemos tus datos ni los de tus clientes. Los compartimos
                únicamente con los proveedores que hacen posible el servicio:
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>
                  <strong>Supabase</strong> — almacenamiento de la base de datos y
                  autenticación.
                </li>
                <li>
                  <strong>Google</strong> — si eliges iniciar sesión con tu cuenta de
                  Google.
                </li>
                <li>
                  <strong>Wompi</strong> — procesamiento de pagos y cobros.
                </li>
                <li>
                  <strong>Anthropic</strong> — procesamiento de tus mensajes cuando
                  usas el asistente de IA.
                </li>
                <li>
                  <strong>Hostinger</strong> — alojamiento técnico de la aplicación.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="mb-1.5 font-semibold text-neutral-900">5. Seguridad</h2>
              <p>
                Tus datos y los de tus clientes están protegidos con seguridad a
                nivel de fila: cada usuario solo puede ver y modificar su propia
                información, nunca la de otros negocios registrados en la
                plataforma.
              </p>
            </section>

            <section>
              <h2 className="mb-1.5 font-semibold text-neutral-900">6. Tus derechos</h2>
              <p>
                Como titular de tus datos, puedes solicitar en cualquier momento
                acceder, corregir o eliminar tu información y la de tu cuenta,
                escribiéndonos al correo de soporte. Esto aplica conforme a la Ley
                1581 de 2012 de Protección de Datos Personales de Colombia.
              </p>
            </section>

            <section>
              <h2 className="mb-1.5 font-semibold text-neutral-900">
                7. Cambios a esta política
              </h2>
              <p>
                Podemos actualizar esta política ocasionalmente. Si hacemos cambios
                importantes, lo indicaremos dentro de la plataforma.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
