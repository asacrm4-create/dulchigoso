import { useId } from 'react'
import GomitaArte from './GomitaArte'
import { CuernoIzq, CuernoDer } from './Monstruo'
import nombreLinea from '../assets/marca/nombre-linea.svg?raw'

// Réplica del empaque real de Dulchigoso: bolsa stand-up crema con cierre, aviso "abre fácil",
// sellos de advertencia, garabatos de gomitas, el wordmark en una línea con los cuernos asomando,
// la cara amarilla del monstruo con su ojo, la ventana con las gomitas y el nombre del producto.
const COLORES_LETRAS = { d: '#E2412B', ul: '#E2412B', c: '#F39322', h: '#F39322', i: '#E2412B', punto: '#F39322', g: '#E2412B', o1: '#F39322', s: '#E2412B', o2: '#F39322' }
const WORDMARK = nombreLinea
  .replace(/^<svg[^>]*>/, '')
  .replace(/<\/svg>\s*$/, '')
  .replace(/class="letra letra-(\w+)" d="([^"]*)" fill="#B3364E"/g, (m, k, d) => `class="letra letra-${k}" d="${d}" fill="${COLORES_LETRAS[k] || '#E2412B'}"`)
// viewBox del wordmark en línea: 1244 42 4060 900 → 150 unidades de ancho en la bolsa
const S = 150 / 4060
const WM = `translate(${(18 - 1244 * S).toFixed(3)},${(89 - 62 * S).toFixed(3)}) scale(${S.toFixed(5)})`

const CREMA = '#F6F1E8'
const AMARILLO = '#F3B42E'
const NARANJA = '#F39322'
const ROJO = '#E2412B'
const TINTA = '#2E1A16'
const VENTANA = 'M36 200 Q36 184 52 184 L148 184 Q166 184 166 200 L166 232 Q166 270 128 270 L72 270 Q36 270 36 232 Z'
const SILUETA = 'M32 2 L168 2 Q176 2 176.5 10 L186 266 Q187 292 164 294 L36 294 Q13 292 14 266 L23.5 10 Q24 2 32 2 Z'

// Gomitas apiladas dentro de la ventana (posición, tamaño y giro fijos)
const PILA = [
  { x: 24, y: 166, s: 72, r: 38 },
  { x: 108, y: 162, s: 74, r: -24 },
  { x: 60, y: 172, s: 66, r: -8 },
  { x: 14, y: 206, s: 78, r: -30 },
  { x: 112, y: 206, s: 80, r: 22 },
  { x: 58, y: 218, s: 82, r: 4 },
  { x: 86, y: 192, s: 60, r: 70 },
]

// Garabatos de gomitas en contorno (como en el empaque): pocos y tenues
function Garabatos() {
  const t = { fill: 'none', stroke: '#EFCF7A', strokeWidth: 1.4, strokeLinejoin: 'round', strokeLinecap: 'round', opacity: 0.75 }
  return (
    <g {...t}>
      <circle cx="72" cy="60" r="7" />
      <path d="M96 52 c-7 0-9 10-2 12 c7 2 11-10 2-12z" />
      <path d="M118 66 c0-6 10-9 12-2 c2 6-4 10-8 10 c-3 0-4-4-4-8z" />
      <circle cx="58" cy="86" r="4.5" />
      <path d="M144 90 l5 9 h-10z" />
      <circle cx="176" cy="104" r="5" />
      <path d="M34 112 c3-7 12-5 12 1" />
      <path d="M126 112 c-6 0-7 8-1 9 c6 1 8-9 1-9z" />
    </g>
  )
}

function Sello({ x, y, texto }) {
  const r = 9
  const pts = Array.from({ length: 8 }, (_, i) => {
    const a = (Math.PI / 8) * (2 * i + 1)
    return `${(x + r * Math.cos(a)).toFixed(2)},${(y + r * Math.sin(a)).toFixed(2)}`
  }).join(' ')
  return (
    <g>
      <polygon points={pts} fill="#fff" stroke={TINTA} strokeWidth="1.1" />
      <text x={x} y={y - 1} textAnchor="middle" fontSize="2.6" fontWeight="800" fill={TINTA} fontFamily="Arial, sans-serif">
        EXCESO
      </text>
      <text x={x} y={y + 2.4} textAnchor="middle" fontSize="2.6" fontWeight="800" fill={TINTA} fontFamily="Arial, sans-serif">
        {texto}
      </text>
    </g>
  )
}

export default function Bolsa({ nombre, forma, colores, className = '', peso = '250 g', detalle = true }) {
  const uid = useId().replace(/:/g, '')
  const largo = nombre.length
  const tam = largo > 13 ? 11 : largo > 9 ? 13.5 : 17
  return (
    <svg viewBox="0 0 200 304" className={`bolsa ${className}`} role="img" aria-label={`Bolsa de ${nombre}`}>
      <defs>
        <clipPath id={`bolsa-${uid}`}>
          <path d={SILUETA} />
        </clipPath>
        <clipPath id={`ventana-${uid}`}>
          <path d={VENTANA} />
        </clipPath>
        <linearGradient id={`sheen-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".5" />
          <stop offset=".35" stopColor="#fff" stopOpacity=".05" />
          <stop offset=".7" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#fff" stopOpacity=".25" />
        </linearGradient>
        <linearGradient id={`luz-${uid}`} x1="0" x2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".32" />
          <stop offset=".22" stopColor="#fff" stopOpacity="0" />
          <stop offset=".85" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity=".06" />
        </linearGradient>
      </defs>

      {/* sombra en piso */}
      <ellipse cx="100" cy="297" rx="78" ry="5" fill={TINTA} opacity=".12" />

      <g clipPath={`url(#bolsa-${uid})`}>
        <rect width="200" height="304" fill={CREMA} />

        {/* sello superior corrugado y cierre */}
        <g stroke={TINTA} strokeWidth=".6" opacity=".08">
          {[7, 10, 13, 16, 19, 22, 25, 28].map((y) => (
            <line key={y} x1="20" x2="180" y1={y} y2={y} />
          ))}
        </g>
        <rect x="14" y="31" width="172" height="2.4" fill="#E3DACB" />
        <rect x="14" y="35" width="172" height="1.2" fill="#D9CFBF" />

        {detalle && (
          <>
            {/* abre fácil */}
            <g fill={TINTA}>
              <path d="M36 50 v8 M33 53 l3-3 3 3" stroke={TINTA} strokeWidth="1.3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <text x="30" y="65" fontSize="3.2" fontWeight="700" fontFamily="Arial, sans-serif" letterSpacing=".2">
                ABRE FÁCIL
              </text>
            </g>
            {/* sellos de advertencia */}
            <Sello x={150} y={60} texto="CALORÍAS" />
            <Sello x={171} y={60} texto="AZÚCARES" />
            <Garabatos />
          </>
        )}

        {/* cuernos del monstruo asomando detrás del nombre */}
        <g fill={NARANJA} className="bolsa__cuernos">
          <g transform="translate(2.9,26.1) scale(1.1)">
            <CuernoIzq />
            <circle cx="41" cy="49" r="8.4" />
          </g>
          <g transform="translate(55.6,44) scale(0.9)">
            <CuernoDer />
            <circle cx="116" cy="46.5" r="5.4" />
          </g>
        </g>

        {/* wordmark en una línea */}
        <g transform={WM} dangerouslySetInnerHTML={{ __html: WORDMARK }} />
        <text x="169.5" y="94" fontSize="4" fontFamily="Arial, sans-serif" fill={ROJO} fontWeight="700">
          ®
        </text>

        {/* cara del monstruo */}
        <path d="M14 160 C14 128 55 112 100 112 C145 112 186 128 186 160 L186 310 L14 310 Z" fill={AMARILLO} />
        <circle cx="102" cy="150" r="31" fill="#FBF8F2" />
        <g className="bolsa__iris">
          <circle cx="100" cy="153" r="18.5" fill={ROJO} />
          <circle cx="111" cy="143" r="6" fill="#FBF8F2" />
        </g>

        {/* ventana con las gomitas */}
        <g clipPath={`url(#ventana-${uid})`}>
          <rect x="36" y="184" width="130" height="86" fill={colores[0]} opacity=".18" />
          <rect x="36" y="184" width="130" height="86" fill="#F8DCC8" opacity=".5" />
          {PILA.map((g, i) => (
            <GomitaArte key={i} forma={forma} colores={colores} x={g.x} y={g.y} width={g.s} height={g.s} className="bolsa__gomita" style={{ transform: `rotate(${g.r}deg)` }} />
          ))}
          <rect x="36" y="184" width="130" height="86" fill={`url(#sheen-${uid})`} />
          <path d="M52 192 q30 -10 60 -4" stroke="#fff" strokeOpacity=".55" strokeWidth="3" fill="none" strokeLinecap="round" />
        </g>
        <path d={VENTANA} fill="none" stroke="#fff" strokeOpacity=".55" strokeWidth="1.6" />

        {/* nombre del producto */}
        <text x="101" y="286" textAnchor="middle" className="bolsa__nombre" fontSize={tam}>
          {nombre.toUpperCase()}
        </text>
        {detalle && (
          <>
            <text x="24" y="292" fontSize="3.1" fontWeight="700" fill={TINTA} fontFamily="Arial, sans-serif" letterSpacing=".15">
              GOMITAS CUBIERTAS CON CHAMOY
            </text>
            <text x="176" y="288" fontSize="3.1" fontWeight="700" fill={TINTA} fontFamily="Arial, sans-serif" textAnchor="end" transform="rotate(-14 176 288)">
              CONT. NET. {peso}
            </text>
          </>
        )}

        {/* luz y volumen del material */}
        <rect width="200" height="304" fill={`url(#luz-${uid})`} />
      </g>
      {/* contorno fino */}
      <path d={SILUETA} fill="none" stroke={TINTA} strokeOpacity=".1" strokeWidth=".8" />
    </svg>
  )
}
