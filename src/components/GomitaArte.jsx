import { useId } from 'react'

// Ilustraciones SVG de cada forma (se usan mientras no haya foto real).
// Cada forma se dibuja dos veces: con sus colores y luego con la "capa de chile" encima.
const FORMAS = {
  osito: (a) => (
    <g fill={a}>
      <circle cx="100" cy="62" r="34" />
      <circle cx="72" cy="34" r="14" />
      <circle cx="128" cy="34" r="14" />
      <ellipse cx="100" cy="122" rx="44" ry="48" />
      <circle cx="58" cy="104" r="16" />
      <circle cx="142" cy="104" r="16" />
      <circle cx="74" cy="166" r="19" />
      <circle cx="126" cy="166" r="19" />
    </g>
  ),
  lombriz: (a, b) => (
    <g fill="none" strokeWidth="30" strokeLinecap="round">
      <path d="M30 140 C 50 80, 85 80, 100 110" stroke={a} />
      <path d="M100 110 C 115 140, 150 140, 170 60" stroke={b} />
    </g>
  ),
  aro: (a, b) => (
    <g fill="none">
      <circle cx="100" cy="108" r="54" stroke={b} strokeWidth="30" />
      <circle cx="100" cy="96" r="54" stroke={a} strokeWidth="32" />
    </g>
  ),
  frutita: (a, b) => (
    <g>
      <path d="M100 48 C 150 48, 168 88, 154 122 C 140 156, 112 178, 100 178 C 88 178, 60 156, 46 122 C 32 88, 50 48, 100 48 Z" fill={a} />
      <path d="M100 52 C 86 30, 64 30, 58 40 C 76 44, 86 50, 100 56 C 114 50, 124 44, 142 40 C 136 30, 114 30, 100 52 Z" fill={b} />
    </g>
  ),
  manguito: (a) => (
    <path d="M30 118 C 30 70, 80 46, 124 56 C 160 64, 176 92, 168 118 C 160 146, 120 150, 100 140 C 76 128, 54 150, 30 118 Z" fill={a} />
  ),
  sandia: (a, b) => (
    <g>
      <path d="M24 70 A 76 76 0 0 0 176 70 Z" fill={b} transform="translate(0 20)" />
      <path d="M38 70 A 62 62 0 0 0 162 70 Z" fill={a} transform="translate(0 20)" />
    </g>
  ),
  cherry: (a, b) => (
    <g>
      <path d="M68 128 C 70 90, 96 50, 112 34 M132 124 C 128 90, 116 54, 112 34" stroke={b} strokeWidth="9" fill="none" strokeLinecap="round" />
      <path d="M112 34 C 130 22, 156 26, 166 40 C 146 46, 128 44, 112 34 Z" fill={b} />
      <circle cx="66" cy="138" r="34" fill={a} />
      <circle cx="134" cy="134" r="34" fill={a} />
    </g>
  ),
  llave: (a, b) => (
    <g>
      <circle cx="62" cy="100" r="38" fill="none" stroke={a} strokeWidth="24" />
      <rect x="92" y="88" width="88" height="24" rx="12" fill={a} />
      <rect x="146" y="104" width="16" height="30" rx="7" fill={a} />
      <rect x="120" y="104" width="14" height="22" rx="7" fill={a} />
      <rect x="96" y="96" width="78" height="8" rx="4" fill={b} />
    </g>
  ),
  tiburon: (a, b) => (
    <g>
      <path d="M22 106 C 40 74, 96 60, 140 74 L 150 44 L 160 84 C 170 88, 178 92, 186 100 L 172 104 L 186 124 C 166 118, 156 116, 140 124 C 96 142, 40 136, 22 106 Z" fill={a} />
      <path d="M30 110 C 60 122, 110 126, 148 116 C 120 136, 60 138, 30 110 Z" fill={b} />
    </g>
  ),
  tira: (a, b) => (
    <g>
      <path d="M20 120 C 60 60, 100 160, 140 90 C 156 64, 172 60, 184 64 L 190 92 C 176 90, 166 96, 156 112 C 116 182, 72 82, 34 146 Z" fill={a} />
      <path d="M24 126 C 62 72, 100 168, 142 96 C 158 70, 172 70, 186 74" stroke={b} strokeWidth="6" fill="none" strokeLinecap="round" />
    </g>
  ),
}

// Puntos de chile con distribución pseudoaleatoria fija (igual en cada render)
function azar(semilla) {
  let t = semilla
  return () => {
    t = (t + 0x6d2b79f5) | 0
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}
const _r = azar(7)
// Hojuelas de chamoy/chile: formas planas irregulares, pocas y deliberadas (estilo del logo)
const HOJUELAS = Array.from({ length: 16 }, () => {
  const x = _r() * 80
  const y = _r() * 80
  const t = 1.6 + _r() * 1.8
  const rot = _r() * 180
  return { x, y, t, rot, c: _r() < 0.6 ? '#B3364E' : '#8E2639' }
})

// Oscurece un color hex (para la cara inferior plana)
function sombra(hex, k = 0.78) {
  const n = parseInt(hex.replace('#', ''), 16)
  const r = Math.round(((n >> 16) & 255) * k)
  const g = Math.round(((n >> 8) & 255) * k)
  const b = Math.round((n & 255) * k)
  return `rgb(${r},${g},${b})`
}

export default function GomitaArte({ forma = 'osito', colores = ['#FF8A1F', '#E8243B'], className, titulo, ...resto }) {
  const uid = useId().replace(/:/g, '')
  const dibujar = FORMAS[forma] || FORMAS.osito
  const [a, b = a] = colores
  const pat = `url(#chamoy-${uid})`
  return (
    <svg viewBox="0 0 200 200" className={className} role={titulo ? 'img' : undefined} aria-label={titulo} aria-hidden={titulo ? undefined : true} {...resto}>
      <defs>
        <pattern id={`chamoy-${uid}`} width="80" height="80" patternUnits="userSpaceOnUse">
          {HOJUELAS.map((h, i) => (
            <rect key={i} x={h.x} y={h.y} width={h.t * 1.6} height={h.t} rx={h.t / 3} fill={h.c} transform={`rotate(${h.rot} ${h.x} ${h.y})`} />
          ))}
        </pattern>
      </defs>
      {/* volumen plano: la misma forma, más oscura y desplazada */}
      <g transform="translate(0 7)">{dibujar(sombra(a), sombra(b))}</g>
      {dibujar(a, b)}
      <g>{dibujar(pat, pat)}</g>
    </svg>
  )
}
