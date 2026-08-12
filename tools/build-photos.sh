#!/bin/zsh
# Rebuilds assets/img/ and js/photos.js from a folder of source photographs.
#
#   tools/build-photos.sh <carpeta-fuente>      (por defecto: _fotos)
#
# Cada subcarpeta de la fuente es un proyecto. De cada foto se generan dos
# versiones: una grande (lado largo 1600 px, para la vista y el lightbox) y
# una miniatura (lado largo 520 px, para las tiras y el muro). Sólo se usa
# `sips`, que viene con macOS — no hace falta instalar nada.

set -e
setopt null_glob

SRC=${1:-_fotos}
ROOT=${0:A:h:h}
OUT="$ROOT/assets/img"
MANIFEST="$ROOT/js/photos.js"
BIG=1600
THUMB=520
QUALITY=55
QUALITY_THUMB=62

# Portada (index.html) y retrato (about.html) — rutas dentro de la carpeta
# fuente. Para cambiarlos basta con editar estas dos líneas y volver a ejecutar.
HERO="ELAR BOLIVAR/DSC06600 copy 2.jpg"
PORTRAIT="MONTE CURANDERO/Img_003.jpg"

[[ -d "$SRC" ]] || { echo "No existe la carpeta fuente: $SRC" >&2; exit 1; }

rm -rf "$OUT"
mkdir -p "$OUT"

slug() {
  # A NFD (UTF-8-MAC descompone Ñ en N + tilde), se borran las marcas
  # combinantes — así "ESPAÑOL" queda "espanol" y no "espa-ol" —, y el resto
  # de símbolos y espacios pasan a guiones.
  print -r -- "$1" \
    | iconv -f UTF-8 -t UTF-8-MAC \
    | LC_ALL=C tr -d '\200-\377' \
    | tr '[:upper:]' '[:lower:]' \
    | LC_ALL=C sed -e 's/[^a-z0-9]/-/g' -e 's/--*/-/g' -e 's/^-//' -e 's/-$//'
}

title() {
  # se conserva el nombre de la carpeta tal cual lo escribió el fotógrafo;
  # sólo se recorta y se convierte "NOIR - x" en "NOIR — x"
  print -r -- "$1" | sed -e 's/^ *//' -e 's/ *$//' -e 's/ - / — /'
}

{
  print -r -- "// Generado por tools/build-photos.sh — no editar a mano salvo los"
  print -r -- "// nombres de proyecto (name) y el orden, que sí se pueden ajustar."
  print -r -- "window.AQ_PROJECTS = ["
} > "$MANIFEST"

first_entry=1
for dir in "$SRC"/*(/); do
  name=${dir:t}
  s=$(slug "$name")
  t=$(title "$name")
  mkdir -p "$OUT/$s"

  photos=()
  i=0
  for f in "$dir"/*.(jpg|jpeg|JPG|JPEG|png|PNG); do
    i=$((i + 1))
    n=$(printf "%02d" $i)
    big="$OUT/$s/$n.jpg"
    thumb="$OUT/$s/$n-t.jpg"

    sips -s format jpeg -s formatOptions $QUALITY       -Z $BIG   "$f" --out "$big"   > /dev/null
    sips -s format jpeg -s formatOptions $QUALITY_THUMB -Z $THUMB "$f" --out "$thumb" > /dev/null

    dims=$(sips -g pixelWidth -g pixelHeight "$big" | awk '/pixel/ {print $2}')
    w=$(print -r -- "$dims" | sed -n 1p)
    h=$(print -r -- "$dims" | sed -n 2p)
    photos+=("[$w,$h]")
  done

  (( i == 0 )) && { rmdir "$OUT/$s"; continue; }

  (( first_entry )) || print -r -- "," >> "$MANIFEST"
  first_entry=0
  {
    printf '  { name: "%s", slug: "%s", photos: [%s] }' "$t" "$s" "${(j:,:)photos}"
  } >> "$MANIFEST"
  echo "  $t → $s ($i)"
done

{
  print -r -- ""
  print -r -- "];"
} >> "$MANIFEST"

# ————— Portada y retrato, desde el original (no desde la versión ya reducida) —————
if [[ -f "$SRC/$HERO" ]]; then
  sips -s format jpeg -s formatOptions 65 -Z 1920 "$SRC/$HERO" --out "$ROOT/assets/hero.jpg" > /dev/null
  echo "  portada  → assets/hero.jpg"
else
  echo "  aviso: no se encontró la portada '$HERO'" >&2
fi
if [[ -f "$SRC/$PORTRAIT" ]]; then
  sips -s format jpeg -s formatOptions 65 -Z 1400 "$SRC/$PORTRAIT" --out "$ROOT/assets/portrait.jpg" > /dev/null
  echo "  retrato  → assets/portrait.jpg"
else
  echo "  aviso: no se encontró el retrato '$PORTRAIT'" >&2
fi

echo "Listo: $(find "$OUT" -name '*.jpg' | wc -l | tr -d ' ') archivos en assets/img"
du -sh "$OUT"
