import { useEffect, useRef, useState } from 'react'
import { tienda } from '../config/tienda'
import { useCarrito } from '../store/carrito'
import Monstruo from './Monstruo'
import LluviaGomitas from './hero/LluviaGomitas'
import { IcoFlecha } from './Iconos'
import nombreSvg from '../assets/marca/nombre.svg?raw'

// Inicio: el logo oficial en grande, el monstruo oficial y una lluvia de gomitas
// planas (mismo estilo del logo) que caen, se apilan y rebotan en el monstruo.
export default function Hero() {
  const escena = useRef(null)
  const monstruo = useRef(null)
  const [movimiento, setMovimiento] = useState(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [extra, setExtra] = useState(0)
  const [brinco, setBrinco] = useState(0)
  const setModo = useCarrito((s) => s.setModo)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const f = () => setMovimiento(!mq.matches)
    mq.addEventListener('change', f)
    return () => mq.removeEventListener('change', f)
  }, [])

  const pedirMas = () => {
    setBrinco((b) => b + 1)
    setExtra((e) => (e >= 3 ? e : e + 1))
  }

  return (
    <section className="hero" id="inicio" aria-labelledby="hero-titulo" ref={escena}>
      <div className="hero__grid">
        <div className="hero__texto">
          <h1 id="hero-titulo" className="hero__logo">
            <span className="sr-only">Dulchigoso, picositos y aciditos</span>
            <span className="hero__nombre" aria-hidden="true" dangerouslySetInnerHTML={{ __html: nombreSvg }} />
          </h1>
          <p className="hero__sub">
            Gomitas cubiertas con chamoy, enchiladas y empacadas a mano en {tienda.ciudad}. Por pieza, o por mayoreo para tu negocio.
          </p>
          <div className="hero__ctas">
            <a href="#tienda" className="btn btn--primario" onClick={() => setModo('menudeo')}>
              Comprar ahora <IcoFlecha />
            </a>
            <a href="#tienda" className="btn btn--tinta-contorno" onClick={() => setModo('mayoreo')}>
              Precios de mayoreo
            </a>
          </div>
        </div>
        <button
          type="button"
          ref={monstruo}
          key={brinco}
          className={`hero__monstruo ${brinco ? 'brinca' : ''}`}
          onClick={pedirMas}
          aria-label="Pedirle más gomitas al monstruo"
        >
          <Monstruo mirar />
        </button>
      </div>
      {movimiento && <LluviaGomitas contenedor={escena} monstruo={monstruo} extra={extra} />}
      {movimiento && <p className="hero__pista">Arrastra las gomitas · toca al monstruo</p>}
    </section>
  )
}
