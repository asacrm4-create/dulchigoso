import { productos } from '../data/productos'

// Banda con los nombres de producto, en la letra de la marca.
export function Cinta() {
  const fila = [...productos, ...productos]
  return (
    <div className="cinta" aria-hidden="true">
      <div className="cinta__pista">
        {fila.map((p, i) => (
          <span key={i} className="cinta__item">
            {p.nombre.toLowerCase()}
            <span className="cinta__ojo" />
          </span>
        ))}
      </div>
    </div>
  )
}

// Escala de 3 puntos (picor / acidez)
export function Escala({ nivel, max = 3, etiqueta, tipo }) {
  return (
    <span className={`escala escala--${tipo}`} role="img" aria-label={`${etiqueta}: ${nivel} de ${max}`}>
      <span className="escala__txt" aria-hidden="true">
        {etiqueta}
      </span>
      <span className="escala__puntos" aria-hidden="true">
        {Array.from({ length: max }, (_, i) => (
          <i key={i} className={i < nivel ? 'on' : ''} />
        ))}
      </span>
    </span>
  )
}
