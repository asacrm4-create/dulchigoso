import { useId } from 'react'
import GomitaArte from './GomitaArte'

// Réplica en vector del empaque Dulchigoso: bolsa crema, cara del monstruo y ventana con las gomitas.
export default function Bolsa({ nombre, forma, colores, className = '', peso }) {
  const uid = useId().replace(/:/g, '')
  const largo = nombre.length
  const tam = largo > 13 ? 15 : largo > 9 ? 18 : 22
  return (
    <svg viewBox="0 0 200 290" className={`bolsa ${className}`} role="img" aria-label={`Bolsa de ${nombre}`}>
      <defs>
        <linearGradient id={`brillo-${uid}`} x1="0" x2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".55" />
          <stop offset=".18" stopColor="#fff" stopOpacity="0" />
          <stop offset=".8" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity=".08" />
        </linearGradient>
        <clipPath id={`ventana-${uid}`}>
          <rect x="48" y="186" width="104" height="68" rx="30" />
        </clipPath>
        <clipPath id={`bolsa-${uid}`}>
          <path d="M22 16 Q22 6 32 6 L168 6 Q178 6 178 16 L186 272 Q186 284 174 284 L26 284 Q14 284 14 272 Z" />
        </clipPath>
      </defs>
      <g clipPath={`url(#bolsa-${uid})`}>
        <rect width="200" height="290" fill="#F5F0E7" />
        {/* doodles de gomitas en contorno */}
        <g fill="none" stroke="#F1D36C" strokeWidth="1.6" opacity=".9">
          <path d="M46 62 c-8 0-10 12-2 14 c8 2 12-12 2-14 z" />
          <circle cx="86" cy="56" r="9" />
          <path d="M120 50 l10 18 h-20 z" strokeLinejoin="round" />
          <path d="M150 64 c6-10 18-4 14 6 c-3 8-16 6-14-6 z" />
          <circle cx="166" cy="104" r="6" />
          <path d="M30 104 c4-6 12-4 12 2" />
        </g>
        {/* cierre */}
        <rect x="14" y="34" width="172" height="3" fill="#E6DED0" />
        <path d="M30 46 v-6 m-3 3 l3-3 l3 3" stroke="#3a2a26" strokeWidth="1.4" fill="none" />
        {/* cuernos */}
        <path d="M16 136 C -2 120, 4 94, 30 92 C 46 92, 56 108, 50 124 Z" fill="#F08A24" />
        <path d="M184 136 C 202 120, 196 94, 170 92 C 154 92, 144 108, 150 124 Z" fill="#F08A24" />
        <circle cx="54" cy="84" r="9" fill="#F08A24" />
        {/* logo */}
        <text x="100" y="104" textAnchor="middle" className="bolsa__logo">
          <tspan fill="#E2412B">dul</tspan>
          <tspan fill="#F08A24">chi</tspan>
          <tspan fill="#E2412B">goso</tspan>
        </text>
        {/* cara */}
        <path d="M18 150 Q18 116 60 114 L140 114 Q182 116 182 150 L188 290 L12 290 Z" fill="#EDB23C" />
        <circle cx="100" cy="152" r="23" fill="#F7F3EC" />
        <g className="bolsa__iris">
          <circle cx="97" cy="156" r="13" fill="#E2412B" />
          <circle cx="102" cy="150" r="3.4" fill="#F7F3EC" />
        </g>
        {/* ventana */}
        <rect x="48" y="186" width="104" height="68" rx="30" fill="#E9542E" opacity=".25" />
        <g clipPath={`url(#ventana-${uid})`}>
          <rect x="48" y="186" width="104" height="68" fill="#F9D9C9" opacity=".55" />
          <GomitaArte forma={forma} colores={colores} x="44" y="168" width="78" height="78" className="bolsa__gomita bolsa__gomita--a" />
          <GomitaArte forma={forma} colores={colores} x="88" y="178" width="72" height="72" className="bolsa__gomita bolsa__gomita--b" />
          <rect x="48" y="186" width="104" height="68" fill="url(#brillo-${uid})" opacity=".9" />
          <path d="M60 196 q20 -8 44 -6" stroke="#fff" strokeOpacity=".7" strokeWidth="3" fill="none" strokeLinecap="round" />
        </g>
        <rect x="48" y="186" width="104" height="68" rx="30" fill="none" stroke="#fff" strokeOpacity=".5" strokeWidth="2" />
        {/* nombre */}
        <text x="100" y="274" textAnchor="middle" className="bolsa__nombre" fontSize={tam}>
          {nombre.toUpperCase()}
        </text>
        {peso && (
          <text x="174" y="282" textAnchor="end" className="bolsa__peso">
            {peso}
          </text>
        )}
      </g>
    </svg>
  )
}
