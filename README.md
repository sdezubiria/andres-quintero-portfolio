# Andrés Quintero — Portfolio (prototipo)

Prototipo en HTML simple para el portfolio del fotógrafo Andrés Quintero.
No necesita servidor ni build: se abre `index.html` en el navegador.

## Páginas

- `index.html` — portada: una fotografía a pantalla completa, el nombre y la navegación
- `work.html` — los proyectos y sus fotografías (ver «El diseño»)
- `about.html` — biografía con retrato

## Las fotografías

**21 proyectos, 163 fotografías.** El visor muestra una sola por vez y el
resto se alcanza desplazando la serie.

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

## El diseño

Un único diseño (ref. emmanuelsmonsalve.com), elegido tras la ronda de
versiones A–X del prototipo (el sistema de versiones ya se retiró):

- **Portada** — la fotografía a sangre con el nombre centrado arriba y el
  menú abajo.
- **Work** — el archivo entero como una serie: una fotografía por vez, que se
  desplaza con las dos mitades de la pantalla (el cursor es la flecha), la
  rueda, ← / → o un gesto en el teléfono. Dos fotos verticales seguidas del
  mismo proyecto cuelgan juntas como díptico. Arriba, unos pocos títulos de
  proyecto con «Show more» para el resto — el nombre del proyecto vive solo
  ahí (y en el pie del lightbox), no bajo la fotografía. «Thumbnails» (abajo a
  la izquierda) abre una portada por proyecto para saltar directo.
- **Lightbox** — clic dentro de la copia: la foto en grande, recorrible con
  las mismas mitades, la rueda o las flechas; su propio botón «Thumbnails»
  muestra la hoja de contactos del proyecto y otro clic dentro de la copia
  hace zoom al archivo completo.
- **About** — retrato y texto centrados el uno en el otro.

Todo tiene una pasada **móvil** (≤ 700 px): el visor se vuelve un carrusel a
lo ancho con gesto de swipe.

## Marca (AQ BRAND.pdf)

- Tipografía de títulos: **Libertinus Math** (interlineado 100 %, interletrado 0 %)
- Secundaria: **DM Mono** — categorías en mayúscula (interletrado 12 %), cuerpo (interletrado 3 %, interlineado 125 %)
- Paleta: `#202020` sobre `#FFFFFF`, acento `#BD2828`

## Pendiente

- La biografía de `about.html` es texto de relleno (lorem ipsum).
- Los nombres de proyecto son los de las carpetas de origen, en mayúscula. Para
  cambiarlos (acentos, mayúsculas y minúsculas, orden) se edita `name` en
  `js/photos.js`.
