import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useCarrito } from '../store/carrito'
import { calcularPedido, dinero, mensajePedido, enlaceWhatsApp } from '../lib/precios'
import { tienda } from '../config/tienda'
import Bolsa from './Bolsa'
import Monstruo from './Monstruo'
import { IcoCerrar, IcoMas, IcoMenos, IcoAtras, IcoCopiar, IcoWhatsApp } from './Iconos'
import { BarraMayoreo } from './Tienda'

export default function Carrito() {
  const { items, abierto, cerrar, setQty, quitar, vaciar, modo } = useCarrito()
  const pedido = calcularPedido(items)
  const [paso, setPaso] = useState('lista') // lista | datos
  const [cliente, setCliente] = useState({ nombre: '', telefono: '', entrega: 'recoger', direccion: '', notas: '' })
  const [copiado, setCopiado] = useState(false)
  const panel = useRef(null)
  const salto = modo === 'mayoreo' ? tienda.mayoreo.paquete : 1

  useEffect(() => {
    if (!abierto) return
    const esc = (e) => e.key === 'Escape' && cerrar()
    window.addEventListener('keydown', esc)
    document.documentElement.classList.add('sin-scroll')
    setTimeout(() => panel.current?.focus(), 50)
    return () => {
      window.removeEventListener('keydown', esc)
      document.documentElement.classList.remove('sin-scroll')
    }
  }, [abierto, cerrar])

  useEffect(() => {
    if (!abierto) setPaso('lista')
  }, [abierto])

  const texto = mensajePedido(pedido, cliente)
  const cambiar = (k) => (e) => setCliente((c) => ({ ...c, [k]: e.target.value }))

  const enviar = (e) => {
    e.preventDefault()
    window.open(enlaceWhatsApp(texto), '_blank', 'noopener')
  }
  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(texto)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
    } catch {
      /* sin portapapeles */
    }
  }

  return (
    <AnimatePresence>
      {abierto && (
        <>
          <motion.div className="velo" onClick={cerrar} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
          <motion.aside
            ref={panel}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="carrito-titulo"
            className="carrito"
            initial={{ x: '105%' }}
            animate={{ x: 0 }}
            exit={{ x: '105%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 34 }}
            data-lenis-prevent
          >
            <header className="carrito__cabeza">
              <h2 id="carrito-titulo">{paso === 'lista' ? 'Tu pedido' : 'Tus datos'}</h2>
              <button type="button" className="btn-icono" onClick={cerrar} aria-label="Cerrar pedido">
                <IcoCerrar />
              </button>
            </header>

            {items.length === 0 ? (
              <div className="carrito__vacio">
                <Monstruo mirar className="carrito__vacio-arte" />
                <p>
                  <strong>El monstruo tiene hambre.</strong>
                  <br />
                  Tu pedido está vacío; agrega unas bolsas desde la tienda.
                </p>
                <a href="#tienda" className="btn btn--primario" onClick={cerrar}>
                  Ir a la tienda
                </a>
              </div>
            ) : paso === 'lista' ? (
              <>
                <div className="carrito__cuerpo">
                  <BarraMayoreo compacta />
                  <ul className="carrito__lista">
                    <AnimatePresence initial={false}>
                      {pedido.lineas.map((l) => (
                        <motion.li key={l.key} layout initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30, height: 0 }} className="linea">
                          <div className="linea__arte">
                            {l.producto.foto ? <img src={l.producto.foto} alt="" /> : <Bolsa nombre={l.producto.nombre} forma={l.producto.forma} colores={l.producto.colores} peso={l.pres.peso} detalle={false} />}
                          </div>
                          <div className="linea__info">
                            <strong>{l.producto.nombre}</strong>
                            <span>{l.pres.nombre} · {dinero(l.unit)} c/u</span>
                            <div className="stepper stepper--chico">
                              <button type="button" aria-label="Quitar uno" onClick={() => setQty(l.key, l.qty - salto)}><IcoMenos /></button>
                              <output>{l.qty}</output>
                              <button type="button" aria-label="Agregar uno" onClick={() => setQty(l.key, l.qty + salto)}><IcoMas /></button>
                            </div>
                          </div>
                          <div className="linea__total">
                            <b>{dinero(l.sub)}</b>
                            <button type="button" className="enlace" onClick={() => quitar(l.key)}>
                              Quitar
                            </button>
                          </div>
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </ul>
                  <button type="button" className="enlace enlace--tenue" onClick={vaciar}>
                    Vaciar pedido
                  </button>
                </div>
                <footer className="carrito__pie">
                  <div className="totales">
                    <span>{pedido.piezas} {pedido.piezas === 1 ? 'pieza' : 'piezas'}{pedido.esMayoreo ? ' · mayoreo' : ''}</span>
                    {pedido.ahorro > 0 && <span className="totales__ahorro">Ahorras {dinero(pedido.ahorro)}</span>}
                    <strong>{dinero(pedido.total)}</strong>
                  </div>
                  <button type="button" className="btn btn--primario btn--ancho" onClick={() => setPaso('datos')}>
                    Continuar con mi pedido
                  </button>
                </footer>
              </>
            ) : (
              <form className="carrito__form" onSubmit={enviar}>
                <div className="carrito__cuerpo">
                  <label className="campo">
                    <span>Nombre</span>
                    <input required value={cliente.nombre} onChange={cambiar('nombre')} autoComplete="name" />
                  </label>
                  <label className="campo">
                    <span>Teléfono (opcional)</span>
                    <input type="tel" value={cliente.telefono} onChange={cambiar('telefono')} autoComplete="tel" inputMode="tel" />
                  </label>
                  <fieldset className="campo">
                    <legend>Entrega</legend>
                    <div className="opciones">
                      {tienda.entrega.recoger.activo && (
                        <label className={`opcion ${cliente.entrega === 'recoger' ? 'on' : ''}`}>
                          <input type="radio" name="entrega" value="recoger" checked={cliente.entrega === 'recoger'} onChange={cambiar('entrega')} />
                          {tienda.entrega.recoger.texto}
                        </label>
                      )}
                      {tienda.entrega.envio.activo && (
                        <label className={`opcion ${cliente.entrega === 'envio' ? 'on' : ''}`}>
                          <input type="radio" name="entrega" value="envio" checked={cliente.entrega === 'envio'} onChange={cambiar('entrega')} />
                          {tienda.entrega.envio.texto}
                        </label>
                      )}
                    </div>
                  </fieldset>
                  {cliente.entrega === 'envio' && (
                    <label className="campo">
                      <span>Dirección o colonia y ciudad</span>
                      <textarea required rows={2} value={cliente.direccion} onChange={cambiar('direccion')} autoComplete="street-address" />
                    </label>
                  )}
                  <label className="campo">
                    <span>Notas (opcional)</span>
                    <textarea rows={2} value={cliente.notas} onChange={cambiar('notas')} placeholder="Ej. es para una fiesta el sábado" />
                  </label>
                  <details className="vista-previa">
                    <summary>Ver el mensaje que se va a enviar</summary>
                    <pre>{texto}</pre>
                  </details>
                </div>
                <footer className="carrito__pie">
                  <div className="totales">
                    <span>{pedido.piezas} {pedido.piezas === 1 ? 'pieza' : 'piezas'}</span>
                    <strong>{dinero(pedido.total)}</strong>
                  </div>
                  <button type="submit" className="btn btn--whatsapp btn--ancho">
                    <IcoWhatsApp /> Enviar pedido por WhatsApp
                  </button>
                  <div className="carrito__secundarias">
                    <button type="button" className="enlace" onClick={() => setPaso('lista')}>
                      <IcoAtras /> Regresar
                    </button>
                    <button type="button" className="enlace" onClick={copiar}>
                      <IcoCopiar /> {copiado ? 'Pedido copiado' : 'Copiar pedido'}
                    </button>
                  </div>
                  {!tienda.whatsapp && <p className="nota-dev">Falta configurar el número de WhatsApp de la tienda.</p>}
                </footer>
              </form>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
