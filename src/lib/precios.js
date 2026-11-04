import { tienda } from '../config/tienda'
import { productoPorId } from '../data/productos'

export const dinero = (n) =>
  new Intl.NumberFormat('es-MX', { style: 'currency', currency: tienda.moneda, maximumFractionDigits: n % 1 ? 2 : 0 }).format(n)

export function resolverLinea(item) {
  const producto = productoPorId[item.productoId]
  if (!producto) return null
  const pres = producto.presentaciones.find((p) => p.id === item.presId)
  if (!pres) return null
  return { ...item, producto, pres }
}

// Regla de precio: si el pedido junta el mínimo de piezas, TODO pasa a mayoreo.
export function calcularPedido(items) {
  const lineas = items.map(resolverLinea).filter(Boolean)
  const piezas = lineas.reduce((s, l) => s + l.qty, 0)
  const minimo = tienda.mayoreo.minimoPiezas
  const esMayoreo = piezas >= minimo
  let total = 0
  let totalMenudeo = 0
  const detalle = lineas.map((l) => {
    const unit = esMayoreo ? l.pres.mayoreo : l.pres.precio
    const sub = unit * l.qty
    total += sub
    totalMenudeo += l.pres.precio * l.qty
    return { ...l, unit, sub }
  })
  return {
    lineas: detalle,
    piezas,
    esMayoreo,
    minimo,
    faltan: Math.max(0, minimo - piezas),
    progreso: Math.min(1, piezas / minimo),
    total,
    ahorro: totalMenudeo - total,
  }
}

export function mensajePedido(pedido, cliente) {
  const folio = 'DG-' + Date.now().toString(36).slice(-5).toUpperCase()
  const lineas = pedido.lineas
    .map((l) => `• ${l.qty} × ${l.producto.nombre} (${l.pres.nombre}) — ${dinero(l.sub)}`)
    .join('\n')
  const partes = [
    `Hola ${tienda.nombre}, quiero hacer un pedido.`,
    `Folio: ${folio}`,
    '',
    lineas,
    '',
    `Piezas: ${pedido.piezas}${pedido.esMayoreo ? ' · PRECIO DE MAYOREO' : ''}`,
    `Total: ${dinero(pedido.total)}`,
    pedido.ahorro > 0 ? `Ahorro por mayoreo: ${dinero(pedido.ahorro)}` : null,
    '',
    `Nombre: ${cliente.nombre}`,
    cliente.telefono ? `Teléfono: ${cliente.telefono}` : null,
    `Entrega: ${cliente.entrega === 'envio' ? 'Envío' : 'Recoger'}`,
    cliente.entrega === 'envio' && cliente.direccion ? `Dirección: ${cliente.direccion}` : null,
    cliente.notas ? `Notas: ${cliente.notas}` : null,
  ]
  return partes.filter((x) => x !== null).join('\n')
}

export function enlaceWhatsApp(texto) {
  const base = tienda.whatsapp ? `https://wa.me/${tienda.whatsapp}` : 'https://wa.me/'
  return `${base}?text=${encodeURIComponent(texto)}`
}
