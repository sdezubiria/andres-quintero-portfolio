# Andrés Quintero — Portfolio (prototipo)

Prototipo en HTML simple para el portfolio del fotógrafo Andrés Quintero.
No necesita servidor ni build: se abre `index.html` en el navegador.

## Páginas

- `index.html` — portada: una fotografía a pantalla completa, el nombre y la navegación
- `work.html` — los proyectos y sus fotografías (ver «Versiones»)
- `about.html` — biografía con retrato

## Las fotografías

**21 proyectos, 163 fotografías.** Las versiones A–D muestran *todas* las
fotografías del proyecto elegido (la página se desplaza cuando no caben);
la versión X muestra una sola por vez y el resto se alcanza desplazando la serie.

Las fotos viven en `assets/img/<proyecto>/`, dos archivos por foto:

- `01.jpg` — lado largo 1600 px, para la vista grande y el lightbox
- `01-t.jpg` — lado largo 520 px, para las tiras de contacto y el muro

Ninguna foto se deforma nunca: cada `<img>` lleva sus medidas reales y sólo se
le pone un tope de altura por versión, así que escala como escalaría el archivo.

### Regenerar las fotografías

`js/photos.js` (la lista de proyectos y las medidas de cada foto) y todo
`assets/img/` los genera un script a partir de una carpeta de originales:

```bash
./tools/build-photos.sh _fotos
```

Cada subcarpeta de `_fotos/` es un proyecto y su nombre es el que se muestra en
la web. Sólo usa `sips`, que ya viene con macOS. La portada y el retrato salen
de las dos rutas (`HERO`, `PORTRAIT`) que hay al principio del script.

Los originales **no** están en el repositorio (ver `.gitignore`): quedan en el
disco del fotógrafo y aquí sólo se guardan las versiones web.

## Versiones

Cada página tiene un widget flotante (abajo a la derecha) con las opciones
**A / B / C / D / X**. Cada una rediseña el layout completo:

- **A · Retícula** — como el Figma: portada a sangre con el nombre centrado
  abajo; en work, los nombres de proyecto a la izquierda, la foto elegida en
  grande a la derecha y debajo la hoja de contacto con todas las demás.
- **B · Editorial** (ref. sebastianfaena.com) — página blanca, nombre en serif
  arriba a la derecha; en work el proyecto se recorre como una secuencia de
  dípticos, dos copias grandes por fila con su pie en serif.
- **C · Archivo** (ref. quentindebrieystudio.com) — nombre grande arriba a la
  izquierda; en work los proyectos son una barra fija y las fotos una
  cuadrícula de cuatro columnas.
- **D · Muro** (ref. VSCO / are.na) — sin división por proyectos: las 163 fotos
  en una cuadrícula justificada, cada fila ajustada al ancho exacto de la página.
- **X · Serie** (ref. emmanuelsmonsalve.com) — la versión del feedback de Andrés,
  y la que se abre por defecto. La intro de A con el nombre arriba; en work una
  sola fotografía por vez — el archivo entero como una serie que se desplaza con
  las dos mitades de la pantalla (el cursor es una flecha blanca), la rueda,
  ← / → o un gesto en el teléfono. Sin lista lateral y sin lightbox: el nombre
  del proyecto va muy sutil bajo la fotografía, y «Miniaturas» abre una portada
  por proyecto. Una sola tipografía (la serif de la marca).

En A–D cada versión tiene su propio **lightbox** (clic en cualquier foto): A, B
y D sobre fondo blanco, C como cuarto oscuro. El lightbox recorre las fotos del
mismo proyecto — clic en cada mitad (cursor de flecha), rueda, ← / → — y el
botón «Miniaturas» muestra la hoja de contactos del proyecto. En X no hay
lightbox: la propia página de work es el visor.

Todo tiene una pasada **móvil** (≤ 700 px): X se vuelve un visor a lo ancho con
gesto de swipe, y A–C colapsan sus retículas a una columna.

La elección se guarda (localStorage) y se mantiene entre páginas; también se
puede compartir con enlace, p. ej. `index.html?v=b`. Las variantes se definen en
CSS con `body[data-v="..."]` — añadir una versión E es añadir un bloque más en
`css/style.css` y una letra en `js/versions.js`.

## Marca (AQ BRAND.pdf)

- Tipografía de títulos: **Libertinus Math** (interlineado 100 %, interletrado 0 %)
- Secundaria: **DM Mono** — categorías en mayúscula (interletrado 12 %), cuerpo (interletrado 3 %, interlineado 125 %)
- Paleta: `#202020` sobre `#FFFFFF`, acento `#BD2828`

## Pendiente

- La biografía de `about.html` es texto de relleno (lorem ipsum).
- Los nombres de proyecto son los de las carpetas de origen, en mayúscula. Para
  cambiarlos (acentos, mayúsculas y minúsculas, orden) se edita `name` en
  `js/photos.js`.
