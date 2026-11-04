import { useCallback, useEffect, useRef, useState } from 'react'
import Matter from 'matter-js'
import GomitaArte from '../GomitaArte'

// Gomitas planas (mismo estilo que el logo) con física 2D.
// Se pueden arrastrar, aventar y dar de comer al monstruo: si una gomita llega a su boca
// (arrastrada, lanzada o tocada en pantalla táctil), se la come.
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

// Dónde están la cabeza y la boca dentro del dibujo del monstruo (fracciones de su caja)
const CABEZA = { x: 0.5, y: 0.36, r: 0.27 }
const BOCA = { x: 0.58, y: 0.77, r: 0.1 }

function cuerpo(forma, x, y, s) {
  // categoría 2 = gomitas; los muros y la cabeza son categoría 1
  const op = { restitution: 0.35, friction: 0.6, frictionAir: 0.012, density: 0.0016, collisionFilter: { category: 0x0002, mask: 0xffff } }
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

export default function LluviaGomitas({ contenedor, monstruo, extra = 0, onComer, onHambre, onGolpe }) {
  const [gomitas, setGomitas] = useState([])
  const nodos = useRef(new Map())
  const motor = useRef(null)
  const lista = useRef([])
  const tam = useRef(90)
  const boca = useRef({ x: 0, y: 0, r: 40 })
  const contador = useRef(0)
  const movil = useRef(false)
  const cb = useRef({ onComer, onHambre, onGolpe })
  cb.current = { onComer, onHambre, onGolpe }

  // Suelta n gomitas desde arriba
  const soltar = useCallback(
    (n) => {
      const engine = motor.current
      const el = contenedor.current
      if (!engine || !el) return
      const s = tam.current
      const w = el.clientWidth
      const nuevas = []
      for (let i = 0; i < n; i++) {
        const g = MEZCLA[(contador.current + i) % MEZCLA.length]
        const id = `g${contador.current + i}`
        const x = s + Math.random() * (w - 2 * s)
        const body = cuerpo(g.forma, x, -s - i * (s * 0.9), s)
        Matter.Body.setAngle(body, Math.random() * Math.PI)
        Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.08)
        body.plugin = {}
        nuevas.push({ ...g, id, body })
      }
      contador.current += n
      Matter.Composite.add(
        engine.world,
        nuevas.map((g) => g.body)
      )
      lista.current = [...lista.current, ...nuevas]
      setGomitas((prev) => [...prev, ...nuevas.map(({ body, ...r }) => r)])
    },
    [contenedor]
  )

  // Lanza una gomita hacia la boca (toque en táctil o clic sin arrastrar)
  const lanzar = useCallback((body) => {
    if (body.plugin.lanzada) return
    body.plugin.lanzada = performance.now()
    // Durante el vuelo solo choca con el piso y la cabeza, no con las demás gomitas
    body.collisionFilter.mask = 0x0001
    setTimeout(() => {
      body.collisionFilter.mask = 0xffff
      body.plugin.lanzada = 0
    }, 1700)
    // Se lanza en el siguiente frame, ya fuera de la actualización del motor
    requestAnimationFrame(() => {
      const b = boca.current
      const pasos = 32
      const dx = b.x - body.position.x
      const dy = b.y - body.position.y
      // compensación de gravedad (0.306 px/paso² con gravedad 1.1) y de la fricción del aire (aprox.)
      const vy = dy / pasos - 0.5 * 0.306 * pasos
      Matter.Body.setPosition(body, { x: body.position.x, y: body.position.y - 4 })
      Matter.Body.setVelocity(body, { x: (dx / pasos) * 1.2, y: vy * 1.1 })
      Matter.Body.setAngularVelocity(body, 0.2)
    })
  }, [])

  // Arranque del mundo
  useEffect(() => {
    const el = contenedor.current
    if (!el) return
    movil.current = window.matchMedia('(max-width: 720px)').matches || !window.matchMedia('(hover: hover)').matches
    const s = movil.current ? 62 : 92
    tam.current = s
    const engine = Matter.Engine.create({ gravity: { y: 1.1 } })
    motor.current = engine
    const W = () => el.clientWidth
    const H = () => el.clientHeight

    let estaticos = []
    let cabeza = null
    const muros = () => {
      Matter.Composite.remove(engine.world, estaticos)
      const w = W()
      const h = H()
      estaticos = [
        Matter.Bodies.rectangle(w / 2, h + 50, w * 3, 100, { isStatic: true }),
        Matter.Bodies.rectangle(-50, h / 2 - 2000, 100, h + 4000, { isStatic: true }),
        Matter.Bodies.rectangle(w + 50, h / 2 - 2000, 100, h + 4000, { isStatic: true }),
      ]
      // La cabeza es sólida: las gomitas le rebotan encima. La boca queda libre para comer.
      const m = monstruo.current?.getBoundingClientRect()
      const c = el.getBoundingClientRect()
      cabeza = null
      if (m && m.width) {
        const ox = m.left - c.left
        const oy = m.top - c.top
        cabeza = Matter.Bodies.circle(ox + m.width * CABEZA.x, oy + m.height * CABEZA.y, m.width * CABEZA.r, { isStatic: true, label: 'cabeza' })
        estaticos.push(cabeza)
        boca.current = { x: ox + m.width * BOCA.x, y: oy + m.height * BOCA.y, r: m.width * BOCA.r }
      }
      Matter.Composite.add(engine.world, estaticos)
    }
    muros()
    // El monstruo entra animado: se vuelve a medir cuando ya está en su lugar.
    const reMedir = setTimeout(muros, 1500)

    // Arrastrar y aventar (solo con mouse; en táctil se deja libre el scroll)
    let mc = null
    if (!movil.current) {
      const mouse = Matter.Mouse.create(el)
      mouse.element.removeEventListener('wheel', mouse.mousewheel)
      mouse.element.removeEventListener('DOMMouseScroll', mouse.mousewheel)
      mc = Matter.MouseConstraint.create(engine, { mouse, constraint: { stiffness: 0.2, render: { visible: false } } })
      Matter.Composite.add(engine.world, mc)
      let inicio = null
      Matter.Events.on(mc, 'startdrag', (e) => {
        el.classList.add('arrastrando')
        inicio = { t: performance.now(), x: e.body.position.x, y: e.body.position.y }
      })
      Matter.Events.on(mc, 'enddrag', (e) => {
        el.classList.remove('arrastrando')
        const b = e.body
        const quieta = inicio && performance.now() - inicio.t < 220 && Math.hypot(b.position.x - inicio.x, b.position.y - inicio.y) < 6
        if (quieta) lanzar(b)
        else {
          b.plugin.lanzada = performance.now()
          setTimeout(() => (b.plugin.lanzada = 0), 1700)
        }
        cb.current.onHambre?.(false)
      })
    }

    // Golpes en la cabeza
    let ultimoGolpe = 0
    Matter.Events.on(engine, 'collisionStart', (e) => {
      const ahora = performance.now()
      if (ahora - ultimoGolpe < 350) return
      for (const p of e.pairs) {
        const otro = p.bodyA.label === 'cabeza' ? p.bodyB : p.bodyB.label === 'cabeza' ? p.bodyA : null
        if (otro && otro.speed > 5) {
          ultimoGolpe = ahora
          cb.current.onGolpe?.()
          break
        }
      }
    })

    const ro = new ResizeObserver(muros)
    ro.observe(el)

    // Comer: la gomita se encoge hacia la boca y desaparece
    const comer = (g) => {
      if (g.plugin_comida) return
      g.plugin_comida = true
      Matter.Composite.remove(engine.world, g.body)
      lista.current = lista.current.filter((x) => x !== g)
      const n = nodos.current.get(g.id)
      if (n) {
        const b = boca.current
        n.style.transition = 'transform 0.22s ease-in, opacity 0.22s ease-in'
        n.style.transform = `translate3d(${b.x - s / 2}px, ${b.y - s / 2}px, 0) scale(0.15) rotate(${g.body.angle}rad)`
        n.style.opacity = '0'
      }
      setTimeout(() => setGomitas((prev) => prev.filter((x) => x.id !== g.id)), 240)
      cb.current.onComer?.(g)
      if (lista.current.length < 7) setTimeout(() => soltar(movil.current ? 4 : 6), 700)
    }

    let hambre = false
    let raf = 0
    let previo = performance.now()
    const tick = (t) => {
      const dt = Math.min(32, t - previo)
      previo = t
      Matter.Engine.update(engine, dt)
      const b = boca.current
      const ahora = performance.now()
      let cerca = false
      for (const g of lista.current) {
        const n = nodos.current.get(g.id)
        if (!n) continue
        const { x, y } = g.body.position
        n.style.transform = `translate3d(${x - s / 2}px, ${y - s / 2}px, 0) rotate(${g.body.angle}rad)`
        const arrastrada = mc && mc.body === g.body
        const lanzada = g.body.plugin.lanzada && ahora - g.body.plugin.lanzada < 1600
        if (!arrastrada && !lanzada) continue
        const d = Math.hypot(x - b.x, y - b.y)
        if (arrastrada && d < b.r * 2.6) cerca = true
        if (d < b.r * (arrastrada ? 1 : 1.35)) comer(g)
      }
      if (cerca !== hambre) {
        hambre = cerca
        cb.current.onHambre?.(hambre)
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

    const primera = setTimeout(() => soltar(movil.current ? 14 : 26), 500)

    return () => {
      clearTimeout(primera)
      clearTimeout(reMedir)
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      Matter.Engine.clear(engine)
      lista.current = []
    }
  }, [contenedor, monstruo, soltar, lanzar])

  // Más gomitas cada vez que se toca al monstruo
  useEffect(() => {
    if (extra > 0) soltar(movil.current ? 5 : 8)
  }, [extra, soltar])

  // En táctil: tocar una gomita la lanza a la boca
  const tocar = (id) => (e) => {
    if (!movil.current) return
    const g = lista.current.find((x) => x.id === id)
    if (!g) return
    e.preventDefault()
    lanzar(g.body)
  }

  return (
    <div className="lluvia" aria-hidden="true">
      {gomitas.map((g) => (
        <div
          key={g.id}
          className="lluvia__gomita"
          style={{ width: tam.current, height: tam.current }}
          onPointerDown={tocar(g.id)}
          ref={(n) => (n ? nodos.current.set(g.id, n) : nodos.current.delete(g.id))}
        >
          <GomitaArte forma={g.forma} colores={g.colores} />
        </div>
      ))}
    </div>
  )
}
