import { Link } from 'react-router-dom'
import { Button } from '../ui/Button'

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-cream/10 bg-asphalt/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <a href="#inicio" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-sm bg-accent font-display text-lg font-black text-asphalt">
            A
          </span>
          <span className="font-display text-xl font-bold tracking-tight text-cream">
            Agenda<span className="text-accent">WA</span>
          </span>
        </a>
        <nav className="hidden items-center gap-8 font-medium text-sm text-cream/80 md:flex">
          <a href="#como-funciona" className="hover:text-cream transition-colors">
            Cómo funciona
          </a>
          <a href="#nichos" className="hover:text-cream transition-colors">
            Para tu oficio
          </a>
          <a href="#precios" className="hover:text-cream transition-colors">
            Precios
          </a>
          <a href="#faq" className="hover:text-cream transition-colors">
            Preguntas
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="hidden text-sm font-medium text-cream/80 hover:text-cream sm:block"
          >
            Iniciar sesión
          </Link>
          <Link to="/registro">
            <Button variant="stamp" size="md">
              Probar gratis
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
