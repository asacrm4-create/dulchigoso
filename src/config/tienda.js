// ─────────────────────────────────────────────────────────────
//  CONFIGURACIÓN DE LA TIENDA
//  Este es el archivo que se edita para cambiar datos del negocio.
//  Todo lo marcado con  PENDIENTE  hay que confirmarlo con Dulchigoso.
// ─────────────────────────────────────────────────────────────

export const tienda = {
  nombre: 'Dulchigoso',
  eslogan: 'Picositos y aciditos',

  // Logo oficial: pon el archivo en /public (ej. /public/logo.svg) y escribe la ruta aquí.
  // Mientras esté vacío se usa el logotipo tipográfico provisional.
  logoUrl: '', // PENDIENTE

  // Número de WhatsApp que recibe los pedidos, con lada de país y sin espacios.
  // Ejemplo México: '5215512345678'
  whatsapp: '', // PENDIENTE

  correo: 'dulchigoso@gmail.com', // publicado en su sitio
  ciudad: 'San Juan de los Lagos', // según su ficha pública; confirmar

  // Muestra un aviso discreto en la tienda mientras los precios no sean los reales.
  preciosDeEjemplo: true, // cambiar a false cuando se carguen los precios reales

  moneda: 'MXN',

  mayoreo: {
    // Al juntar esta cantidad de piezas (se pueden mezclar), TODO el pedido pasa a precio de mayoreo.
    minimoPiezas: 24, // PENDIENTE
    // En la vista de mayoreo, el botón suma de este tanto en este tanto.
    paquete: 6, // PENDIENTE
  },

  entrega: {
    recoger: { activo: true, texto: 'Recoger en punto de entrega' }, // PENDIENTE dirección
    envio: { activo: true, texto: 'Envío a domicilio (costo según zona)' },
  },

  redes: {
    instagram: 'https://instagram.com/dulchigoso', // @dulchigoso
    tiktok: '',
    facebook: '',
  },

  // Puntos de venta publicados por la marca. Agregar direcciones y horarios cuando se tengan.
  puntosDeVenta: [
    { ciudad: 'San Juan de los Lagos', lugar: 'Varios puntos de venta en la ciudad', detalle: 'Pregunta por WhatsApp cuál te queda más cerca' },
    { ciudad: 'Jalostotitlán', lugar: 'Tienda', detalle: '' },
    { ciudad: 'Guadalajara', lugar: 'Olympeak Fitness Club', detalle: '' },
    { ciudad: 'Guadalajara', lugar: 'Tec de Monterrey, Campus Guadalajara', detalle: '' },
    { ciudad: 'En línea', lugar: 'Mercado de San Juan', detalle: 'Bolsas y tiras de fresa por pieza', url: 'https://mercadosanjuanenlinea.com' },
  ],
}
