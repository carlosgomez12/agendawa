import { Nav } from '../components/landing/Nav'
import { Hero } from '../components/landing/Hero'
import { ComoFunciona } from '../components/landing/ComoFunciona'
import { CasosDeUso } from '../components/landing/CasosDeUso'
import { Precios } from '../components/landing/Precios'
import { FAQ } from '../components/landing/FAQ'
import { Footer } from '../components/landing/Footer'

export function Landing() {
  return (
    <div className="min-h-screen bg-asphalt">
      <Nav />
      <main>
        <Hero />
        <ComoFunciona />
        <CasosDeUso />
        <Precios />
        <FAQ />
      </main>
      <Footer />
    </div>
  )
}
