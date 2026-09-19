import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'

export function Login() {
  const { signIn, signInWithGoogle } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [cargando, setCargando] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setCargando(true)
    const { error } = await signIn(email, password)
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

        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
          Bienvenido de nuevo
        </h1>
        <p className="mt-1.5 text-sm text-neutral-500">
          Ingresa a tu panel para ver las citas de hoy.
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
            id="email"
            type="email"
            label="Correo electrónico"
            placeholder="tucorreo@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div>
            <Input
              id="password"
              type="password"
              label="Contraseña"
              placeholder="Tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Link
              to="/olvide-contrasena"
              className="mt-1.5 inline-block text-xs font-medium text-neutral-500 hover:text-accent-dark hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

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
            {cargando ? 'Ingresando…' : 'Iniciar sesión'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-neutral-500">
          ¿No tienes cuenta?{' '}
          <Link to="/registro" className="font-medium text-accent-dark hover:underline">
            Prueba 7 días gratis
          </Link>
        </p>
      </div>
    </div>
  )
}
