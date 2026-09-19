import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'

export function ResetPassword() {
  const { user, loading, updatePassword } = useAuth()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmacion, setConfirmacion] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [cargando, setCargando] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    if (password !== confirmacion) {
      setError('Las contraseñas no coinciden.')
      return
    }

    setCargando(true)
    const { error } = await updatePassword(password)
    setCargando(false)
    if (error) {
      setError(error)
      return
    }
    navigate('/dashboard')
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

        {loading ? (
          <p className="text-sm text-neutral-400">Verificando enlace…</p>
        ) : !user ? (
          <div className="rounded-lg border border-neutral-200 bg-white p-6">
            <h1 className="text-lg font-bold text-neutral-900">
              Este enlace ya no es válido
            </h1>
            <p className="mt-2 text-sm text-neutral-500">
              Puede haber expirado o ya haberse usado. Pide uno nuevo.
            </p>
            <Link
              to="/olvide-contrasena"
              className="mt-4 inline-block text-sm font-medium text-accent-dark hover:underline"
            >
              Solicitar nuevo enlace
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
              Crea tu nueva contraseña
            </h1>
            <p className="mt-1.5 text-sm text-neutral-500">
              Elige una contraseña que no hayas usado antes.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
              <Input
                id="password"
                type="password"
                label="Nueva contraseña"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required
              />
              <Input
                id="confirmacion"
                type="password"
                label="Confirma la contraseña"
                placeholder="Repite la contraseña"
                value={confirmacion}
                onChange={(e) => setConfirmacion(e.target.value)}
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
                {cargando ? 'Guardando…' : 'Guardar nueva contraseña'}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
