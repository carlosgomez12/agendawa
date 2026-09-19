import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { MailCheck } from 'lucide-react'

export function ForgotPassword() {
  const { resetPasswordForEmail } = useAuth()
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [cargando, setCargando] = useState(false)
  const [enviado, setEnviado] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setCargando(true)
    const { error } = await resetPasswordForEmail(email)
    setCargando(false)
    if (error) {
      setError(error)
      return
    }
    setEnviado(true)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 p-6">
      <div className="w-full max-w-sm">
        <Link to="/" className="mb-8 inline-flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-sm bg-accent font-display text-lg font-black text-asphalt">
            A
          </span>
          <span className="font-display text-xl font-bold tracking-tight text-neutral-900">
            AgendaWA
          </span>
        </Link>

        {enviado ? (
          <div className="rounded-lg border border-neutral-200 bg-white p-6 text-center">
            <span className="mx-auto mb-3 grid h-10 w-10 place-items-center rounded-full bg-whatsapp/10 text-whatsapp">
              <MailCheck size={20} />
            </span>
            <h1 className="text-lg font-bold text-neutral-900">
              Revisa tu correo
            </h1>
            <p className="mt-2 text-sm text-neutral-500">
              Te enviamos un enlace a <strong>{email}</strong> para crear una
              nueva contraseña. Si no lo ves, revisa spam.
            </p>
            <Link
              to="/login"
              className="mt-5 inline-block text-sm font-medium text-accent-dark hover:underline"
            >
              Volver a iniciar sesión
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
              ¿Olvidaste tu contraseña?
            </h1>
            <p className="mt-1.5 text-sm text-neutral-500">
              Escribe tu correo y te mandamos un enlace para crear una nueva.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
              <Input
                id="email"
                type="email"
                label="Correo electrónico"
                placeholder="tucorreo@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              {error && (
                <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                variant="solid"
                size="lg"
                disabled={cargando}
                className="mt-1 justify-center"
              >
                {cargando ? 'Enviando…' : 'Enviar enlace de recuperación'}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-neutral-500">
              <Link to="/login" className="font-medium text-accent-dark hover:underline">
                Volver a iniciar sesión
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
