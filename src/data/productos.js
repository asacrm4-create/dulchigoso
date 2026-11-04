// ─────────────────────────────────────────────────────────────
//  CATÁLOGO
//  Cada producto tiene:
//   - id: identificador único, sin espacios
//   - nombre / descripcion
//   - forma: dibujo que se usa mientras no haya foto
//       (osito, lombriz, aro, frutita, manguito, tira)
//   - colores: los dos colores principales de la gomita (para el dibujo)
//   - picor: 1 suavecito · 2 picosito · 3 bien enchilado
//   - acidez: 1 a 3
//   - foto: ruta de la foto real en /public/fotos (opcional). Ej: '/fotos/ositos.jpg'
//   - presentaciones: cada una con precio de menudeo (precio) y de mayoreo (mayoreo), por pieza
//   - etiqueta: texto corto opcional (ej. 'Favorita', 'Nuevo')
//
//  Los productos son los que Dulchigoso publica (sitio oficial y puntos de venta):
//  ositos, lombrices, aros de durazno, aros de manzana, manguitos, frutitas y tiras de fresa.
//  Presentaciones publicadas: bolsa de 250 g, charola de 350 g y bites de 100 g.
//  El precio de la bolsa de 250 g ($89.50) y de las tiras de fresa ($49.50) es el publicado
//  por Mercado San Juan. Los demás precios y TODOS los de mayoreo son de ejemplo.
// ─────────────────────────────────────────────────────────────

const bolsa = (precio, mayoreo) => ({ id: 'bolsa250', nombre: 'Bolsa 250 g', peso: '250 g', precio, mayoreo })
const charola = (precio, mayoreo) => ({ id: 'charola350', nombre: 'Charola 350 g', peso: '350 g', precio, mayoreo })
const bites = (precio, mayoreo) => ({ id: 'bites100', nombre: 'Bites 100 g', peso: '100 g', precio, mayoreo })
const estandar = [bolsa(89.5, 68), charola(119, 92), bites(42, 32)]

export const productos = [
  {
    id: 'ositos',
    nombre: 'Ositos',
    descripcion: 'El clásico osito de goma, bañado en chamoy y chile.',
    forma: 'osito',
    colores: ['#F2893A', '#E2412B'],
    picor: 2,
    acidez: 2,
    etiqueta: 'El clásico',
    presentaciones: estandar,
  },
  {
    id: 'lombrices',
    nombre: 'Lombrices',
    descripcion: 'Largas, de dos colores, con chamoy en cada vuelta.',
    forma: 'lombriz',
    colores: ['#3FBF6E', '#F7B52C'],
    picor: 2,
    acidez: 3,
    etiqueta: 'Favorita',
    presentaciones: estandar,
  },
  {
    id: 'aros-durazno',
    nombre: 'Aros de durazno',
    descripcion: 'Suaves por dentro, con chamoy por fuera.',
    forma: 'aro',
    colores: ['#F7923C', '#FFE1B8'],
    picor: 1,
    acidez: 2,
    presentaciones: estandar,
  },
  {
    id: 'aros-manzana',
    nombre: 'Aros de manzana',
    descripcion: 'Manzana verde ácida con su capa de chamoy.',
    forma: 'aro',
    colores: ['#8FCF3A', '#F2FAD9'],
    picor: 1,
    acidez: 3,
    presentaciones: estandar,
  },
  {
    id: 'manguitos',
    nombre: 'Manguitos',
    descripcion: 'Mango con chamoy, como el de la esquina pero en gomita.',
    forma: 'manguito',
    colores: ['#F7B52C', '#FFD56A'],
    picor: 3,
    acidez: 2,
    presentaciones: estandar,
  },
  {
    id: 'frutitas',
    nombre: 'Frutitas',
    descripcion: 'Surtido de frutitas de goma para los indecisos.',
    forma: 'frutita',
    colores: ['#E8304A', '#5FB04A'],
    picor: 2,
    acidez: 2,
    presentaciones: estandar,
  },
  {
    id: 'tiras-fresa',
    nombre: 'Tiras de fresa',
    descripcion: 'Tiras ácidas de fresa, enchiladas de punta a punta.',
    forma: 'tira',
    colores: ['#F2385A', '#FFD6DF'],
    picor: 2,
    acidez: 3,
    presentaciones: [{ id: 'tira100', nombre: 'Bolsa 100 g', peso: '100 g', precio: 49.5, mayoreo: 38 }],
  },
]

export const productoPorId = Object.fromEntries(productos.map((p) => [p.id, p]))
