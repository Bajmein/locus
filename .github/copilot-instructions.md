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

- `src/pages/`: una página `.astro` por URL (`index`, `vigilia`, `vigilia-edge`, `pulse`, `episteme`, `cv`, `404`).
- `src/layouts/Base.astro`: `<head>` (SEO, Open Graph, JSON-LD), cabecera y pie. `Project.astro`: páginas de proyecto. `Base` recibe la prop `tone` (slug del proyecto) y fija `--accent: var(--tone-<slug>)` en `<html>`.
- `src/components/`: `Header`, `Footer`, `Diagram` (marco de los diagramas SVG en línea, con una composición ancha de hasta 640 y otra angosta de hasta 280 unidades; cada diagrama vive en `diagrams/` y usa `diagrams/Node.astro`), `Capabilities`, `ProjectIcon` (íconos SVG en línea por proyecto, props `slug` y `size`; animados al pasar el cursor por la tarjeta y estáticos con `prefers-reduced-motion`).
- `src/styles/global.css`: tokens de diseño (`--bg`, `--accent`, …) y estilos base, incluida la impresión del CV.
- `src/data/site.ts`: nombre, correo, enlaces sociales y metadescripciones del sitio y del CV.
- `src/data/projects.ts`: datos de los proyectos (metadescripción, ficha, tarjeta de la portada, `group` y `period`; agentes primero); lo usan las páginas de proyecto, la portada y `llms.txt`.
- Portada (`src/pages/index.astro`), en orden: hero (consola «Ciclo de un cambio»), «Ahora», «Qué hago» (`#areas`, lista `.method`), «A cargo del área de TI» (`#ti`, `Capabilities`), «Proyectos», «Especialidad» (`#agentes`), trayectoria y tecnologías, contacto. La navegación dice «Qué hago» para `/#areas`; `#agentes` no va en el menú.
- `src/pages/llms.txt.ts`: genera `/llms.txt` en el build a partir de esos datos.
- `public/`: archivos servidos tal cual (`CNAME`, `robots.txt`, `og.png`, PDF del CV).
- `DESIGN.md`: dirección visual y tokens.
- `tests/site.test.mjs`: páginas, SEO (metadescripción de 50 a 160 caracteres, canonical, `noindex` de la 404, precarga de fuente), JSON-LD, sitemap, `llms.txt`, imagen social, piso de 12 px en la tipografía, privacidad (datos vetados y procesos internos de la empresa), enlaces internos y portada (antetítulos de cada sección; `#areas` con tres áreas, `#ti` con cuatro funciones, en ese orden antes de `#proyectos`, y la cabecera con `/#areas`).
- `tools/og.html`: fuente de `public/og.png` (no se despliega).

## Diseño

La dirección completa (tokens, tipografía, componentes y movimiento) está en `DESIGN.md`.

- Un solo tema oscuro («Vigilia nocturna»). Acento ámbar (`--accent`) en el sitio; cada proyecto tiene un tono (`--tone-<slug>`) que reemplaza a `--accent` en su tarjeta y en su página. No añadir otros colores; un tono nuevo debe medir 4,5:1 o más sobre `--bg` y `--surface`.
- Paneles glass (`.glass`: superficie al 78 %, borde de 1 px, `--radius-lg`, desenfoque) con respaldo sólido sin `backdrop-filter` o con `prefers-reduced-transparency`; la cabecera, glass al 85 %. Las tarjetas de proyecto siguen sólidas. El resto se separa con líneas de 1 px. Sin sombras exteriores. Grilla fina solo en el hero.
- Movimiento con CSS nativo y como mejora progresiva (`animation-timeline`, `@view-transition`): una sola secuencia de carga en el hero (y la caja de detección en proyectos y 404); el resto responde al scroll o al cursor. Todo debe verse completo con `prefers-reduced-motion`.
- Tipografía: Archivo Variable (`--font-display`, ancho 112–118 %) solo en display y títulos; Geist Variable en texto e interfaz; Geist Mono en rótulos (`.label`, mayúsculas, 13 px) y en cifras, stack y código. Autoalojadas (`@fontsource-variable`); solo se precarga Archivo.
- Títulos de sección con antetítulo `.label` y barra del acento debajo. La caja de detección (`.target` + `.bbox`, variante `.is-miss`) está en `global.css` y marca el hero, los títulos de proyecto y la 404.
- Sin scroll horizontal en móvil; sin menú hamburguesa.

## Reglas de contenido

- Solo español (`lang="es"`), tono serio: sin emojis ni exclamaciones.
- El cargo actual se describe como «Encargado de TI en un grupo de empresas», sin nombrar la empresa ni a personas.
- No publicar el teléfono. No escribir «estudiante», «egresado» ni «junior».
- No inventar cifras, clientes ni fechas.
- No describir procesos internos de la empresa (tickets, gerencia, aprobaciones, clientes ni prospectos): el cargo se cuenta en términos generales.
- El CV en PDF (`public/assets/pdf/cv_benjamin_criado.pdf`) se genera desde `/cv/` con Chrome headless
  (`--print-to-pdf`); debe caber en dos páginas.
