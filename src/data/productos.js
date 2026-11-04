// ─────────────────────────────────────────────────────────────
//  CATÁLOGO
//  Cada producto tiene:
//   - id: identificador único, sin espacios
//   - nombre / descripcion
//   - forma: dibujo que se usa mientras no haya foto
//       (osito, lombriz, aro, frutita, manguito, sandia, cherry, llave, tiburon, tira)
//   - colores: los dos colores principales de la gomita (para el dibujo)
//   - picor: 1 suavecito · 2 picosito · 3 bien enchilado
//   - acidez: 1 a 3
//   - foto: ruta de la foto real en /public/fotos (opcional). Ej: '/fotos/ositos.jpg'
//   - presentaciones: cada una con precio de menudeo (precio) y de mayoreo (mayoreo), por pieza
//   - etiqueta: texto corto opcional (ej. 'Favorita', 'Nuevo')
//
//  Los productos salen de lo publicado por Dulchigoso (su empaque dice 'gomitas cubiertas con chamoy').
//  LOS PRECIOS SON DE EJEMPLO.
// ─────────────────────────────────────────────────────────────

const bolsa = (precio, mayoreo) => ({ id: 'bolsa250', nombre: 'Bolsa 250 g', precio, mayoreo })
const charola = (precio, mayoreo) => ({ id: 'charola350', nombre: 'Charola 350 g', precio, mayoreo })
const bites = (precio, mayoreo) => ({ id: 'bites', nombre: 'Bites', precio, mayoreo })

export const productos = [
  {
    id: 'ositos',
    nombre: 'Ositos',
    descripcion: 'El clásico osito de goma, bañado en chamoy y chile.',
    forma: 'osito',
    colores: ['#FF8A1F', '#E8243B'],
    picor: 2,
    acidez: 2,
    etiqueta: 'El clásico',
    presentaciones: [bolsa(85, 64), charola(115, 88), bites(30, 23)],
  },
  {
    id: 'lombrices',
    nombre: 'Lombrices',
    descripcion: 'Largas, de dos colores, con chamoy en cada vuelta.',
    forma: 'lombriz',
    colores: ['#2FBF71', '#FFB21E'],
    picor: 2,
    acidez: 3,
    etiqueta: 'Favorita',
    presentaciones: [bolsa(85, 64), charola(115, 88), bites(30, 23)],
  },
  {
    id: 'aros-durazno',
    nombre: 'Aros de durazno',
    descripcion: 'Suaves por dentro, con chamoy por fuera.',
    forma: 'aro',
    colores: ['#FF9A3C', '#FFE9C9'],
    picor: 1,
    acidez: 2,
    presentaciones: [bolsa(85, 64), charola(115, 88), bites(30, 23)],
  },
  {
    id: 'aros-manzana',
    nombre: 'Aros de manzana',
    descripcion: 'Manzana verde ácida con su capa de chamoy.',
    forma: 'aro',
    colores: ['#8CD13A', '#F4FFE0'],
    picor: 1,
    acidez: 3,
    presentaciones: [bolsa(85, 64), charola(115, 88), bites(30, 23)],
  },
  {
    id: 'manguitos',
    nombre: 'Manguitos',
    descripcion: 'Mango con chamoy, como el de la esquina pero en gomita.',
    forma: 'manguito',
    colores: ['#FFB21E', '#FF7A1A'],
    picor: 3,
    acidez: 2,
    presentaciones: [bolsa(85, 64), charola(115, 88), bites(30, 23)],
  },
  {
    id: 'sandias',
    nombre: 'Sandías',
    descripcion: 'Rebanaditas de sandía con chamoy.',
    forma: 'sandia',
    colores: ['#F2385A', '#3DAA4A'],
    picor: 2,
    acidez: 2,
    presentaciones: [bolsa(85, 64), charola(115, 88), bites(30, 23)],
  },
  {
    id: 'frutitas',
    nombre: 'Frutitas',
    descripcion: 'Surtido de frutitas de goma para los indecisos.',
    forma: 'frutita',
    colores: ['#E8243B', '#FFB21E'],
    picor: 2,
    acidez: 2,
    presentaciones: [bolsa(85, 64), charola(115, 88), bites(30, 23)],
  },
  {
    id: 'frutastika',
    nombre: 'Frutastika',
    descripcion: 'La mezcla de la casa. Pregunta qué trae esta semana.',
    forma: 'frutita',
    colores: ['#B04BE0', '#8CD13A'],
    picor: 2,
    acidez: 3,
    presentaciones: [bolsa(85, 64), charola(115, 88), bites(30, 23)],
  },
  {
    id: 'cherry-bombs',
    nombre: 'Cherry bombs',
    descripcion: 'Cerecitas en par que explotan de sabor.',
    forma: 'cherry',
    colores: ['#D9122F', '#3DAA4A'],
    picor: 3,
    acidez: 2,
    presentaciones: [bolsa(85, 64), charola(115, 88), bites(30, 23)],
  },
  {
    id: 'llaves',
    nombre: 'Llaves',
    descripcion: 'Llavecitas ácidas con chamoy.',
    forma: 'llave',
    colores: ['#FF5FA2', '#FFD23F'],
    picor: 1,
    acidez: 3,
    presentaciones: [bolsa(85, 64), charola(115, 88), bites(30, 23)],
  },
  {
    id: 'tiburoncitos',
    nombre: 'Tiburoncitos',
    descripcion: 'Azul y blanco, con mordida picosita.',
    forma: 'tiburon',
    colores: ['#2E7CF6', '#F2F7FF'],
    picor: 2,
    acidez: 1,
    presentaciones: [bolsa(85, 64), charola(115, 88), bites(30, 23)],
  },
  {
    id: 'tiras-fresa',
    nombre: 'Tiras de fresa',
    descripcion: 'Tiras ácidas de fresa, enchiladas de punta a punta.',
    forma: 'tira',
    colores: ['#F2385A', '#FFD6DF'],
    picor: 2,
    acidez: 3,
    presentaciones: [{ id: 'tira100', nombre: 'Bolsa 100 g', precio: 49, mayoreo: 37 }],
  },
]

export const productoPorId = Object.fromEntries(productos.map((p) => [p.id, p]))
