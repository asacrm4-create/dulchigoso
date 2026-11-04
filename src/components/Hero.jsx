import { useCallback, useEffect, useRef, useState } from 'react'
import { tienda } from '../config/tienda'
import { useCarrito } from '../store/carrito'
import Monstruo from './Monstruo'
import LluviaGomitas from './hero/LluviaGomitas'
import { IcoFlecha } from './Iconos'
import nombreSvg from '../assets/marca/nombre.svg?raw'

const FRASES = ['¡Ñam!', '¡Pica rico!', '¡Otra!', '¡Qué acidita!', '¡Mmm, chamoy!', '¡Más, más!', '¡Picosita!']
const HITOS = { 5: '¡Cinco! Ya agarré sabor.', 10: '¡Diez! Soy un dulchigoso feliz.', 20: '¡Veinte! Me voy a reventar.', 30: 'Treinta… ya estuvo. Bueno, una más.' }

// Inicio: el logo oficial en grande, el monstruo oficial vivo y una lluvia de gomitas
// con física. Las gomitas se arrastran, se avientan y se le dan de comer al monstruo.
export default function Hero() {
  const escena = useRef(null)
  const monstruo = useRef(null)
  const [movimiento, setMovimiento] = useState(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [extra, setExtra] = useState(0)
  const [brinco, setBrinco] = useState(0)
  const [hambre, setHambre] = useState(false)
  const [come, setCome] = useState(0)
  const [golpe, setGolpe] = useState(0)
  const [comidas, setComidas] = useState(0)
  const [burbuja, setBurbuja] = useState(null)
  const setModo = useCarrito((s) => s.setModo)
  const timers = useRef({})

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const f = () => setMovimiento(!mq.matches)
    mq.addEventListener('change', f)
    return () => mq.removeEventListener('change', f)
  }, [])

  // El monstruo se inclina un poco hacia el cursor
  useEffect(() => {
    if (!movimiento || !window.matchMedia('(hover: hover)').matches) return
    let raf = 0
    const mover = (e) => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const el = monstruo.current
        if (!el) return
        const r = el.getBoundingClientRect()
        const k = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (window.innerWidth / 2)))
        el.style.setProperty('--inclina', `${(k * 2.2).toFixed(2)}deg`)
      })
    }
    window.addEventListener('pointermove', mover, { passive: true })
    return () => {
      window.removeEventListener('pointermove', mover)
      cancelAnimationFrame(raf)
    }
  }, [movimiento])

  useEffect(() => {
    const t = timers.current
    return () => Object.values(t).forEach(clearTimeout)
  }, [])

  const pedirMas = () => {
    setBrinco((b) => b + 1)
    setExtra((e) => e + 1)
  }

  const onComer = useCallback(() => {
    setComidas((n) => {
      const total = n + 1
      setBurbuja({ id: total, txt: HITOS[total] || FRASES[total % FRASES.length] })
      clearTimeout(timers.current.burbuja)
      timers.current.burbuja = setTimeout(() => setBurbuja(null), HITOS[total] ? 2600 : 1300)
      return total
    })
    setCome((c) => c + 1)
    clearTimeout(timers.current.come)
    timers.current.come = setTimeout(() => setCome(0), 700)
  }, [])

  const onGolpe = useCallback(() => {
    setGolpe((g) => g + 1)
    clearTimeout(timers.current.golpe)
    timers.current.golpe = setTimeout(() => setGolpe(0), 380)
  }, [])

  const tactil = !window.matchMedia('(hover: hover)').matches
  const pista = comidas === 0 ? (tactil ? 'Toca una gomita para dársela al monstruo' : 'Arrástrale una gomita a la boca · toca al monstruo para más') : `${comidas} ${comidas === 1 ? 'gomita comida' : 'gomitas comidas'}`

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
          <Monstruo mirar className={`monstruo--vivo ${hambre ? 'monstruo--hambre' : ''} ${come ? 'monstruo--come' : ''} ${golpe ? 'monstruo--golpe' : ''}`} />
          {burbuja && (
            <span key={burbuja.id} className="hero__burbuja" aria-live="polite">
              {burbuja.txt}
            </span>
          )}
        </button>
        {movimiento && <p className="hero__pista">{pista}</p>}
      </div>
      {movimiento && <LluviaGomitas contenedor={escena} monstruo={monstruo} extra={extra} onComer={onComer} onHambre={setHambre} onGolpe={onGolpe} />}
    </section>
  )
}
