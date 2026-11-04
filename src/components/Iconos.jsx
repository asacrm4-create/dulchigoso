// Íconos dibujados en un solo trazo (1.75px), para toda la página.
const base = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.75, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true }

export const IcoBolsa = (p) => (
  <svg {...base} {...p}>
    <path d="M6 8h12l-.9 11.1a1.5 1.5 0 0 1-1.5 1.4H8.4a1.5 1.5 0 0 1-1.5-1.4z" />
    <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
  </svg>
)
export const IcoCerrar = (p) => (
  <svg {...base} {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
)
export const IcoMas = (p) => (
  <svg {...base} {...p}>
    <path d="M12 5v14M5 12h14" />
  </svg>
)
export const IcoMenos = (p) => (
  <svg {...base} {...p}>
    <path d="M5 12h14" />
  </svg>
)
export const IcoFlecha = (p) => (
  <svg {...base} {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)
export const IcoAtras = (p) => (
  <svg {...base} {...p}>
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </svg>
)
export const IcoPin = (p) => (
  <svg {...base} {...p}>
    <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" />
    <circle cx="12" cy="10" r="2.3" />
  </svg>
)
export const IcoWhatsApp = (p) => (
  <svg {...base} {...p}>
    <path d="M4 20l1.2-3.7A8 8 0 1 1 8 19z" />
    <path d="M9 9.2c0 3 2.6 5.6 5.6 5.8l1.2-1.4-1.8-.9-.8.8c-1-.4-2-1.4-2.4-2.4l.8-.8-.9-1.8L9.3 9" />
  </svg>
)
export const IcoInstagram = (p) => (
  <svg {...base} {...p}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r=".6" fill="currentColor" />
  </svg>
)
export const IcoCorreo = (p) => (
  <svg {...base} {...p}>
    <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
    <path d="m4 7 8 6 8-6" />
  </svg>
)
export const IcoCopiar = (p) => (
  <svg {...base} {...p}>
    <rect x="8" y="8" width="12" height="12" rx="2" />
    <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
  </svg>
)
