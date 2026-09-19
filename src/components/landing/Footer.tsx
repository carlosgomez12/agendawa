import { Link } from 'react-router-dom'
import { Button } from '../ui/Button'

export function Footer() {
  return (
    <footer className="px-5 py-20">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-display text-4xl font-black uppercase tracking-tight text-cream md:text-5xl">
          Tu próxima cita
          <br />
          empieza en <span className="text-accent">WhatsApp.</span>
        </h2>
        <p className="mx-auto mt-5 max-w-md text-cream/60">
          Prueba AgendaWA gratis durante 7 días. Sin tarjeta, sin instalar nada.
        </p>
        <Link to="/registro" className="mt-8 inline-block">
          <Button variant="stamp" size="lg">
            Probar 7 días gratis
          </Button>
        </Link>
      </div>

      <div className="mx-auto mt-20 flex max-w-6xl flex-col items-center justify-between gap-4 border-t border-cream/10 pt-8 text-xs text-cream/40 sm:flex-row">
        <span>© {new Date().getFullYear()} AgendaWA. Todos los derechos reservados.</span>
        <span className="font-mono">Hecho para técnicos que no tienen tiempo que perder.</span>
      </div>
    </footer>
  )
}
