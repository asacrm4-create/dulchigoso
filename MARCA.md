# Sistema visual Dulchigoso

Fuente: logo oficial y empaque (ver `docs/marca/referencia-logo-y-empaque.png`).

## Colores
| Nombre | Hex | Uso |
|---|---|---|
| Naranja | `#E08B50` | Color principal. Fondo del logo, inicio, mayoreo y pie |
| Frambuesa | `#B3364E` | Letras del logo, títulos, iris y boca del monstruo, botón principal |
| Amarillo monstruo | `#EAB54A` | El monstruo del logo y sección "Hechas a mano" |
| Amarillo bolsa | `#F3B42E` | La cara del monstruo impresa en la bolsa |
| Naranja cuerno | `#CF7350` | Cuernos del monstruo sobre fondo naranja (logo) |
| Naranja vivo | `#F39322` | Cuernos y letras alternas del nombre en la bolsa |
| Rojo iris | `#E2412B` | Ojo del monstruo en la bolsa e indicador de picor |
| Crema | `#F5F0E7` | Material de la bolsa y superficies |
| Blanco | `#FFFFFF` | Fondo de la tienda y lectura |
| Tinta | `#2E1A16` | Texto |

Sobre naranja, el texto va en tinta, no en blanco: blanco sobre `#E08B50` no se lee bien (contraste 2.6:1).

## Tipografía
- **Bagel Fat One**: títulos y nombres de producto. Es la más cercana a la letra burbujeante del wordmark.
- **Fredoka**: botones, navegación, etiquetas y el lema "picositos y aciditos" (la misma letra redonda del logo).
- **Schibsted Grotesk**: párrafos, precios y formularios.

## El monstruo
`src/assets/marca/monstruo.svg` está dibujado a mano en vector, pieza por pieza, calcado sobre el logo oficial
(no es un autotrace): cuerpo amarillo con flecos, dos cuernos con bolita (el izquierdo grande, el derecho corto,
como en el original), un ojo con iris frambuesa y brillo que muerde el borde, y la sonrisa con lengua y diente.
Clases para animarlo: `.iris` (sigue al cursor), `.parpado` (parpadea), `.cuernos`, `.boca`.

Los cuernos están también como componentes (`CuernoIzq`, `CuernoDer` en `Monstruo.jsx`) para reutilizarlos en la bolsa.

## El logo y el nombre
- `nombre.svg`: las letras "dulchi / goso" vectorizadas del logo original (10 trazos, uno por letra, con clase `letra-…`) más el lema en texto real (Fredoka, color `--lema`).
- `nombre-linea.svg`: las mismas letras en una sola línea, como va impreso en la bolsa.
- `logo.svg`: monstruo + nombre + lema, con la composición del logo oficial.

Si la marca entrega sus archivos vectoriales originales, se reemplazan estos archivos y todo el sitio se actualiza.

## La bolsa (`src/components/Bolsa.jsx`)
Réplica del empaque real: bolsa stand-up crema con sello corrugado y cierre, flecha "abre fácil", sellos de
advertencia, garabatos de gomitas, el nombre en una línea con letras rojas y naranjas y los cuernos asomando,
la cara amarilla con el ojo rojo, la ventana llena de gomitas, el nombre del producto y "gomitas cubiertas con chamoy".
`detalle={false}` quita los textos chicos para los tamaños miniatura (carrito, hoja de mayoreo).

## Ilustraciones de gomitas (`GomitaArte.jsx`)
Planas, como el logo: dos tonos, un lado más oscuro para el volumen, un brillo chico de azúcar, un baño de chamoy
más cargado hacia abajo y hojuelas de chile. Cuando haya fotos reales de producto, sustituyen a las ilustraciones
(campo `foto` en `productos.js`).

## Concepto de la página
El inicio es el logo en grande: el nombre, el lema y el monstruo oficial, con una lluvia de gomitas con física que se
pueden arrastrar y que rebotan en el monstruo. Cada producto se muestra en su propia bolsa, igual que el empaque real.
