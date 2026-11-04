import { useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { productos } from '../data/productos'
import { tienda } from '../config/tienda'
import { useCarrito } from '../store/carrito'
import { calcularPedido, dinero } from '../lib/precios'
import Bolsa from './Bolsa'
import { Escala } from './Adornos'
import { IcoMas, IcoMenos } from './Iconos'

const FILTROS = [
  { id: 'todas', txt: 'Todas', f: () => true },
  { id: 'suaves', txt: 'Suaves', f: (p) => p.picor === 1 },
  { id: 'picositas', txt: 'Picositas', f: (p) => p.picor === 2 },
  { id: 'enchiladas', txt: 'Bien enchiladas', f: (p) => p.picor === 3 },
  { id: 'acidas', txt: 'Más ácidas', f: (p) => p.acidez === 3 },
]

const reducir = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// La bolsa vuela al botón de pedido
function volarAlCarrito(origen) {
  const destino = document.getElementById('boton-carrito')
  if (!origen || !destino || reducir()) return
  const a = origen.getBoundingClientRect()
  const b = destino.getBoundingClientRect()
  const clon = origen.cloneNode(true)
  Object.assign(clon.style, { position: 'fixed', left: `${a.left}px`, top: `${a.top}px`, width: `${a.width}px`, height: `${a.height}px`, zIndex: 9999, pointerEvents: 'none', margin: 0 })
  document.body.appendChild(clon)
  const dx = b.left + b.width / 2 - (a.left + a.width / 2)
  const dy = b.top + b.height / 2 - (a.top + a.height / 2)
  const anim = clon.animate(
    [
      { transform: 'translate(0,0) scale(1)', opacity: 1 },
      { transform: `translate(${dx * 0.5}px, ${dy * 0.5 - 80}px) scale(.5) rotate(-8deg)`, opacity: 1, offset: 0.55 },
      { transform: `translate(${dx}px, ${dy}px) scale(.08) rotate(-14deg)`, opacity: 0.4 },
    ],
    { duration: 700, easing: 'cubic-bezier(.6,0,.2,1)' }
  )
  anim.onfinish = () => clon.remove()
}

function Stepper({ valor, onMenos, onMas, chico = false, etiqueta }) {
  return (
    <div className={`stepper ${chico ? 'stepper--chico' : ''}`} role="group" aria-label={etiqueta}>
      <button type="button" aria-label="Quitar" onClick={onMenos}>
        <IcoMenos />
      </button>
      <output aria-live="polite">{valor}</output>
      <button type="button" aria-label="Agregar" onClick={onMas}>
        <IcoMas />
      </button>
    </div>
  )
}

function Tarjeta({ p, esMayoreoActivo }) {
  const [presId, setPresId] = useState(p.presentaciones[0].id)
  const [qty, setQty] = useState(1)
  const agregar = useCarrito((s) => s.agregar)
  const arte = useRef(null)
  const pres = p.presentaciones.find((x) => x.id === presId)

  return (
    <motion.article layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="producto">
      <div className="producto__arte" ref={arte}>
        {p.foto ? <img src={p.foto} alt={p.nombre} loading="lazy" /> : <Bolsa nombre={p.nombre} forma={p.forma} colores={p.colores} peso={pres.peso} />}
      </div>
      <div className="producto__info">
        <div className="producto__cabeza">
          <h3 className="producto__nombre">{p.nombre}</h3>
          {p.etiqueta && <span className="producto__etiqueta">{p.etiqueta}</span>}
        </div>
        <p className="producto__desc">{p.descripcion}</p>
        <div className="producto__escalas">
          <Escala nivel={p.picor} etiqueta="Picor" tipo="picor" />
          <Escala nivel={p.acidez} etiqueta="Acidez" tipo="acidez" />
        </div>

        {p.presentaciones.length > 1 ? (
          <div className="segmentado" role="radiogroup" aria-label={`Presentación de ${p.nombre}`}>
            {p.presentaciones.map((x) => (
              <button key={x.id} type="button" role="radio" aria-checked={x.id === presId} className={x.id === presId ? 'on' : ''} onClick={() => setPresId(x.id)}>
                {x.nombre}
              </button>
            ))}
          </div>
        ) : (
          <p className="producto__unica">{pres.nombre}</p>
        )}

        <div className="producto__compra">
          <div className="producto__precio">
            <span className="precio">{dinero(esMayoreoActivo ? pres.mayoreo : pres.precio)}</span>
            <span className="precio__nota">{esMayoreoActivo ? `mayoreo · antes ${dinero(pres.precio)}` : `${dinero(pres.mayoreo)} en mayoreo`}</span>
          </div>
          <Stepper valor={qty} etiqueta="Cantidad" onMenos={() => setQty((q) => Math.max(1, q - 1))} onMas={() => setQty((q) => q + 1)} />
        </div>
        <button
          type="button"
          className="btn btn--primario btn--ancho"
          onClick={() => {
            agregar(p.id, presId, qty)
            volarAlCarrito(arte.current?.firstElementChild)
            setQty(1)
          }}
        >
          Agregar {qty > 1 ? `${qty} ` : ''}al pedido
        </button>
      </div>
    </motion.article>
  )
}

// Hoja de pedido de mayoreo: una fila por producto, una columna por presentación.
function HojaMayoreo() {
  const items = useCarrito((s) => s.items)
  const setCantidad = useCarrito((s) => s.setCantidad)
  const paso = tienda.mayoreo.paquete
  const qtyDe = (pid, presId) => items.find((i) => i.key === `${pid}:${presId}`)?.qty || 0
  const columnas = [...new Map(productos.flatMap((p) => p.presentaciones).map((x) => [x.id, x.nombre])).entries()]

  return (
    <div className="hoja" role="region" aria-label="Hoja de pedido de mayoreo" tabIndex={0}>
      <table>
        <thead>
          <tr>
            <th scope="col">Producto</th>
            {columnas.map(([id, nombre]) => (
              <th key={id} scope="col">
                {nombre}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {productos.map((p) => (
            <tr key={p.id}>
              <th scope="row">
                <span className="hoja__prod">
                  <Bolsa nombre={p.nombre} forma={p.forma} colores={p.colores} className="hoja__mini" detalle={false} />
                  <span>
                    <strong>{p.nombre}</strong>
                    <small>
                      Picor {p.picor}/3 · Acidez {p.acidez}/3
                    </small>
                  </span>
                </span>
              </th>
              {columnas.map(([id, nombreCol]) => {
                const pres = p.presentaciones.find((x) => x.id === id)
                if (!pres) return <td key={id} className="hoja__na" aria-label="No disponible">—</td>
                const q = qtyDe(p.id, id)
                return (
                  <td key={id} className={q ? 'con' : ''} data-col={nombreCol}>
                    <span className="hoja__precio">
                      {dinero(pres.mayoreo)} <s>{dinero(pres.precio)}</s>
                    </span>
                    <Stepper
                      chico
                      valor={q}
                      etiqueta={`${p.nombre}, ${pres.nombre}`}
                      onMenos={() => setCantidad(p.id, id, Math.max(0, q - paso))}
                      onMas={() => setCantidad(p.id, id, q + paso)}
                    />
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function BarraMayoreo({ compacta = false }) {
  const items = useCarrito((s) => s.items)
  const pedido = calcularPedido(items)
  return (
    <div className={`barra ${pedido.esMayoreo ? 'listo' : ''} ${compacta ? 'barra--compacta' : ''}`}>
      <p className="barra__texto">
        {pedido.esMayoreo ? (
          <>
            <strong>Precio de mayoreo activo.</strong> Ahorras {dinero(pedido.ahorro)}.
          </>
        ) : pedido.piezas === 0 ? (
          <>Desde {pedido.minimo} piezas, mezclando lo que quieras, todo el pedido pasa a precio de mayoreo.</>
        ) : (
          <>
            Llevas {pedido.piezas} {pedido.piezas === 1 ? 'pieza' : 'piezas'}. {pedido.faltan === 1 ? 'Falta' : 'Faltan'} <strong>{pedido.faltan}</strong> para precio de mayoreo.
          </>
        )}
      </p>
      <div className="barra__riel" role="progressbar" aria-valuemin={0} aria-valuemax={pedido.minimo} aria-valuenow={Math.min(pedido.piezas, pedido.minimo)} aria-label="Avance hacia precio de mayoreo">
        <motion.div className="barra__relleno" animate={{ width: `${pedido.progreso * 100}%` }} transition={{ type: 'spring', stiffness: 140, damping: 24 }} />
      </div>
    </div>
  )
}

export default function Tienda() {
  const modo = useCarrito((s) => s.modo)
  const setModo = useCarrito((s) => s.setModo)
  const abrir = useCarrito((s) => s.abrir)
  const items = useCarrito((s) => s.items)
  const pedido = useMemo(() => calcularPedido(items), [items])
  const [filtro, setFiltro] = useState('todas')
  const lista = productos.filter(FILTROS.find((f) => f.id === filtro).f)

  return (
    <section id="tienda" className="tienda" data-modo={modo} aria-labelledby="tienda-titulo">
      <div className="contenedor">
        <header className="tienda__cabeza">
          <h2 id="tienda-titulo" className="titulo">
            {modo === 'mayoreo' ? 'Hoja de mayoreo' : 'La tienda'}
          </h2>
          <div className="modo" role="tablist" aria-label="Tipo de compra">
            {[
              ['menudeo', 'Por pieza'],
              ['mayoreo', 'Mayoreo'],
            ].map(([id, txt]) => (
              <button key={id} role="tab" aria-selected={modo === id} className={modo === id ? 'on' : ''} onClick={() => setModo(id)}>
                {modo === id && <motion.span layoutId="modo-fondo" className="modo__fondo" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
                <span>{txt}</span>
              </button>
            ))}
          </div>
        </header>
        <p className="tienda__intro">
          {modo === 'mayoreo'
            ? `Para dulcerías, tiendas, gimnasios, cafeterías y reventa. Se pide de ${tienda.mayoreo.paquete} en ${tienda.mayoreo.paquete} y puedes mezclar sabores y presentaciones.`
            : 'Bolsa de 250 g, charola de 350 g o bites de 100 g. Si juntas suficientes piezas, el precio de mayoreo se aplica solo.'}
        </p>

        <BarraMayoreo />

        <AnimatePresence mode="wait" initial={false}>
          {modo === 'mayoreo' ? (
            <motion.div key="hoja" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>
              <HojaMayoreo />
              <div className="hoja__pie">
                <span>
                  {pedido.piezas} {pedido.piezas === 1 ? 'pieza' : 'piezas'} · <strong>{dinero(pedido.total)}</strong>
                </span>
                <button type="button" className="btn btn--primario" onClick={abrir} disabled={!pedido.piezas}>
                  Revisar pedido
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div key="grid" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>
              <div className="filtros" role="group" aria-label="Filtrar por sabor">
                {FILTROS.map((f) => (
                  <button key={f.id} type="button" className={`chip ${filtro === f.id ? 'on' : ''}`} aria-pressed={filtro === f.id} onClick={() => setFiltro(f.id)}>
                    {f.txt}
                  </button>
                ))}
              </div>
              <motion.div layout className="rejilla">
                <AnimatePresence mode="popLayout">
                  {lista.map((p) => (
                    <Tarjeta key={p.id} p={p} esMayoreoActivo={pedido.esMayoreo} />
                  ))}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        {tienda.preciosDeEjemplo && <p className="aviso">Precios de ejemplo. Se actualizan con la lista oficial.</p>}
      </div>
    </section>
  )
}
