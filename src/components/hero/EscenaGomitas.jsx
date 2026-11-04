import { useMemo, useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Physics, RigidBody, CuboidCollider, BallCollider } from '@react-three/rapier'
import { ContactShadows } from '@react-three/drei'
import { geometriaGomita, materialGomita, MEZCLA } from './gomitas3d'

function Gomita({ forma, colores, posicion, escala }) {
  const ref = useRef()
  const { geometria, n } = geometriaGomita(forma)
  const material = useMemo(() => {
    const mats = colores.map((c) => materialGomita(c))
    return n > 1 ? Array.from({ length: n }, (_, i) => mats[i % mats.length]) : mats[0]
  }, [colores, n])
  useEffect(() => {
    const lista = (window.__dgRB ||= new Set())
    const rb = ref
    lista.add(rb)
    return () => lista.delete(rb)
  }, [])
  const rot = useMemo(() => [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI], [])

  const brincar = (e) => {
    e.stopPropagation()
    const rb = ref.current
    if (!rb) return
    const m = rb.mass()
    rb.applyImpulse({ x: (Math.random() - 0.5) * 6 * m, y: 11 * m, z: 0 }, true)
    rb.applyTorqueImpulse({ x: (Math.random() - 0.5) * m, y: (Math.random() - 0.5) * m, z: (Math.random() - 0.5) * 2 * m }, true)
  }

  return (
    <RigidBody
      ref={ref}
      colliders="hull"
      position={posicion}
      rotation={rot}
      restitution={0.35}
      friction={0.9}
      linearDamping={0.25}
      angularDamping={0.4}
      ccd
    >
      <mesh
        geometry={geometria}
        material={material}
        scale={escala}
        castShadow
        onPointerDown={brincar}
        onPointerOver={() => (document.body.style.cursor = 'grab')}
        onPointerOut={() => (document.body.style.cursor = '')}
      />
    </RigidBody>
  )
}

function Cursor() {
  const ref = useRef()
  const { viewport } = useThree()
  useFrame((state) => {
    if (!ref.current) return
    const { x, y } = state.pointer
    ref.current.setNextKinematicTranslation({ x: (x * viewport.width) / 2, y: (y * viewport.height) / 2, z: 0 })
  })
  return (
    <RigidBody ref={ref} type="kinematicPosition" colliders={false} position={[0, -100, 0]}>
      <BallCollider args={[0.9]} />
    </RigidBody>
  )
}

function Limites() {
  const { viewport } = useThree()
  const w = viewport.width
  const h = viewport.height
  return (
    <RigidBody type="fixed" colliders={false} key={`${w.toFixed(2)}-${h.toFixed(2)}`}>
      <CuboidCollider args={[w * 2, 4, 6]} position={[0, -h / 2 - 3.0, 0]} />
      <CuboidCollider args={[1, h * 3, 4]} position={[-w / 2 - 0.2, h, 0]} />
      <CuboidCollider args={[1, h * 3, 4]} position={[w / 2 + 0.2, h, 0]} />
      <CuboidCollider args={[w, h * 3, 1]} position={[0, h, -2.6]} />
      <CuboidCollider args={[w, h * 3, 1]} position={[0, h, 2.6]} />
    </RigidBody>
  )
}

function Lluvia({ cantidad, escala, tanda, soloMonstruos = false }) {
  const { viewport } = useThree()
  const lista = useMemo(() => {
    return Array.from({ length: cantidad }, (_, i) => {
      const g = soloMonstruos ? MEZCLA.find((m) => m.forma === 'monstruo') : MEZCLA[(i * 7 + tanda) % MEZCLA.length]
      return {
        id: `${tanda}-${i}`,
        ...g,
        posicion: [(Math.random() - 0.5) * (viewport.width * 0.7), viewport.height / 2 + 1 + i * 0.5, (Math.random() - 0.5) * 2],
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cantidad, tanda])
  return lista.map((g) => <Gomita key={g.id} {...g} escala={escala} />)
}

function Sombra({ activo }) {
  const { viewport } = useThree()
  return (
    <ContactShadows
      position={[0, -viewport.height / 2 + 1.01, 0]}
      opacity={0.32}
      scale={[viewport.width * 1.2, 8]}
      blur={2.6}
      far={5}
      resolution={256}
      color="#8a3600"
      frames={activo ? Infinity : 1}
    />
  )
}

if (typeof window !== 'undefined') {
  window.__dgDebug = () => {
    const ys = [...(window.__dgRB || [])].map((r) => r.current?.translation().y).filter((y) => y !== undefined)
    return { n: ys.length, min: Math.min(...ys).toFixed(1), max: Math.max(...ys).toFixed(1), visibles: ys.filter((y) => y < 6.5).length }
  }
}

export default function EscenaGomitas({ activo, eventSource, lluvia = 0 }) {
  const [movil] = useState(() => window.matchMedia('(max-width: 720px)').matches)
  const cantidad = movil ? 12 : 22
  const escala = movil ? 1.05 : 1.15
  const [listo, setListo] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setListo(true), 250)
    return () => clearTimeout(t)
  }, [])

  return (
    <Canvas
      className="escena-gomitas"
      eventSource={eventSource}
      eventPrefix="client"
      frameloop={activo ? 'always' : 'never'}
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 15], fov: 32 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
    >
      <ambientLight intensity={1.1} />
      <directionalLight position={[5, 9, 10]} intensity={2.2} color="#ffffff" />
            <Physics gravity={[0, -22, 0]} paused={!activo} timeStep="vary">
        <Limites />
        <Cursor />
        {listo && <Lluvia tanda={0} cantidad={cantidad} escala={escala} />}
        {Array.from({ length: lluvia }, (_, t) => (
          <Lluvia key={t} tanda={t + 1} cantidad={movil ? 4 : 7} escala={escala} soloMonstruos />
        ))}
      </Physics>
      <Sombra activo={activo} />
    </Canvas>
  )
}
