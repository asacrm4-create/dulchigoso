import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { tienda } from '../config/tienda'
import { enlaceWhatsApp, dinero } from '../lib/precios'
import { productos } from '../data/productos'
import { useCarrito } from '../store/carrito'
import Bolsa from './Bolsa'
import GomitaArte from './GomitaArte'
import Monstruo from './Monstruo'
import { Logo } from './Nav'
import { IcoInstagram, IcoCorreo, IcoWhatsApp, IcoPin, IcoFlecha } from './Iconos'

gsap.registerPlugin(ScrollTrigger)

// ── Hechas a mano: una gomita se cubre de chamoy y entra a su bolsa ──
const PASOS = [
  { t: 'Se escoge la gomita', d: 'Ositos, lombrices, aros, manguitos. Cada forma lleva su punto.' },
  { t: 'Se cubre de chamoy y chile, a mano', d: 'Sin máquina: así cada pieza queda pareja y bien cubierta.' },
  { t: 'Se empaca bolsa por bolsa', d: 'Cada bolsa se llena y se revisa a mano antes de cerrarla.' },
]

export function HechasAMano() {
  const raiz = useRef(null)
  const [paso, setPaso] = useState(0)

  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    // En pantallas chicas no se fija la escena: se muestra el resultado final.
    if (window.matchMedia('(max-width: 960px)').matches) {
      raiz.current?.classList.add('amano--estatico')
      return
    }
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '.amano__escena',
          start: 'top top',
          end: '+=200%',
          scrub: 0.5,
          pin: true,
          onUpdate: (st) => setPaso(Math.min(2, Math.floor(st.progress * 2.999))),
        },
      })
      tl.fromTo('.amano__gomita', { y: -40, rotate: -18, scale: 0.85 }, { y: 0, rotate: 0, scale: 1, duration: 1, ease: 'power3.out' })
        .to('.amano__capa', { clipPath: 'inset(0% 0 0 0)', duration: 1.2, ease: 'none' })
        .fromTo('.amano__bolsa', { yPercent: 110 }, { yPercent: 0, duration: 1.2, ease: 'power3.out' })
        .to('.amano__gomita', { scale: 0.55, y: 40, duration: 1.2, ease: 'power3.out' }, '<')
    }, raiz)
    return () => ctx.revert()
  }, [])

  return (
    <section id="a-mano" className="amano" ref={raiz} aria-labelledby="amano-titulo">
      <div className="amano__escena">
        <div className="contenedor amano__grid">
          <div className="amano__texto">
            <h2 id="amano-titulo" className="titulo">
              Hechas a mano, bolsa por bolsa.
            </h2>
            <p className="amano__historia">
              Dulchigoso lo empezó Natalia cuando todavía estaba en la prepa. Hoy cada gomita se sigue cubriendo y empacando a mano, de forma
              individual. Así se cuida que cada bolsa salga limpia y pareja.
            </p>
            <ol className="amano__pasos">
              {PASOS.map((p, i) => (
                <li key={i} className={i === paso ? 'on' : i < paso ? 'hecho' : ''}>
                  <strong>{p.t}</strong>
                  <p>{p.d}</p>
                </li>
              ))}
            </ol>
          </div>
          <div className="amano__visual" aria-hidden="true">
            <div className="amano__gomita">
              <GomitaArte forma="osito" colores={['#F6C45C']} chile={false} className="amano__base" />
              <div className="amano__capa">
                <GomitaArte forma="osito" colores={['#F2893A', '#E2412B']} />
              </div>
            </div>
            <div className="amano__bolsa">
              <Bolsa nombre="Ositos" forma="osito" colores={['#F2893A', '#E2412B']} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Dónde comprar ──────────────────────────────────────────────
export function DondeComprar() {
  const grupos = tienda.puntosDeVenta.reduce((acc, p) => {
    ;(acc[p.ciudad] ||= []).push(p)
    return acc
  }, {})
  return (
    <section id="donde" className="donde" aria-labelledby="donde-titulo">
      <div className="contenedor donde__grid">
        <div>
          <h2 id="donde-titulo" className="titulo">
            ¿Dónde consigo mis dulchigosos?
          </h2>
          <p className="donde__intro">Pídelos aquí y te los mandamos, o búscalos en estos puntos de venta.</p>
        </div>
        <ul className="donde__lista">
          {Object.entries(grupos).map(([ciudad, lugares]) => (
            <li key={ciudad}>
              <span className="donde__ciudad">
                <IcoPin /> {ciudad}
              </span>
              <div className="donde__lugares">
                {lugares.map((l, i) =>
                  l.url ? (
                    <a key={i} href={l.url} target="_blank" rel="noopener" className="donde__lugar">
                      {l.lugar} <IcoFlecha />
                      {l.detalle && <small>{l.detalle}</small>}
                    </a>
                  ) : (
                    <span key={i} className="donde__lugar">
                      {l.lugar}
                      {l.detalle && <small>{l.detalle}</small>}
                    </span>
                  )
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

// ── Mayoreo para negocios ──────────────────────────────────────
export function Mayoreo() {
  const setModo = useCarrito((s) => s.setModo)
  const [f, setF] = useState({ negocio: '', ciudad: '', volumen: '24 a 50 piezas al mes', mensaje: '' })
  const cambiar = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }))
  const ref = productos[0].presentaciones[0]
  const ahorro = Math.round((1 - ref.mayoreo / ref.precio) * 100)

  const enviar = (e) => {
    e.preventDefault()
    const txt = [
      `Hola ${tienda.nombre}, me interesa comprar a mayoreo.`,
      `Negocio: ${f.negocio}`,
      `Ciudad: ${f.ciudad}`,
      `Volumen aproximado: ${f.volumen}`,
      f.mensaje ? `Comentarios: ${f.mensaje}` : null,
    ]
      .filter(Boolean)
      .join('\n')
    window.open(enlaceWhatsApp(txt), '_blank', 'noopener')
  }

  return (
    <section id="mayoreo" className="mayoreo" aria-labelledby="mayoreo-titulo">
      <div className="contenedor mayoreo__grid">
        <div className="mayoreo__texto">
          <h2 id="mayoreo-titulo" className="titulo titulo--claro">
            Véndelas en tu negocio.
          </h2>
          <p>
            Dulcerías, tiendas, gimnasios y cafeterías ya tienen su anaquel de dulchigosos. Desde {tienda.mayoreo.minimoPiezas} piezas, mezclando
            sabores, el precio baja alrededor de {ahorro}% ({dinero(ref.precio)} → {dinero(ref.mayoreo)} por bolsa de 250 g).
          </p>
          <a href="#tienda" className="btn btn--claro" onClick={() => setModo('mayoreo')}>
            Abrir hoja de mayoreo <IcoFlecha />
          </a>
          <div className="mayoreo__monstruo" aria-hidden="true">
            <Monstruo mirar />
          </div>
        </div>
        <form className="mayoreo__form" onSubmit={enviar}>
          <h3>Cotización para pedidos grandes o recurrentes</h3>
          <label className="campo">
            <span>Nombre del negocio</span>
            <input required value={f.negocio} onChange={cambiar('negocio')} autoComplete="organization" />
          </label>
          <label className="campo">
            <span>Ciudad</span>
            <input required value={f.ciudad} onChange={cambiar('ciudad')} autoComplete="address-level2" />
          </label>
          <label className="campo">
            <span>¿Cuánto venderías al mes?</span>
            <select value={f.volumen} onChange={cambiar('volumen')}>
              <option>24 a 50 piezas al mes</option>
              <option>50 a 150 piezas al mes</option>
              <option>150 a 500 piezas al mes</option>
              <option>Más de 500 piezas al mes</option>
            </select>
          </label>
          <label className="campo">
            <span>Comentarios (opcional)</span>
            <textarea rows={3} value={f.mensaje} onChange={cambiar('mensaje')} placeholder="Sabores que te interesan, cada cuándo surtirías…" />
          </label>
          <button type="submit" className="btn btn--whatsapp btn--ancho">
            <IcoWhatsApp /> Pedir cotización por WhatsApp
          </button>
        </form>
      </div>
    </section>
  )
}

// ── Preguntas ──────────────────────────────────────────────────
const FAQ = [
  {
    q: '¿Cómo funciona el precio de mayoreo?',
    a: `Cuando tu pedido junta ${tienda.mayoreo.minimoPiezas} piezas o más, todas pasan a precio de mayoreo. Puedes mezclar sabores y presentaciones.`,
  },
  { q: '¿Qué tan picosas son?', a: 'Cada producto trae su escala de picor y de acidez. Las de nivel 1 son para empezar; las de nivel 3 pican en serio.' },
  { q: '¿Qué presentaciones hay?', a: 'Bolsa de 250 g, charola de 350 g y bites de 100 g. Las tiras de fresa vienen en bolsa de 100 g.' },
  { q: '¿Hacen envíos?', a: 'Sí. Al mandar tu pedido por WhatsApp te confirmamos el costo y los tiempos para tu zona.' },
  { q: '¿Cómo pago?', a: 'Te compartimos las formas de pago al confirmar tu pedido por WhatsApp.' },
]

export function Preguntas() {
  return (
    <section id="preguntas" className="preguntas" aria-labelledby="preguntas-titulo">
      <div className="contenedor preguntas__grid">
        <h2 id="preguntas-titulo" className="titulo">
          Preguntas frecuentes
        </h2>
        <div className="acordeon">
          {FAQ.map((f, i) => (
            <details key={i} className="acordeon__item" name="faq">
              <summary>
                {f.q}
                <span className="acordeon__signo" aria-hidden="true" />
              </summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
      <div className="asomo" aria-hidden="true">
        <Monstruo mirar />
      </div>
    </section>
  )
}

// ── Pie ────────────────────────────────────────────────────────
export function Pie() {
  const ig = tienda.redes.instagram
  return (
    <footer className="pie">
      <div className="contenedor pie__grid">
        <div className="pie__marca">
          <Logo conLema className="pie__logo" />
        </div>
        <div className="pie__cols">
          <nav aria-label="Pie de página">
            <a href="#tienda">Tienda</a>
            <a href="#mayoreo">Mayoreo</a>
            <a href="#donde">Dónde comprar</a>
            <a href="#preguntas">Preguntas</a>
          </nav>
          <div className="pie__contacto">
            {ig && (
              <a href={ig} target="_blank" rel="noopener">
                <IcoInstagram /> @dulchigoso
              </a>
            )}
            {tienda.correo && (
              <a href={`mailto:${tienda.correo}`}>
                <IcoCorreo /> {tienda.correo}
              </a>
            )}
            {tienda.whatsapp && (
              <a href={`https://wa.me/${tienda.whatsapp}`} target="_blank" rel="noopener">
                <IcoWhatsApp /> WhatsApp
              </a>
            )}
          </div>
        </div>
      </div>
      <div className="contenedor pie__legal">
        <span>
          © {new Date().getFullYear()} {tienda.nombre} · {tienda.ciudad}, Jalisco
        </span>
        <span>{tienda.eslogan}</span>
      </div>
    </footer>
  )
}
