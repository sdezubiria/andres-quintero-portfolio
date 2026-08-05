# Andrés Quintero — Portfolio (prototype)

Prototipo en HTML simple para el portfolio del fotógrafo Andrés Quintero.

## Páginas

- `index.html` — página de entrada: fotografía a pantalla completa, nombre y navegación (ref. piariverola.com)
- `work.html` — retícula de 7 columnas: 3 a la izquierda para los nombres de proyecto, 4 a la derecha para las imágenes; al hacer clic en un proyecto se cargan sus imágenes
- `about.html` — biografía con retrato fijo (sticky) y texto que se desplaza (ref. fantasticman.com)

Como solo existe una fotografía por ahora, todas las demás imágenes son
marcos de posición con X, estilo InDesign (clase CSS `.ph`).

## Widget de versiones

Cada página tiene un widget flotante (abajo a la derecha) con las opciones
**A / B / C** para que el cliente compare direcciones de diseño:

- **A** — como el Figma: nombre centrado abajo sobre la foto a sangre
- **B** — esquinas: nombre arriba a la izquierda, menú en mono arriba a la derecha
- **C** — enmarcada: la foto como copia impresa con margen blanco

La elección se guarda (localStorage) y se mantiene entre páginas; también
se puede compartir con enlace, p. ej. `index.html?v=b`. Las variantes se
definen en CSS con `body[data-v="..."]` — añadir una versión D es añadir
un bloque más en `css/style.css` y una letra en `js/versions.js`.

## Marca (AQ BRAND.pdf)

- Tipografía de títulos: **Libertinus Math** (interlineado 100 %, interletrado 0 %)
- Secundaria: **DM Mono** — categorías en mayúscula (interletrado 12 %), cuerpo (interletrado 3 %, interlineado 125 %)
- Paleta: `#202020` sobre `#FFFFFF`, acento `#BD2828`

## Uso

Abrir `index.html` en el navegador — no necesita servidor ni build.
