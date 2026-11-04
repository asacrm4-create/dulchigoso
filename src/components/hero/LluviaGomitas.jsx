import { useEffect, useRef, useState } from 'react'
import Matter from 'matter-js'
import GomitaArte from '../GomitaArte'

// Gomitas planas (mismo estilo que el logo) con física 2D.
// Se pueden arrastrar y aventar; rebotan en el monstruo.
const MEZCLA = [
  { forma: 'osito', colores: ['#E2412B', '#B3364E'] },
  { forma: 'lombriz', colores: ['#3FBF6E', '#F7B52C'] },
  { forma: 'aro', colores: ['#F7923C', '#FFE1B8'] },
  { forma: 'osito', colores: ['#8FCF3A', '#5FB04A'] },
  { forma: 'manguito', colores: ['#F7B52C', '#FFD56A'] },
  { forma: 'sandia', colores: ['#E8304A', '#5FB04A'] },
  { forma: 'frutita', colores: ['#E8304A', '#5FB04A'] },
  { forma: 'osito', colores: ['#F2893A', '#E2412B'] },
  { forma: 'aro', colores: ['#8FCF3A', '#F2FAD9'] },
  { forma: 'lombriz', colores: ['#E2412B', '#F7B52C'] },
  { forma: 'tira', colores: ['#F2385A', '#FFD6DF'] },
  { forma: 'cherry', colores: ['#B3364E', '#5FB04A'] },
]

function cuerpo(forma, x, y, s) {
  const op = { restitution: 0.35, friction: 0.6, frictionAir: 0.012, density: 0.0016 }
  switch (forma) {
    case 'osito':
      return Matter.Bodies.rectangle(x, y, s * 0.62, s * 0.86, { ...op, chamfer: { radius: s * 0.22 } })
    case 'lombriz':
    case 'tira':
      return Matter.Bodies.rectangle(x, y, s * 0.82, s * 0.46, { ...op, chamfer: { radius: s * 0.18 } })
    case 'aro':
      return Matter.Bodies.circle(x, y, s * 0.42, op)
    case 'sandia':
      return Matter.Bodies.rectangle(x, y, s * 0.8, s * 0.44, { ...op, chamfer: { radius: s * 0.16 } })
    case 'frutita':
    case 'manguito':
      return Matter.Bodies.rectangle(x, y, s * 0.66, s * 0.62, { ...op, chamfer: { radius: s * 0.26 } })
    default:
      return Matter.Bodies.circle(x, y, s * 0.38, op)
  }
}

export default function LluviaGomitas({ contenedor, monstruo, extra = 0 }) {
  const [gomitas, setGomitas] = useState([])
  const nodos = useRef(new Map())
  const motor = useRef(null)
  const lista = useRef([])
  const tam = useRef(90)

  // Arranque del mundo
  useEffect(() => {
    const el = contenedor.current
    if (!el) return
    const movil = window.matchMedia('(max-width: 720px)').matches
    const s = movil ? 62 : 92
    tam.current = s
    const engine = Matter.Engine.create({ gravity: { y: 1.1 } })
    motor.current = engine
    const W = () => el.clientWidth
    const H = () => el.clientHeight

    let estaticos = []
    const muros = () => {
      Matter.Composite.remove(engine.world, estaticos)
      const w = W()
      const h = H()
      estaticos = [
        Matter.Bodies.rectangle(w / 2, h + 50, w * 3, 100, { isStatic: true }),
        Matter.Bodies.rectangle(-50, h / 2 - 2000, 100, h + 4000, { isStatic: true }),
        Matter.Bodies.rectangle(w + 50, h / 2 - 2000, 100, h + 4000, { isStatic: true }),
      ]
      // El monstruo es sólido: las gomitas le rebotan en la cabeza
      const m = monstruo.current?.getBoundingClientRect()
      const c = el.getBoundingClientRect()
      if (m && m.width) {
        const cx = m.left - c.left + m.width * 0.5
        const top = m.top - c.top + m.height * 0.2
        const alto = m.height * 0.8
        estaticos.push(
          Matter.Bodies.rectangle(cx, top + alto / 2, m.width * 0.52, alto, { isStatic: true, chamfer: { radius: m.width * 0.24 } })
        )
      }
      Matter.Composite.add(engine.world, estaticos)
    }
    muros()

    // Arrastrar y aventar (solo con mouse; en táctil se deja libre el scroll)
    let mc = null
    if (!movil) {
      const mouse = Matter.Mouse.create(el)
      mouse.element.removeEventListener('wheel', mouse.mousewheel)
      mouse.element.removeEventListener('DOMMouseScroll', mouse.mousewheel)
      mc = Matter.MouseConstraint.create(engine, { mouse, constraint: { stiffness: 0.2, render: { visible: false } } })
      Matter.Composite.add(engine.world, mc)
      Matter.Events.on(mc, 'startdrag', () => el.classList.add('arrastrando'))
      Matter.Events.on(mc, 'enddrag', () => el.classList.remove('arrastrando'))
    }

    const ro = new ResizeObserver(muros)
    ro.observe(el)

    let raf = 0
    let previo = performance.now()
    const tick = (t) => {
      const dt = Math.min(32, t - previo)
      previo = t
      Matter.Engine.update(engine, dt)
      for (const g of lista.current) {
        const n = nodos.current.get(g.id)
        if (!n) continue
        const { x, y } = g.body.position
        n.style.transform = `translate3d(${x - s / 2}px, ${y - s / 2}px, 0) rotate(${g.body.angle}rad)`
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    const io = new IntersectionObserver(([e]) => {
      cancelAnimationFrame(raf)
      if (e.isIntersecting) {
        previo = performance.now()
        raf = requestAnimationFrame(tick)
      }
    })
    io.observe(el)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      Matter.Engine.clear(engine)
      lista.current = []
    }
  }, [contenedor, monstruo])

  // Soltar gomitas (al inicio y cada vez que "extra" sube)
  useEffect(() => {
    const engine = motor.current
    const el = contenedor.current
    if (!engine || !el) return
    const movil = window.matchMedia('(max-width: 720px)').matches
    const n = extra === 0 ? (movil ? 14 : 26) : movil ? 5 : 8
    const s = tam.current
    const w = el.clientWidth
    const nuevas = []
    const timers = []
    for (let i = 0; i < n; i++) {
      const g = MEZCLA[(i + extra * 3) % MEZCLA.length]
      const id = `${extra}-${i}`
      const x = s + Math.random() * (w - 2 * s)
      const body = cuerpo(g.forma, x, -s - i * (s * 0.9), s)
      Matter.Body.setAngle(body, Math.random() * Math.PI)
      Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.08)
      nuevas.push({ ...g, id, body })
    }
    timers.push(
      setTimeout(() => {
        Matter.Composite.add(
          engine.world,
          nuevas.map((g) => g.body)
        )
        lista.current = [...lista.current, ...nuevas]
        setGomitas((prev) => [...prev, ...nuevas.map(({ body, ...r }) => r)])
      }, extra === 0 ? 500 : 0)
    )
    return () => timers.forEach(clearTimeout)
  }, [extra, contenedor])

  return (
    <div className="lluvia" aria-hidden="true">
      {gomitas.map((g) => (
        <div
          key={g.id}
          className="lluvia__gomita"
          style={{ width: tam.current, height: tam.current }}
          ref={(n) => (n ? nodos.current.set(g.id, n) : nodos.current.delete(g.id))}
        >
          <GomitaArte forma={g.forma} colores={g.colores} />
        </div>
      ))}
    </div>
  )
}
