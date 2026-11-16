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
- `src/components/`: `Header`, `Footer`, `Mermaid` (diagramas en el cliente, solo donde se usa), `Capabilities`.
- `src/styles/global.css`: tokens de diseño (`--bg`, `--accent`, …) y estilos base, incluida la impresión del CV.
- `src/data/site.ts`: nombre, correo y enlaces sociales.
- `public/`: archivos servidos tal cual (`CNAME`, `robots.txt`, `og.png`, PDF del CV).
- `tests/site.test.mjs`: páginas, SEO, sitemap, privacidad y enlaces internos.
- `tools/og.html`: fuente de `public/og.png` (no se despliega).

## Diseño

- Un solo tema oscuro y un solo acento (`--accent`). No añadir colores.
- Separación con líneas finas de 1 px, sin sombras, gradientes ni bordes muy redondeados.
- Etiquetas, fechas y stack en `--font-mono`, mayúsculas. Fuentes Geist autoalojadas (`@fontsource-variable`).
- Sin scroll horizontal en móvil; sin menú hamburguesa.

## Reglas de contenido

- Solo español (`lang="es"`), tono serio: sin emojis ni exclamaciones.
- El cargo actual se describe como «Encargado de TI en un grupo de empresas», sin nombrar la empresa ni a personas.
- No publicar el teléfono. No escribir «estudiante», «egresado» ni «junior».
- No inventar cifras, clientes ni fechas.
- El CV en PDF (`public/assets/pdf/cv_benjamin_criado.pdf`) se genera desde `/cv/` con Chrome headless
  (`--print-to-pdf`); debe caber en dos páginas.
