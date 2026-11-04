import { useEffect, useRef } from 'react'
import monstruoSvg from '../assets/marca/monstruo.svg?raw'

// El monstruo oficial de Dulchigoso, dibujado en vector limpio a partir del logo original.
// Coordenadas del viewBox: 4 36 160 174. El ojo está centrado en (89,117).
const OJO = { x: (89 - 4) / 160, y: (117 - 36) / 174 }

// Cuernos (mismos trazos que el monstruo) para reutilizarlos en la bolsa.
export const CuernoIzq = (p) => <path d="M 46 52 C 26 50, 10 62, 7 80 C 4 94, 12 106, 32 106 C 36 100, 34 88, 36 76 C 38 66, 42 58, 46 52 Z" {...p} />
export const CuernoDer = (p) => <path d="M 118 49 C 132 44, 150 47, 154 58 C 157 67, 150 75, 136 76 C 138 68, 133 60, 126 56 C 123 54, 120 51, 118 49 Z" {...p} />

// mirar: el iris sigue al cursor. parpadea: cierra el ojo de vez en cuando.
export default function Monstruo({ mirar = false, parpadea = true, className = '', titulo, ...resto }) {
  const caja = useRef(null)

  useEffect(() => {
    if (!mirar) return
    const iris = caja.current?.querySelector('.iris')
    if (!iris) return
    let raf = 0
    const mover = (e) => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        if (!caja.current) return
        const r = caja.current.getBoundingClientRect()
        const ox = r.left + r.width * OJO.x
        const oy = r.top + r.height * OJO.y
        const dx = e.clientX - ox
        const dy = e.clientY - oy
        const d = Math.hypot(dx, dy) || 1
        const k = Math.min(1, d / 320)
        // unidades del viewBox: la esclera mide r=26 y el iris r=15.5
        iris.style.transform = `translate(${((dx / d) * 8.5 * k).toFixed(2)}px, ${((dy / d) * 8.5 * k).toFixed(2)}px)`
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
      className={`monstruo ${parpadea ? 'monstruo--parpadea' : ''} ${className}`}
      role={titulo ? 'img' : undefined}
      aria-label={titulo}
      aria-hidden={titulo ? undefined : true}
      dangerouslySetInnerHTML={{ __html: monstruoSvg }}
      {...resto}
    />
  )
}
