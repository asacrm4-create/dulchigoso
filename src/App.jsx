import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Tienda from './components/Tienda'
import Carrito from './components/Carrito'
import { Cinta } from './components/Adornos'
import { HechasAMano, Mayoreo, DondeComprar, Preguntas, Pie } from './components/Secciones'
import Sorpresas from './components/Sorpresas'

gsap.registerPlugin(ScrollTrigger)

function useScrollSuave() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({ lerp: 0.11, anchors: { offset: -70 } })
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (t) => lenis.raf(t * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    window.__lenis = lenis
    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
    }
  }, [])
}

export default function App() {
  useScrollSuave()
  return (
    <>
      <a href="#tienda" className="saltar">Ir a la tienda</a>
      <Nav />
      <main>
        <Hero />
        <Cinta />
        <Tienda />
        <HechasAMano />
        <Mayoreo />
        <DondeComprar />
        <Preguntas />
      </main>
      <Pie />
      <Carrito />
      <Sorpresas />
    </>
  )
}
