import { useEffect, useRef, useState } from 'react'
import { tienda } from '../config/tienda'
import { useCarrito } from '../store/carrito'
import logoSvg from '../assets/marca/logo.svg?raw'
import { IcoBolsa } from './Iconos'

// Logotipo oficial (vectorizado del original). Si se configura tienda.logoUrl, se usa ese archivo.
export function Logo({ className = '', conLema = false }) {
  if (tienda.logoUrl) return <img src={tienda.logoUrl} alt={tienda.nombre} className={`logo-img ${className}`} />
  return (
    <span
      className={`logo ${conLema ? 'logo--lema' : ''} ${className}`}
      role="img"
      aria-label={tienda.nombre}
      dangerouslySetInnerHTML={{ __html: logoSvg }}
    />
  )
}

const ENLACES = [
  ['#tienda', 'Tienda'],
  ['#mayoreo', 'Mayoreo'],
  ['#donde', 'Dónde comprar'],
  ['#preguntas', 'Preguntas'],
]

export default function Nav() {
  const items = useCarrito((s) => s.items)
  const golpe = useCarrito((s) => s.golpe)
  const abrir = useCarrito((s) => s.abrir)
  const piezas = items.reduce((s, i) => s + i.qty, 0)
  const [scrolled, setScrolled] = useState(false)
  const [menu, setMenu] = useState(false)
  const clics = useRef({ n: 0, t: 0 })

  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 24)
    f()
    window.addEventListener('scroll', f, { passive: true })
    return () => window.removeEventListener('scroll', f)
  }, [])

  // Sorpresa: 5 clics seguidos al logo
  const clicLogo = () => {
    setMenu(false)
    const ahora = Date.now()
    const c = clics.current
    c.n = ahora - c.t < 600 ? c.n + 1 : 1
    c.t = ahora
    if (c.n >= 5) {
      c.n = 0
      window.dispatchEvent(new CustomEvent('dulchigoso:sorpresa', { detail: 'asomo' }))
    }
  }

  return (
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''} ${menu ? 'nav--abierto' : ''}`}>
      <a href="#inicio" className="nav__marca" onClick={clicLogo} aria-label="Dulchigoso, ir al inicio">
        <Logo />
      </a>
      <nav className="nav__links" aria-label="Principal">
        {ENLACES.map(([href, txt]) => (
          <a key={href} href={href} onClick={() => setMenu(false)}>
            {txt}
          </a>
        ))}
      </nav>
      <div className="nav__acciones">
        <button
          id="boton-carrito"
          type="button"
          className="nav__carrito"
          onClick={abrir}
          aria-label={`Abrir pedido, ${piezas} ${piezas === 1 ? 'pieza' : 'piezas'}`}
          key={golpe}
          data-golpe={golpe > 0 ? 'si' : 'no'}
        >
          <IcoBolsa />
          <span className="nav__carrito-txt">Pedido</span>
          <span className="nav__badge" data-vacio={piezas === 0}>
            {piezas}
          </span>
        </button>
        <button type="button" className="nav__hamburguesa" aria-expanded={menu} aria-label="Menú" onClick={() => setMenu((m) => !m)}>
          <span />
          <span />
        </button>
      </div>
    </header>
  )
}
