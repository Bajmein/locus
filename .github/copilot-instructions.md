# Locus - Copilot Instructions

Locus es el portafolio de Benjamín Criado (https://benjamincriado.dev): un sitio estático hecho con
**Astro**, desplegado en GitHub Pages.

## Comandos

```bash
npm install        # dependencias (Node 24)
npm run dev        # servidor de desarrollo en http://localhost:4321
npm run check      # astro check (tipos)
npm run build      # genera dist/
npm test           # node:test sobre dist/ (requiere build previo)
npm run preview    # sirve dist/
```

## Estructura

- `src/pages/`: una página `.astro` por URL (`index`, `vigilia`, `vigilia-edge`, `forge`, `episteme`, `cv`, `404`).
- `src/layouts/Base.astro`: `<head>` (SEO, Open Graph, JSON-LD), cabecera y pie. `Project.astro`: páginas de proyecto.
- `src/components/`: `Header`, `Footer`, `Diagram` (marco de los diagramas SVG en línea, con una composición ancha de hasta 640 y otra angosta de hasta 280 unidades; cada diagrama vive en `diagrams/` y usa `diagrams/Node.astro`), `Capabilities`.
- `src/styles/global.css`: tokens de diseño (`--bg`, `--accent`, …) y estilos base, incluida la impresión del CV.
- `src/data/site.ts`: nombre, correo, enlaces sociales y metadescripciones del sitio y del CV.
- `src/data/projects.ts`: datos de los proyectos (metadescripción, ficha y tarjeta de la portada); lo usan las páginas de proyecto, la portada y `llms.txt`.
- `src/pages/llms.txt.ts`: genera `/llms.txt` en el build a partir de esos datos.
- `public/`: archivos servidos tal cual (`CNAME`, `robots.txt`, `og.png`, PDF del CV).
- `tests/site.test.mjs`: páginas, SEO (metadescripción de 50 a 160 caracteres, canonical, `noindex` de la 404, precarga de fuente), JSON-LD, sitemap, `llms.txt`, imagen social, piso de 12 px en la tipografía, privacidad y enlaces internos.
- `tools/og.html`: fuente de `public/og.png` (no se despliega).

## Diseño

- Un solo tema oscuro y un solo acento (`--accent`). No añadir colores.
- Glass sobrio: paneles `.glass` (translúcidos, borde de 1 px, `--radius-lg`) solo en cabecera, panel
  «Ahora», tarjetas de proyecto, contacto, ficha de proyecto y diagramas. El resto se separa con líneas
  de 1 px. Sin sombras exteriores; los únicos gradientes son el resplandor del fondo y el foco `.spot`.
- Movimiento con CSS nativo y como mejora progresiva (`animation-timeline`, `@view-transition`); todo
  debe verse completo con `prefers-reduced-motion`.
- Etiquetas, fechas y stack en `--font-mono`, mayúsculas. Fuentes Geist autoalojadas (`@fontsource-variable`).
- Sin scroll horizontal en móvil; sin menú hamburguesa.

## Reglas de contenido

- Solo español (`lang="es"`), tono serio: sin emojis ni exclamaciones.
- El cargo actual se describe como «Encargado de TI en un grupo de empresas», sin nombrar la empresa ni a personas.
- No publicar el teléfono. No escribir «estudiante», «egresado» ni «junior».
- No inventar cifras, clientes ni fechas.
- El CV en PDF (`public/assets/pdf/cv_benjamin_criado.pdf`) se genera desde `/cv/` con Chrome headless
  (`--print-to-pdf`); debe caber en dos páginas.
