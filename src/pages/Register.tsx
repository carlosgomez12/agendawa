import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'

export function Register() {
  const { signUp, signInWithGoogle } = useAuth()
  const navigate = useNavigate()
  const [nombreNegocio, setNombreNegocio] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [cargando, setCargando] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setCargando(true)
    const { error } = await signUp(email, password, nombreNegocio)
    setCargando(false)
    if (error) {
      setError(error)
      return
    }
    navigate('/dashboard')
  }

  async function handleGoogle() {
    setError(null)
    const { error } = await signInWithGoogle()
    if (error) setError(error)
  }

  return (
    <div className="grid min-h-screen md:grid-cols-2">
      <div className="hidden flex-col justify-between bg-asphalt p-10 text-cream md:flex">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-sm bg-accent font-display text-lg font-black text-asphalt">
            A
          </span>
          <span className="font-display text-xl font-bold tracking-tight">
            Agenda<span className="text-accent">WA</span>
          </span>
        </Link>
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-accent">
            Paso 1 de 2
          </p>
          <h2 className="mt-3 font-display text-3xl font-black uppercase leading-tight tracking-tight">
            Crea tu cuenta.
            <br />
            Envía tu primer
            <br />
            mensaje en el
            <br />
            siguiente paso.
          </h2>
        </div>
        <p className="font-mono text-xs text-cream/40">
          7 días gratis · hasta 10 contactos
        </p>
      </div>

      <div className="flex items-center justify-center bg-neutral-50 p-6">
        <div className="w-full max-w-sm">
          <div className="mb-8 md:hidden">
            <Link to="/" className="inline-flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-sm bg-accent font-display text-lg font-black text-asphalt">
                A
              </span>
              <span className="font-display text-xl font-bold tracking-tight text-neutral-900">
                AgendaWA
              </span>
            </Link>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            Crea tu cuenta gratis
          </h1>
          <p className="mt-1.5 text-sm text-neutral-500">
            En un minuto tendrás tu agenda lista para conectar con WhatsApp.
          </p>

          <button
            onClick={handleGoogle}
            type="button"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-md border border-neutral-200 bg-white py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
          >
            Continuar con Google
          </button>

          <div className="my-5 flex items-center gap-3 text-xs text-neutral-400">
            <div className="h-px flex-1 bg-neutral-200" />
            o con tu correo
            <div className="h-px flex-1 bg-neutral-200" />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              id="nombreNegocio"
              label="Nombre de tu negocio"
              placeholder="Ej. Fontanería Rodríguez"
              value={nombreNegocio}
              onChange={(e) => setNombreNegocio(e.target.value)}
              required
            />
            <Input
              id="email"
              type="email"
              label="Correo electrónico"
              placeholder="tucorreo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              id="password"
              type="password"
              label="Contraseña"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
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
              {cargando ? 'Creando cuenta…' : 'Crear cuenta y continuar'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-neutral-500">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="font-medium text-accent-dark hover:underline">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
