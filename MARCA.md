# Sistema visual Dulchigoso

Fuente: logo oficial y empaque (ver `docs/marca/referencia-logo-y-empaque.png`).

## Colores
| Nombre | Hex | Uso |
|---|---|---|
| Naranja | `#E08B50` | Color principal. Fondo del logo, inicio, mayoreo y pie |
| Frambuesa | `#B3364E` | Letras del logo, títulos y botón principal |
| Amarillo monstruo | `#E8B444` | El monstruo, cara de la bolsa y sección "Hechas a mano" |
| Naranja vivo | `#F08A24` | Cuernos en el empaque |
| Rojo iris | `#E2412B` | Ojo del monstruo en el empaque e indicador de picor |
| Crema | `#F5F0E7` | Material de la bolsa y superficies |
| Blanco | `#FFFFFF` | Fondo de la tienda y lectura |
| Tinta | `#2E1A16` | Texto |

Sobre naranja, el texto va en tinta, no en blanco: blanco sobre `#E08B50` no se lee bien (contraste 2.6:1).

## Tipografía
- **Chicle**: títulos, nombres de producto y logotipo. Es la más cercana a la letra retro del logo.
- **Schibsted Grotesk**: textos, botones, precios y formularios.

## El monstruo y el logo
Vectorizados directamente del logo oficial (no son un redibujo): `src/assets/marca/monstruo.svg`, `nombre.svg` y `logo.svg`.
El iris del monstruo está marcado (`class="iris"`) para que siga al cursor.
Si la marca entrega sus archivos vectoriales originales, se reemplazan esos tres archivos y todo el sitio se actualiza.

## Ilustraciones
Planas, como el logo: sin degradados, sin brillos ni relieves falsos. El volumen es una segunda capa más oscura y el chamoy son hojuelas planas.
Las gomitas 3D del inicio usan sombreado plano de 3 tonos con las mismas hojuelas.
Cuando haya fotos reales de producto, sustituyen a las ilustraciones (campo `foto` en `productos.js`).

## Concepto de la página
El inicio **es la bolsa**: franja crema con el nombre, la cara del monstruo y, en la ventana, las gomitas en 3D con física real.
Cada producto se muestra en su propia bolsa (`src/components/Bolsa.jsx`), igual que el empaque real.
