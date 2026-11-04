// Geometrías procedurales de gomitas enchiladas + material con "capa de chile".
import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

// ── Textura de chile en polvo (se genera una sola vez) ─────────────
let _chile
export function texturaChile() {
  if (_chile) return _chile
  const s = 512
  const c = document.createElement('canvas')
  c.width = c.height = s
  const g = c.getContext('2d')
  g.fillStyle = '#ffffff'
  g.fillRect(0, 0, s, s)
  // hojuelas planas de chamoy, como en las ilustraciones
  const tonos = ['#B3364E', '#8E2639', '#C94A3A']
  for (let i = 0; i < 900; i++) {
    const t = 2 + Math.random() * 4
    g.save()
    g.translate(Math.random() * s, Math.random() * s)
    g.rotate(Math.random() * Math.PI)
    g.fillStyle = tonos[(Math.random() * tonos.length) | 0]
    g.fillRect(-t, -t * 0.6, t * 2, t * 1.2)
    g.restore()
  }
  _chile = new THREE.CanvasTexture(c)
  _chile.colorSpace = THREE.SRGBColorSpace
  _chile.wrapS = _chile.wrapT = THREE.RepeatWrapping
  _chile.repeat.set(1.5, 1.5)
  _chile.magFilter = THREE.NearestFilter
  return _chile
}

// Rampa de 3 tonos para sombreado plano (toon)
let _rampa
function rampa() {
  if (_rampa) return _rampa
  const datos = new Uint8Array([110, 110, 110, 255, 190, 190, 190, 255, 255, 255, 255, 255])
  _rampa = new THREE.DataTexture(datos, 3, 1, THREE.RGBAFormat)
  _rampa.minFilter = _rampa.magFilter = THREE.NearestFilter
  _rampa.needsUpdate = true
  return _rampa
}

const _mats = new Map()
// Un color que termina en '!' se dibuja sin capa de chile (ojos, detalles)
export function materialGomita(colorEntrada, enchiladaDefault = true) {
  const enchilada = colorEntrada.endsWith('!') ? false : enchiladaDefault
  const color = colorEntrada.replace('!', '')
  const k = color + enchilada
  if (_mats.has(k)) return _mats.get(k)
  const tex = enchilada ? texturaChile() : null
  const m = new THREE.MeshToonMaterial({ color, map: tex, gradientMap: rampa() })
  _mats.set(k, m)
  return m
}

// ── Utilidades ─────────────────────────────────────────────────
const esfera = (r, x = 0, y = 0, z = 0, sx = 1, sy = 1, sz = 1) => {
  const g = new THREE.SphereGeometry(r, 24, 18)
  g.scale(sx, sy, sz)
  g.translate(x, y, z)
  return g
}
const juntar = (partes, grupos = false) => {
  const g = mergeGeometries(partes, grupos)
  g.computeVertexNormals()
  g.computeBoundingSphere()
  return g
}

// ── Formas ─────────────────────────────────────────────────────
function osito() {
  const p = [
    esfera(0.5, 0, 0.72, 0),
    esfera(0.19, -0.36, 1.1, 0),
    esfera(0.19, 0.36, 1.1, 0),
    esfera(0.62, 0, -0.12, 0, 1, 1.1, 1),
    esfera(0.23, -0.6, 0.18, 0),
    esfera(0.23, 0.6, 0.18, 0),
    esfera(0.28, -0.34, -0.78, 0),
    esfera(0.28, 0.34, -0.78, 0),
  ]
  const g = juntar(p)
  g.scale(1, 1, 0.62)
  return { geometria: g, n: 1 }
}

function aro() {
  const arriba = new THREE.TorusGeometry(0.62, 0.2, 16, 40)
  arriba.translate(0, 0, 0.1)
  const base = new THREE.TorusGeometry(0.62, 0.17, 14, 40)
  base.translate(0, 0, -0.12)
  return { geometria: juntar([arriba, base], true), n: 2 }
}

function lombriz() {
  const pts = []
  for (let i = 0; i <= 12; i++) {
    const t = i / 12
    pts.push(new THREE.Vector3((t - 0.5) * 3, Math.sin(t * Math.PI * 2.2) * 0.35, Math.cos(t * 5) * 0.12))
  }
  const curva = new THREE.CatmullRomCurve3(pts)
  const mitad = (a, b) => {
    const sub = new THREE.CatmullRomCurve3(Array.from({ length: 10 }, (_, i) => curva.getPoint(a + ((b - a) * i) / 9)))
    return new THREE.TubeGeometry(sub, 40, 0.2, 12, false)
  }
  const capa = (t) => {
    const p = curva.getPoint(t)
    return esfera(0.2, p.x, p.y, p.z)
  }
  const g1 = juntar([mitad(0, 0.5), capa(0)])
  const g2 = juntar([mitad(0.5, 1), capa(1)])
  return { geometria: juntar([g1, g2], true), n: 2 }
}

function manguito() {
  const g = new THREE.SphereGeometry(0.62, 28, 20)
  const pos = g.attributes.position
  const v = new THREE.Vector3()
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i)
    v.x *= 1.6
    v.y *= 0.95
    v.z *= 0.55
    v.y += -0.22 * (v.x * v.x) // curvatura de mango
    pos.setXYZ(i, v.x, v.y, v.z)
  }
  g.computeVertexNormals()
  return { geometria: g, n: 1 }
}

function sandia() {
  const ang = Math.PI / 2.6
  const pulpa = new THREE.CylinderGeometry(0.95, 0.95, 0.38, 24, 1, false, 0, ang)
  const cascara = new THREE.CylinderGeometry(1.08, 1.08, 0.32, 24, 1, false, 0, ang)
  ;[pulpa, cascara].forEach((g) => {
    g.rotateX(Math.PI / 2)
    g.rotateZ(Math.PI / 2 - ang / 2 + Math.PI)
    g.translate(0, 0.6, 0)
  })
  return { geometria: juntar([pulpa.toNonIndexed(), cascara.toNonIndexed()], true), n: 2 }
}

function cherry() {
  const bolas = juntar([esfera(0.4, -0.38, -0.25, 0), esfera(0.4, 0.38, -0.25, 0)])
  const tallo = (x) =>
    new THREE.TubeGeometry(
      new THREE.QuadraticBezierCurve3(new THREE.Vector3(x, 0.05, 0), new THREE.Vector3(x * 0.4, 0.6, 0), new THREE.Vector3(0.05, 0.9, 0)),
      16,
      0.07,
      8
    )
  const hoja = esfera(0.22, 0.25, 0.92, 0, 1.4, 0.55, 0.4)
  const verde = juntar([tallo(-0.38).toNonIndexed(), tallo(0.38).toNonIndexed(), hoja.toNonIndexed()])
  return { geometria: juntar([bolas.toNonIndexed(), verde], true), n: 2 }
}

function tiburon() {
  const cuerpo = esfera(0.5, 0, 0.06, 0, 2.1, 0.75, 0.7)
  const aleta = new THREE.ConeGeometry(0.28, 0.55, 12)
  aleta.translate(0, 0.55, 0)
  const cola = new THREE.ConeGeometry(0.3, 0.6, 12)
  cola.rotateZ(Math.PI / 2)
  cola.translate(1.15, 0.1, 0)
  const azul = juntar([cuerpo.toNonIndexed(), aleta.toNonIndexed(), cola.toNonIndexed()])
  const panza = esfera(0.42, -0.05, -0.12, 0, 2.1, 0.55, 0.62)
  return { geometria: juntar([azul, panza.toNonIndexed()], true), n: 2 }
}

function frutita() {
  // fresita/gota
  const g = new THREE.SphereGeometry(0.62, 26, 20)
  const pos = g.attributes.position
  const v = new THREE.Vector3()
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i)
    const k = 1 - Math.max(0, -v.y) * 0.55
    v.x *= k
    v.z *= k * 0.8
    pos.setXYZ(i, v.x, v.y * 1.1, v.z)
  }
  g.computeVertexNormals()
  const hojas = esfera(0.26, 0, 0.66, 0, 1.6, 0.45, 1.2)
  return { geometria: juntar([g.toNonIndexed(), hojas.toNonIndexed()], true), n: 2 }
}

function monstruo() {
  const cuerpo = esfera(0.72, 0, 0, 0, 1, 1.18, 0.72)
  const ojo = esfera(0.34, -0.06, 0.22, 0.42, 1, 1, 0.42)
  const iris = esfera(0.18, -0.1, 0.16, 0.56, 1, 1, 0.35)
  const cuerno = (lado) => {
    const c = new THREE.ConeGeometry(0.14, 0.5, 12)
    c.rotateZ(-lado * 0.55)
    c.translate(lado * 0.5, 0.86, 0)
    return c.toNonIndexed()
  }
  const cuernos = juntar([cuerno(-1), cuerno(1)])
  return { geometria: juntar([cuerpo.toNonIndexed(), ojo.toNonIndexed(), iris.toNonIndexed(), cuernos], true), n: 4 }
}

const FORMAS = { monstruo, osito, aro, lombriz, manguito, sandia, cherry, tiburon, frutita }

const _geo = new Map()
export function geometriaGomita(forma) {
  if (!_geo.has(forma)) _geo.set(forma, (FORMAS[forma] || osito)())
  return _geo.get(forma)
}

// Mezcla de gomitas para la escena (forma + colores)
export const MEZCLA = [
  { forma: 'osito', colores: ['#FF8A1F'] },
  { forma: 'osito', colores: ['#E8243B'] },
  { forma: 'osito', colores: ['#8CD13A'] },
  { forma: 'osito', colores: ['#FFC21E'] },
  { forma: 'aro', colores: ['#FF9A3C', '#FFF1DC'] },
  { forma: 'aro', colores: ['#8CD13A', '#F4FFE0'] },
  { forma: 'lombriz', colores: ['#2FBF71', '#FFB21E'] },
  { forma: 'lombriz', colores: ['#FF5FA2', '#2E7CF6'] },
  { forma: 'manguito', colores: ['#FFB21E'] },
  { forma: 'sandia', colores: ['#F2385A', '#3DAA4A'] },
  { forma: 'cherry', colores: ['#D9122F', '#3DAA4A'] },
  { forma: 'tiburon', colores: ['#2E7CF6', '#F2F7FF'] },
  { forma: 'frutita', colores: ['#E8243B', '#3DAA4A'] },
  { forma: 'osito', colores: ['#E2412B'] },
]
