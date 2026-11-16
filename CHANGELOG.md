# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.3.0] - 2026-11-16

### Added

- Sección «Trabajo con agentes» (`/#agentes`) en la portada: línea de tiempo Forge, pulse, fabrik y episteme con sus cifras de GitHub, y cuatro principios de método.
- Íconos SVG en línea por proyecto (`ProjectIcon.astro`), animados por partes al pasar el cursor por la tarjeta y siempre en la página del proyecto; estáticos con `prefers-reduced-motion`.
- Tono por proyecto (`--tone-forge`, `--tone-episteme`, `--tone-vigilia`, `--tone-vigilia-edge`): reemplaza al acento en la tarjeta y en la página de cada proyecto.
- Carga diferida de las secciones bajo el pliegue con `content-visibility: auto`.
- Íconos de línea (Phosphor Icons) para correo, GitHub y LinkedIn en el contacto y el pie, como SVG en `src/assets/icons/` que heredan el color del enlace.
- `llms.txt` generado en el build desde los mismos datos que el SEO de cada página (`src/pages/llms.txt.ts`).
- Precarga de la fuente del titular (Geist, subconjunto latino).
- JSON-LD con `@graph`: `Person`, `WebSite` y `SoftwareSourceCode` en las páginas de proyecto.
- Tests de metadescripciones (50 a 160 caracteres), canonical, `noindex` de la 404, imagen social, JSON-LD, `llms.txt`, piso de 12 px en la tipografía, orden y tono de las tarjetas, línea de tiempo de agentes y tono por página; la prueba de privacidad cubre más cadenas prohibidas.

### Changed

- Foco en el trabajo con agentes de IA: proyectos ordenados con los de agentes primero (episteme, Forge, Vigilia, Vigilia Edge), con tarjetas más altas y los campos `group` y `period` en `src/data/projects.ts`.
- Hero, navegación («Agentes» reemplaza a «Experiencia» para que la cabecera quepa en 360 px) y metadescripción del sitio actualizados; títulos de sección con antetítulo y barra de acento animada con el scroll; transición entre páginas más suave.
- Versión de episteme actualizada a v0.13.
- Fondo con resplandor tenue del acento y grilla fina; paneles translúcidos («glass») en cabecera, contacto, diagramas y página 404.
- Portada: el hero pasa a dos columnas con el panel «Ahora» a la derecha; se quita la numeración de las secciones.
- Proyectos en tarjetas con el stack en etiquetas y un foco de luz que sigue al cursor.
- Experiencia con riel vertical en la línea de tiempo.
- Páginas de proyecto: estado y stack pasan a una ficha lateral fija.
- Transiciones nativas entre páginas, animaciones de entrada al hacer scroll y línea de progreso de lectura en la cabecera; todo se desactiva con `prefers-reduced-motion`.
- Diagramas de Vigilia, Forge y episteme redibujados como SVG en línea, con un punto que recorre el flujo principal. Cada uno trae una composición ancha y otra vertical para móvil, elegida con una container query, con texto de 12 px reales como mínimo y sin desplazamiento horizontal.
- Imagen social con el contenido en una columna cuadrada centrada, legible en el recorte 1:1 de las miniaturas.
- La página 404 lleva `noindex, follow` y no declara canonical ni `og:url`.
- Metadescripciones del sitio y de Forge acortadas a 160 caracteres o menos; los datos de los proyectos pasan a `src/data/projects.ts`.
- Acciones de GitHub en Node 24: `actions/checkout` v7, `actions/setup-node` v7, `actions/upload-pages-artifact` v5 y `actions/deploy-pages` v5. TypeScript se queda en 6, porque `@astrojs/check` aún no acepta la 7.

### Fixed

- Correo de contacto de la portada más chico: pesaba más que el título de su sección.
- Etiquetas de stack de las tarjetas de proyecto a 12 px.

### Removed

- Mermaid y su JavaScript en el cliente.

## [0.2.0] - 2026-11-16

### Changed

- Migración de MkDocs Material a Astro: sitio estático de diseño propio, oscuro y técnico, con fuentes Geist autoalojadas.
- Rediseño completo de la portada: presentación, «Ahora», proyectos, experiencia, enfoque, tecnologías y contacto.
- El CV pasa de un `iframe` con PDF a una página HTML (`/cv/`); el PDF se genera desde ella y conserva su URL.
- Contenido al día: cargo actual, estado de Vigilia como versión de titulación y de Forge como ciclo cerrado.
- Diagramas Mermaid con los colores del sitio, cargados solo en las páginas que los usan.
- CI con `astro check`, build y tests de `node:test`; despliegue a GitHub Pages desde `dist/`.
- Normalización de identidad y sincronización de arquitectura del pipeline Vigilia Reforged (content, 011-vigilia-reforged-arch-sync).
- Sincronización de la documentación pública de Vigilia Edge con la arquitectura real de cuatro capas (content, 012-vigilia-edge-arch-sync).
- Reescritura de la página de Forge y README de showcase para establecer arquitectura industrial SDD y postura zero-trust (forge, 013-forge-industrial-narrative).
- Refactored `README.md` for public portfolio visibility, removing internal architecture details and agentic-specific terminology.

### Added

- Página de episteme (`/episteme/`).
- SEO: `canonical`, Open Graph y Twitter card con imagen social, JSON-LD `Person`, `sitemap-index.xml` y `robots.txt`.
- Página 404 propia y Dependabot para npm y GitHub Actions.

### Removed

- MkDocs, Python, pytest y `uv.lock`.
- Teléfono y correo sin buzón (`vigilia-security.tech`) del sitio y del CV.

## [0.1.2] - 2026-04-07

### Added

- Configured MkDocs Material theme identity (Dark Mode), advanced navigation UX, technical SEO metadata, and social profile integrations (web-infrastructure, 002-portafolio-identidad-ux).

## [0.1.1] - 2026-04-07

### Added

- Scaffolded MkDocs static site generator with Material theme, declarative navigation tree, and initial placeholders for "Vigilia", "Forge", and "Laboratorio" sections (web-infrastructure, 001).
- Added `.gitignore` rules to exclude internal Locus/Forge architecture from the public repository.
