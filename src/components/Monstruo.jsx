import { useEffect, useRef } from 'react'
import monstruoSvg from '../assets/marca/monstruo.svg?raw'

// El monstruo oficial de Dulchigoso (vectorizado del logo original).
// mirar: el iris sigue al cursor.
export default function Monstruo({ mirar = false, className = '', titulo, ...resto }) {
  const caja = useRef(null)

  useEffect(() => {
    if (!mirar) return
    const iris = caja.current?.querySelector('.iris')
    if (!iris) return
    let raf = 0
    const mover = (e) => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const r = caja.current.getBoundingClientRect()
        // centro del ojo en el dibujo (≈ 52% ancho, 35% alto)
        const ox = r.left + r.width * 0.52
        const oy = r.top + r.height * 0.36
        const dx = e.clientX - ox
        const dy = e.clientY - oy
        const d = Math.hypot(dx, dy) || 1
        const k = Math.min(1, d / 300)
        // unidades del viewBox: el ojo mide ~430, el iris ~230
        iris.style.transform = `translate(${(dx / d) * 70 * k}px, ${(dy / d) * 70 * k}px)`
      })
    }
    window.addEventListener('pointermove', mover, { passive: true })
    return () => {
      window.removeEventListener('pointermove', mover)
      cancelAnimationFrame(raf)
    }
  }, [mirar])

  return (
    <span
      ref={caja}
      className={`monstruo ${className}`}
      role={titulo ? 'img' : undefined}
      aria-label={titulo}
      aria-hidden={titulo ? undefined : true}
      dangerouslySetInnerHTML={{ __html: monstruoSvg }}
      {...resto}
    />
  )
}

// Solo el ojo (como en la bolsa). Sigue al cursor y parpadea. Clic = guiño.
export function Ojo({ className = '', color = '#E2412B' }) {
  const iris = useRef(null)
  const caja = useRef(null)
  useEffect(() => {
    let raf = 0
    const mover = (e) => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const el = caja.current
        if (!el || !iris.current) return
        const r = el.getBoundingClientRect()
        const dx = e.clientX - (r.left + r.width / 2)
        const dy = e.clientY - (r.top + r.height / 2)
        const d = Math.hypot(dx, dy) || 1
        const k = Math.min(1, d / 420)
        const m = r.width * 0.2
        iris.current.style.transform = `translate(${(dx / d) * m * k}px, ${(dy / d) * m * k}px)`
      })
    }
    window.addEventListener('pointermove', mover, { passive: true })
    return () => {
      window.removeEventListener('pointermove', mover)
      cancelAnimationFrame(raf)
    }
  }, [])
  const guino = (e) => {
    const el = e.currentTarget
    el.classList.remove('ojo--guino')
    void el.getBoundingClientRect()
    el.classList.add('ojo--guino')
  }
  return (
    <span ref={caja} className={`ojo ${className}`} onClick={guino} aria-hidden="true">
      <span ref={iris} className="ojo__iris" style={{ background: color }}>
        <span className="ojo__brillo" />
      </span>
      <span className="ojo__parpado" />
    </span>
  )
}
