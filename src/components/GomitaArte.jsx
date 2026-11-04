import { useId } from 'react'

// Ilustraciones planas de cada gomita, en el estilo del logo: formas limpias, dos tonos,
// un "lado" más oscuro para el volumen, un brillo de azúcar y unas cuantas hojuelas de chile.
// Se usan mientras no haya foto real del producto (campo `foto` en productos.js).

function oscurecer(hex, k = 0.8) {
  const n = parseInt(hex.replace('#', ''), 16)
  const r = Math.round(((n >> 16) & 255) * k)
  const g = Math.round(((n >> 8) & 255) * k)
  const b = Math.round((n & 255) * k)
  return `rgb(${r},${g},${b})`
}

const FORMAS = {
  osito: (a, b) => (
    <g>
      <g fill={a}>
        <circle cx="74" cy="42" r="15" />
        <circle cx="126" cy="42" r="15" />
        <circle cx="100" cy="62" r="33" />
        <path d="M62 86 h76 c10 0 16 8 15 18 l-6 48 c-1 10 -8 16 -18 16 h-58 c-10 0 -17 -6 -18 -16 l-6 -48 c-1 -10 5 -18 15 -18z" />
        <ellipse cx="54" cy="108" rx="13" ry="22" transform="rotate(18 54 108)" />
        <ellipse cx="146" cy="108" rx="13" ry="22" transform="rotate(-18 146 108)" />
        <ellipse cx="76" cy="166" rx="17" ry="19" />
        <ellipse cx="124" cy="166" rx="17" ry="19" />
      </g>
      <g fill={oscurecer(b, 0.72)} opacity=".35">
        <circle cx="90" cy="56" r="3" />
        <circle cx="110" cy="56" r="3" />
        <ellipse cx="100" cy="70" rx="9" ry="6" />
      </g>
    </g>
  ),
  lombriz: (a, b) => (
    <g fill="none" strokeWidth="32" strokeLinecap="round">
      <path d="M28 128 C 44 72, 86 70, 100 108" stroke={a} />
      <path d="M100 108 C 114 146, 150 146, 172 72" stroke={b} />
      <g stroke={oscurecer(a, 0.85)} strokeWidth="3" opacity=".45">
        <path d="M44 100 l20 10 M60 84 l18 12 M80 78 l12 16" />
      </g>
      <g stroke={oscurecer(b, 0.85)} strokeWidth="3" opacity=".45">
        <path d="M118 132 l10 -18 M138 134 l10 -20 M156 118 l10 -18" />
      </g>
    </g>
  ),
  aro: (a, b) => (
    <g fill="none">
      <circle cx="100" cy="100" r="60" stroke={a} strokeWidth="26" />
      <circle cx="100" cy="100" r="41" stroke={b} strokeWidth="14" />
    </g>
  ),
  frutita: (a, b) => (
    <g>
      <path d="M100 58 C 146 58, 166 94, 154 126 C 142 160, 114 180, 100 180 C 86 180, 58 160, 46 126 C 34 94, 54 58, 100 58 Z" fill={a} />
      <path d="M100 62 C 90 44, 70 40, 60 48 C 76 52, 88 58, 100 66 C 112 58, 124 52, 140 48 C 130 40, 110 44, 100 62 Z" fill={b} />
      <path d="M100 42 v18" stroke={oscurecer(b, 0.7)} strokeWidth="5" strokeLinecap="round" />
    </g>
  ),
  manguito: (a, b) => (
    <g>
      <path d="M34 112 C 30 70, 70 42, 118 50 C 160 56, 180 90, 170 122 C 160 154, 118 160, 96 148 C 72 134, 44 148, 34 112 Z" fill={a} />
      <path d="M52 90 C 60 70, 84 56, 112 58" stroke={b} strokeWidth="9" fill="none" strokeLinecap="round" opacity=".7" />
    </g>
  ),
  sandia: (a, b) => (
    <g>
      <path d="M24 86 A 76 76 0 0 0 176 86 Z" fill={b} />
      <path d="M36 86 A 64 64 0 0 0 164 86 Z" fill="#F6F1E8" />
      <path d="M44 86 A 56 56 0 0 0 156 86 Z" fill={a} />
      <g fill={oscurecer(a, 0.45)}>
        <ellipse cx="80" cy="108" rx="3" ry="5" transform="rotate(-20 80 108)" />
        <ellipse cx="104" cy="122" rx="3" ry="5" />
        <ellipse cx="124" cy="104" rx="3" ry="5" transform="rotate(20 124 104)" />
      </g>
    </g>
  ),
  cherry: (a, b) => (
    <g>
      <path d="M68 126 C 70 90, 96 52, 112 36 M132 122 C 128 90, 116 56, 112 36" stroke={b} strokeWidth="8" fill="none" strokeLinecap="round" />
      <path d="M112 36 C 130 24, 156 28, 166 42 C 146 48, 128 46, 112 36 Z" fill={b} />
      <circle cx="66" cy="138" r="34" fill={a} />
      <circle cx="134" cy="134" r="34" fill={a} />
    </g>
  ),
  tira: (a, b) => (
    <g>
      <path d="M18 118 C 56 56, 96 160, 140 92 C 158 66, 174 62, 186 66 L 190 94 C 176 92, 166 98, 156 114 C 116 184, 72 84, 34 148 Z" fill={a} />
      <path d="M24 126 C 60 74, 100 170, 142 98 C 158 72, 172 72, 186 76" stroke={b} strokeWidth="7" fill="none" strokeLinecap="round" opacity=".8" />
    </g>
  ),
}

// Hojuelas de chile con posiciones fijas (misma distribución en cada render)
function azar(semilla) {
  let t = semilla
  return () => {
    t = (t + 0x6d2b79f5) | 0
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}
const _r = azar(11)
const HOJUELAS = Array.from({ length: 26 }, () => ({ x: 30 + _r() * 140, y: 40 + _r() * 130, t: 1.6 + _r() * 1.9, rot: _r() * 180, o: 0.5 + _r() * 0.45 }))

export default function GomitaArte({ forma = 'osito', colores = ['#FF8A1F', '#E8243B'], className, titulo, chile = true, ...resto }) {
  const uid = useId().replace(/:/g, '')
  const dibujar = FORMAS[forma] || FORMAS.osito
  const [a, b = a] = colores
  return (
    <svg viewBox="0 0 200 200" className={className} role={titulo ? 'img' : undefined} aria-label={titulo} aria-hidden={titulo ? undefined : true} {...resto}>
      <defs>
        <mask id={`forma-${uid}`} maskUnits="userSpaceOnUse" x="0" y="0" width="200" height="200">
          {dibujar('#fff', '#fff')}
        </mask>
        <linearGradient id={`chamoy-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset=".3" stopColor="#B3364E" stopOpacity="0" />
          <stop offset="1" stopColor="#B3364E" stopOpacity=".22" />
        </linearGradient>
      </defs>
      {/* lado inferior más oscuro: volumen plano */}
      <g transform="translate(0 6)" opacity=".9">
        {dibujar(oscurecer(a, 0.72), oscurecer(b, 0.72))}
      </g>
      {dibujar(a, b)}
      <g mask={`url(#forma-${uid})`}>
        {/* baño de chamoy: más cargado hacia abajo */}
        <rect x="0" y="0" width="200" height="200" fill={`url(#chamoy-${uid})`} />
        {/* brillo de azúcar */}
        <ellipse cx="70" cy="58" rx="13" ry="5.5" fill="#fff" opacity=".3" transform="rotate(-32 70 58)" />
        {chile && (
          <g fill="#A8253F">
            {HOJUELAS.map((h, i) => (
              <rect key={i} x={h.x} y={h.y} width={h.t * 1.7} height={h.t} rx={h.t / 2.2} opacity={h.o} transform={`rotate(${h.rot} ${h.x} ${h.y})`} />
            ))}
          </g>
        )}
      </g>
    </svg>
  )
}
