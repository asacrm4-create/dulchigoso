# Dulchigoso · sitio web

Tienda de gomitas cubiertas con chamoy: compra por pieza y por mayoreo, y pedido por WhatsApp.

## Lo que se edita (sin tocar código)

| Qué | Archivo |
|---|---|
| WhatsApp, correo, ciudad, mínimo de mayoreo, redes, puntos de venta | `src/config/tienda.js` |
| Productos, precios de menudeo y mayoreo, presentaciones, picor y acidez | `src/data/productos.js` |
| Fotos reales de producto | Pon el archivo en `public/fotos/` y escribe en el producto `foto: '/fotos/ositos.jpg'` |
| Logo oficial (si se quiere usar el archivo en lugar del dibujo) | Pon el archivo en `public/` y escribe la ruta en `logoUrl` de `tienda.js` |

### Pendiente de confirmar con Dulchigoso
- [ ] Número de WhatsApp que recibe pedidos (`whatsapp` en `tienda.js`). Sin él, el botón abre WhatsApp sin destinatario.
- [ ] Precios reales y quitar el aviso de precios de ejemplo (`preciosDeEjemplo: false`). La bolsa de 250 g ($89.50) y las tiras de fresa ($49.50) son los precios publicados en Mercado San Juan; el resto es de ejemplo.
- [ ] Mínimo de piezas para mayoreo (hoy 24) y de cuánto en cuánto se pide (hoy 6).
- [ ] Qué presentaciones tiene cada producto (hoy todas tienen bolsa de 250 g, charola de 350 g y bites de 100 g; las tiras de fresa solo bolsa de 100 g).
- [ ] Direcciones de los puntos de venta.
- [ ] Historia de la fundadora: confirmar el texto de "Hechas a mano".
- [ ] Logo y monstruo en archivo vectorial original (SVG/AI/PDF), si los tienen. Hoy el monstruo está redibujado a mano en vector calcando el logo, y las letras del nombre vectorizadas de una imagen.

## Cómo funciona la compra
- **Por pieza:** se elige presentación y cantidad, y se agrega al pedido.
- **Mayoreo:** hoja tipo tabla para surtir rápido, de 6 en 6.
- **Regla de precio:** si el pedido junta el mínimo de piezas (mezclando lo que sea), todo pasa a precio de mayoreo de forma automática. La barra de avance muestra cuánto falta.
- **Pedido:** al final se llena nombre y tipo de entrega, y se envía por WhatsApp con folio, detalle y total. También se puede copiar.
- El pedido se guarda en el navegador aunque se cierre la página.

## Sorpresas del monstruo
- Toca al monstruo del inicio y suelta más gomitas; se pueden arrastrar y aventar.
- 5 clics seguidos al logo: el monstruo se asoma desde abajo.
- El monstruo parpadea y su ojo sigue al cursor en todo el sitio.
- Escribir `chamoy` en cualquier parte de la página: el monstruo sale a dar una mordida.
- El monstruo se asoma sobre el pie de página y te sigue con el ojo.
- Si cambias de pestaña, el título de la página te extraña.

## Vista previa sin instalar nada
`vista-previa/Dulchigoso-vista-previa.html` es la página completa en un solo archivo: se abre con doble clic en cualquier navegador. Se regenera con `npx vite build -c vite.unarchivo.config.js`.

## Correr y publicar
```bash
npm install
```
```bash
npm run dev
```
```bash
npm run build
```
La carpeta `dist/` se sube tal cual a Vercel, Netlify o Cloudflare Pages (gratis). Si se conecta el repositorio, cada cambio se publica solo.

## Tecnología
Vite + React · Three.js / React Three Fiber + Rapier (física de las gomitas) · GSAP ScrollTrigger · Lenis · Motion · Zustand.
Tipografías locales: Bagel Fat One (títulos, cercana al wordmark), Fredoka (botones y lema) y Schibsted Grotesk (texto).
Guías de diseño instaladas en `.claude/skills/` (impeccable y la de Emil Kowalski) para futuras mejoras.
