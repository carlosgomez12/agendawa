import { Link } from 'react-router-dom'
import { Button } from '../ui/Button'
import { ArrowRight, Wrench } from 'lucide-react'

export function Hero() {
  return (
    <section
      id="inicio"
      className="relative overflow-hidden border-b border-cream/10 px-5 pt-14 pb-20 md:pt-20 md:pb-28"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            'radial-gradient(circle, #EDEAE2 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }}
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 md:grid-cols-[1.1fr_0.9fr]">
        <div className="animate-[fadeUp_0.7s_ease-out_both]">
          <p className="mb-5 font-mono text-xs font-semibold uppercase tracking-[0.25em] text-accent">
            CRM de WhatsApp para técnicos y negocios locales
          </p>
          <h1 className="font-display text-5xl font-black uppercase leading-[0.9] tracking-tight text-cream sm:text-6xl md:text-7xl">
            Que tu WhatsApp
            <br />
            trabaje <span className="text-accent">por ti.</span>
          </h1>
          <p className="mt-6 max-w-md text-lg text-cream/70">
            Agenda de citas, cobros y recordatorios automáticos para
            mecánicos, fontaneros, entrenadores y servicios de limpieza —
            sin salir del chat que tus clientes ya usan.
          </p>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link to="/registro">
              <Button variant="stamp" size="lg" className="w-full sm:w-auto">
                Probar 7 días gratis
                <ArrowRight size={18} strokeWidth={2.5} />
              </Button>
            </Link>
            <a href="#como-funciona">
              <Button variant="outline-dark" size="lg" className="w-full sm:w-auto">
                Ver cómo funciona
              </Button>
            </a>
          </div>
          <p className="mt-4 font-mono text-xs text-cream/40">
            Sin tarjeta de crédito · Cancela cuando quieras
          </p>
        </div>

        <div className="animate-[fadeUp_0.8s_ease-out_0.15s_both] md:justify-self-end">
          <div className="relative w-full max-w-sm rotate-2 rounded-sm bg-paper text-ink shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] transition-transform hover:rotate-0">
            <div className="perforated-top" />
            <div className="flex items-center justify-between px-6 pt-6">
              <span className="font-mono text-[11px] font-semibold tracking-widest text-ink/50">
                ORDEN DE SERVICIO
              </span>
              <span className="font-mono text-[11px] font-semibold text-ink/50">
                N.º 000128
              </span>
            </div>
            <div className="mx-6 my-4 border-t border-dashed border-ink/20" />
            <div className="space-y-3 px-6 pb-2 font-mono text-sm">
              <Row k="Cliente" v="Doña Marcela R." />
              <Row k="Servicio" v="Cambio de tubería" />
              <Row k="Fecha" v="Hoy · 3:00 p.m." />
              <Row k="Recordatorio" v="Enviado ✓" bold />
              <Row k="Anticipo" v="$40.000" bold />
            </div>
            <div className="mx-6 mt-4 border-t border-dashed border-ink/20" />
            <div className="flex items-center justify-between px-6 py-5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-whatsapp/15 px-3 py-1 font-mono text-[11px] font-semibold text-whatsapp">
                <Wrench size={12} /> EN SERVICIO
              </span>
              <span className="font-display text-lg font-bold tracking-wide">
                PAGADO
              </span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  )
}

function Row({ k, v, bold }: { k: string; v: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-ink/50">{k}</span>
      <span className={bold ? 'font-semibold' : ''}>{v}</span>
    </div>
  )
}
