# Andrés Quintero — Portfolio (prototipo)

Prototipo en HTML simple para el portfolio del fotógrafo Andrés Quintero.
No necesita servidor ni build: se abre `index.html` en el navegador.

## Páginas

- `index.html` — portada: una fotografía a pantalla completa, el nombre y la navegación
- `work.html` — los proyectos y sus fotografías (ver «Versiones»)
- `about.html` — biografía con retrato

## Las fotografías

**21 proyectos, 163 fotografías.** Cada versión muestra *todas* las fotografías
del proyecto elegido; cuando no caben en la pantalla, la página se desplaza.

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
**A / B / C / D**. Cada una rediseña el layout completo:

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

Cada versión tiene su propio **lightbox** (clic en cualquier foto): A, B y D
sobre fondo blanco, C como cuarto oscuro.

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
