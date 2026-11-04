import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { tienda } from '../config/tienda'
import { useCarrito } from '../store/carrito'
import Bolsa from './Bolsa'
import { Ojo } from './Monstruo'
import { IcoFlecha } from './Iconos'

const EscenaGomitas = lazy(() => import('./hero/EscenaGomitas'))

function soportaWebGL() {
  try {
    const c = document.createElement('canvas')
    return !!(window.WebGL2RenderingContext && c.getContext('webgl2'))
  } catch {
    return false
  }
}

// El inicio ES la bolsa de Dulchigoso: franja crema con el nombre arriba,
// la cara del monstruo abajo y, en la ventana, las gomitas de verdad (3D con física).
export default function Hero() {
  const ventana = useRef(null)
  const [modo3d, setModo3d] = useState(null)
  const [visible, setVisible] = useState(true)
  const [lluvia, setLluvia] = useState(0)
  const setModo = useCarrito((s) => s.setModo)

  useEffect(() => {
    const reducir = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setModo3d(!reducir && soportaWebGL())
    const sorpresa = (e) => e.detail === 'lluvia' && setLluvia((n) => Math.min(n + 1, 3))
    window.addEventListener('dulchigoso:sorpresa', sorpresa)
    return () => window.removeEventListener('dulchigoso:sorpresa', sorpresa)
  }, [])

  useEffect(() => {
    const el = ventana.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.01 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section className="hero" id="inicio" aria-labelledby="hero-titulo">
      <div className="bolsa-hero">
        <div className="bolsa-hero__cierre" aria-hidden="true" />
        <div className="bolsa-hero__arriba">
          <h1 id="hero-titulo" className="hero__titulo">
            Picositos y aciditos.
          </h1>
          <div className="hero__fila">
            <p className="hero__sub">
              Gomitas cubiertas con chamoy, enchiladas y empacadas a mano en {tienda.ciudad}. Por pieza o por mayoreo para tu negocio.
            </p>
            <div className="hero__ctas">
              <a href="#tienda" className="btn btn--primario" onClick={() => setModo('menudeo')}>
                Comprar ahora <IcoFlecha />
              </a>
              <a href="#tienda" className="btn btn--contorno" onClick={() => setModo('mayoreo')}>
                Precios de mayoreo
              </a>
            </div>
          </div>
        </div>

        <div className="cara">
          <span className="cara__cuerno cara__cuerno--izq" aria-hidden="true" />
          <span className="cara__cuerno cara__cuerno--der" aria-hidden="true" />
          <Ojo className="cara__ojo" />
          <div className="cara__ventana" ref={ventana}>
            {modo3d && (
              <Suspense fallback={null}>
                <EscenaGomitas activo={visible} eventSource={ventana} lluvia={lluvia} />
              </Suspense>
            )}
            {modo3d === false && (
              <div className="cara__estatico" aria-hidden="true">
                {['ositos', 'lombrices', 'manguitos'].map((n) => (
                  <Bolsa key={n} nombre={n} forma={n === 'ositos' ? 'osito' : n === 'lombrices' ? 'lombriz' : 'manguito'} colores={['#E2412B', '#F08A24']} />
                ))}
              </div>
            )}
            <span className="cara__plastico" aria-hidden="true" />
          </div>
          <div className="cara__pie" aria-hidden="true">
            <span>Gomitas cubiertas con chamoy</span>
            <span>Hecho a mano</span>
          </div>
        </div>
      </div>
      {modo3d && <p className="hero__pista">Mueve el cursor sobre la ventana · toca una gomita</p>}
    </section>
  )
}
