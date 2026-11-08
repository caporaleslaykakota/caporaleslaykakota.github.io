# Caporales Laykakota — Web pública estática

Prototipo completo HTML + CSS + JavaScript, preparado para GitHub Pages.

## Importante: cómo abrirlo
La web carga todos los textos desde JSON mediante `fetch()`. Por seguridad del navegador, **no conviene abrir `index.html` con doble clic (`file://`)**. Levanta un servidor local desde la carpeta del repositorio:

```bash
python -m http.server 8080
```

Luego abre `http://localhost:8080`. En VS Code también puedes usar **Live Server**.

## Dónde cambio textos, enlaces y datos
- `data/site.json`: todos los textos institucionales, llamadas a la acción, contactos, URLs y SEO.
- `data/events.json`: agenda.
- `data/gallery.json`: catálogo de fotografías y categorías.
- **No necesitas modificar el HTML para cambiar contenido editorial.**

## Paleta propuesta desde las 3 referencias entregadas
- Negro tinta `#070B15`: base elegante del traje y flyer.
- Azul profundo `#075BB5`: traje de luces.
- Azul luminoso `#0B8BD4`: acento visual.
- Violeta `#49358E` / morado `#603A82`: logo.
- Dorado `#F39A00`: logo y material promocional.
- Plateado `#CBD3DC`: contraste inspirado en aplicaciones metálicas.

El dorado se usa como acento, no como fondo dominante, para evitar que la web parezca un flyer.

## Galería: estándar recomendado
Para el lanzamiento recomiendo **24 fotografías reales**: 6 Presentaciones Lima, 4 Provincia, 4 Ensayos, 4 Candelaria, 4 RCC y 2 institucionales/detalle. Es suficiente para variedad sin hacer pesada la primera versión.

### Nomenclatura
Usa minúsculas, sin espacios ni tildes:
`<categoria>-<aaaa>-<evento>-<nn>.webp`

Ejemplos:
- `lima-2026-presentacion-miraflores-01.webp`
- `provincia-2026-puno-01.webp`
- `ensayo-2026-noviembre-01.webp`
- `candelaria-2026-puno-01.webp`
- `rcc-2026-herencia-ancestral-01.webp`

### Tamaño y peso
**Galería estándar (recomendado)**
- Formato: WebP (JPEG original solo como archivo maestro fuera del repositorio).
- Lado largo: 1600 px.
- Calidad WebP: 78–84.
- Peso objetivo: 180–350 KB; máximo recomendado 500 KB.
- Horizontal ideal: 1600×1067 px (3:2).
- Vertical ideal: 1200×1600 px (3:4).

**Hero/portadas**
- 1920×1280 px horizontal o 1440×1800 px vertical según composición.
- Peso objetivo: 250–450 KB; máximo 650 KB.

**Logo**
- Ideal: SVG transparente.
- Alternativa: WebP/PNG transparente de 512×512 a 1000×1000 px.

### Cómo agregar una foto
1. Colócala en `assets/images/gallery/`.
2. Registra una entrada en `data/gallery.json` indicando `src`, `alt`, `category` y `title`.
3. Haz commit y push.

Las imágenes `demo-01.webp` ... `demo-06.webp` son **placeholders generados desde la fotografía entregada**. Sustitúyelos por fotografías reales. `rcc-2026-01.webp` proviene del flyer entregado.

## Automatización de imágenes
Se incluye `scripts/prepare_images.py`. Copia originales a una carpeta y ejecuta:

```bash
python scripts/prepare_images.py ./mis-fotos
```

El script genera WebP optimizados en `assets/images/gallery/`. Después agrega/metadatos en `data/gallery.json`.

## GitHub Pages
1. Crea un repositorio.
2. Sube el contenido de esta carpeta.
3. Settings → Pages.
4. Publica desde la rama `main` / raíz.
5. Configura el dominio propio cuando lo tengas.

## Antes de publicar
Los teléfonos, correo, URLs, eventos, narrativa institucional y formulario del prototipo incluyen datos simulados o provisionales. Revísalos en `data/*.json`.


# V2 — histórico por experiencias
La galería ya no es plana. `data/gallery.json` contiene `years → experiences → images` y una colección independiente de los últimos 6 meses de ensayos. Se incluyen **datos/fotos demostrativos para 2024, 2025 y 2026** para visualizar el histórico.

## Estructura 2026
- Ensayos: `ensayo-2026-06.webp` … `ensayo-2026-11.webp` (una por mes)
- Lanzamiento Candelaria: `lanzamiento-candelaria-2026-01.webp` … `-08.webp`
- RCC v4: `rcc-v4-2026-01.webp` … `-08.webp`
- Gran Parada: `gran-parada-lima-2026-01.webp` … `-08.webp`
- Saludo al Collasuyo: `saludo-collasuyo-cusco-2026-01.webp` … `-08.webp`
- Candelaria Puno: `candelaria-puno-2026-01.webp` … `-08.webp`

Cada fotografía de evento tiene además `-thumb.webp` para las tarjetas y la cuadrícula del modal. La grande solo se abre bajo demanda.

## ¿Para qué sirve `assets/images/hero/`?
`traje-luces-hero.webp` es la **imagen protagonista de portada (hero)**. Es la gran fotografía de fondo visible al entrar al sitio detrás del mensaje principal. No pertenece a la galería histórica: su función es identidad/impacto visual. Se puede sustituir cada cierto tiempo sin alterar `gallery.json`, manteniendo exactamente el mismo nombre, o cambiando la ruta en CSS.

## V2 UX
- WhatsApp incluye icono.
- Menú móvil usa hamburguesa y se transforma en X al abrirse.
- Selector de años en la galería.
- Experiencias por evento.
- Modal con miniaturas optimizadas.
- Ensayos como ventana de seis meses.
