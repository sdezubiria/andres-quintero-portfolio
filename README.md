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
**A / B / C**. Cada versión rediseña el layout completo (ninguna página
tiene scroll vertical — todo cabe en la ventana):

- **A · Retícula** — como el Figma: portada a sangre con el nombre centrado
  abajo; work en retícula de 7 columnas (3 nombres + 4 imágenes con tira de
  miniaturas). Hover: fundido suave de las imágenes.
- **B · Editorial** (ref. sebastianfaena.com) — página blanca, nombre en
  serif arriba a la derecha, la foto centrada como pliego; work muestra dos
  imágenes grandes en díptico. Hover: el interletrado se abre y la copia
  retrocede levemente.
- **C · Archivo** (ref. quentindebrieystudio.com) — nombre grande arriba a
  la izquierda, enlaces en mono debajo; work es una cuadrícula de miniaturas
  filtrada por la barra de proyectos. Hover: subrayado y etiqueta sobre la celda.
- **D · Muro** (ref. VSCO / are.na) — sin división por proyectos: todas las
  fotos en una cuadrícula justificada que reparte cada fila según la
  proporción de cada foto y llena la ventana exacta, sin scroll. Portada y
  about centrados. Hover: la pieza respira (leve zoom).

Cada versión tiene su propio **lightbox** (clic en cualquier imagen): A y B
sobre fondo blanco (B con caption en serif y más aire), C como cuarto oscuro.
Las fotos nunca se deforman: cada marcador lleva la proporción real de la
foto (SVG transparente con las medidas) y escala como escalaría el archivo.

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
