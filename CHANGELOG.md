# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Página de episteme: sección «El vault en uso» con la vista de grafo del vault (imagen optimizada a WebP con `astro:assets`).
- Página de pulse (`/pulse/`), el motor de estados en Python que sucedió a Forge, con diagrama de sus ocho fases, ícono y tono propios, y enlace a su vitrina `pulse-showcase`.
- Test de privacidad que impide publicar procesos internos de la empresa.
- Portada: secciones «Qué hago» (tres fortalezas) y «A cargo del área de TI» (el trabajo actual, sin nombrar la empresa), con su test.
- Caja de detección en el título de cada página de proyecto (con la clase de su grupo y un rótulo encima) y, sin detección, en la 404.
- Contacto: «Conversemos» cierra con el cursor del logo y entra con un barrido ligado al scroll.
- Tests de los antetítulos de la portada y de la caja de detección en portada, proyectos y 404.
- Páginas de proyecto: tarjeta «Siguiente proyecto» al final, en orden cíclico y con el tono e ícono del proyecto siguiente.
- Contacto: botón «Copiar correo» (solo con JavaScript y portapapeles disponibles, con aviso accesible) y enlace para descargar el CV en PDF.
- Tests del enlace al proyecto siguiente, la sección activa y el logo de la cabecera, el método de `#agentes`, el contacto y los títulos en español.

### Changed

- Redacción de todo el sitio en registro profesional, con tuteo: sin giros coloquiales, anglicismos evitables ni frases de folleto; «ingeniero informático» en minúscula, rangos de fecha con semirraya y «actualidad», y las capacidades de episteme nombradas como sustantivos.
- Vigilia Reforged, el proyecto de título, se fecha en 2025.
- CV alineado con la portada: el perfil nombra las cuatro herramientas, cada proyecto lleva su período, suma Vigilia Edge, el stack separa visión por computador y la formación cita el proyecto de título. Las secciones con varias entradas pueden seguir en la página siguiente para que el PDF quede en dos páginas.
- Posicionamiento Python y agentes de IA en el hero, el título de la portada, la metadescripción, el JSON-LD (`knowsAbout`) y la imagen social, para dos audiencias: equipos que contratan y empresas con un proyecto. El hero suma la disponibilidad (trabajo remoto, inglés avanzado, autorización de trabajo en la UE) y la cifra del trabajo con agentes.
- «Qué hago» (`#areas`) pasa a «En qué puedo aportar»: agentes de IA con método, software en Python y automatización e integraciones, cada una con su evidencia enlazada. El menú sigue el orden de la página.
- Tarjetas de proyecto con una prueba breve y verificable; textos de las tarjetas centrados en lo que logra cada proyecto.
- `#agentes` se titula «Cómo trabajo con agentes de IA».
- Vigilia Edge cuenta su ingeniería (el problema del GIL y del hilo de Qt, las cuatro capas y el resultado de menos de dos cuadros de latencia) y pasa a v1.1.0; Vigilia suma sus decisiones técnicas y deja las frases sin respaldo. Ambas con datos de sus vitrinas.
- episteme suma el estado del proyecto con sus cifras; el pie de las páginas de proyecto invita a escribir por un proyecto parecido.
- Contacto con un texto para cada audiencia; la trayectoria fecha el cargo actual desde octubre de 2026.
- CV con el perfil nuevo, los proyectos en el orden de la portada y la certificación PCEP; PDF regenerado.
- «Ahora» pone a episteme como el foco del tiempo libre y deja a fabrik como la herramienta en uso; sale la tercera versión de Vigilia.
- pulse reemplaza a Forge en las tarjetas de la portada y en el CV; Forge queda en la línea de tiempo de `#agentes`, sin página propia. El período de pulse se corrige a mayo — julio de 2026.
- El trabajo actual se describe en términos generales, sin procesos internos ni datos comerciales de la empresa; la consola del hero vuelve al ciclo de un cambio.
- Perfil general de Encargado de TI en el hero, la metadescripción, el JSON-LD (`knowsAbout`) y el CV, con Python como lenguaje principal.
- `#agentes` pasa a rotularse «Especialidad» y sale del menú, que ahora dice «Qué hago»; los proyectos se presentan como personales.
- Tecnologías de la portada y del CV reagrupadas (Python, otros lenguajes, web, nube, datos, integraciones, IA aplicada y visión).
- PDF del CV regenerado; viñetas de proyectos más cortas para que siga en dos páginas.
- Rediseño «Vigilia nocturna» (azul noche, titular ancho en Archivo, caja de detección sobre el nombre, consola del ciclo de un cambio y tarjetas en mosaico con marca de agua), integrado con la voz técnica del diseño anterior.
- Tipografía: Archivo solo en display y títulos; vuelve Geist para el texto y la interfaz; rótulos en Geist Mono y en mayúsculas.
- Títulos de sección con antetítulo y una barra del acento que crece al entrar en pantalla; el de `#agentes` vuelve a «De la especificación a la memoria».
- Paneles glass translúcidos (consola, «Ahora», ficha de proyecto, diagramas, 404) con respaldo sólido, cabecera glass al 85 % y grilla fina en el hero.
- Tarjetas que aparecen al hacer scroll, se elevan al pasar el cursor y muestran «Ver proyecto →» con la flecha que avanza; marca de agua más chica y tenue.
- Páginas de proyecto: `h2` del cuerpo en el tipo de los titulares, con la barra del tono.
- CV en PDF regenerado con la nueva tipografía.
- Portada: la sección «Cómo decido» se integra en el método de `#agentes`, que pasa a seis ítems en tres columnas; las cifras de la línea de tiempo quedan alineadas al pie.
- Hero con jerarquía en dos párrafos (titular en el color del texto y bajada atenuada); tarjetas de proyecto con íconos más grandes, «Ver proyecto» en lugar de la flecha sola y más aire en las de agentes.
- Páginas de proyecto: la ficha lateral muestra el período en vez de repetir el stack.
- Contacto sin los enlaces a GitHub y LinkedIn, que ya están en el pie.
- README: proyectos con enlace a su página y a su vitrina, descripciones alineadas con el sitio, validación y CI/CD al día.

### Removed

- Sección «A cargo del área de TI» (`#ti`) de la portada: sus funciones pasan a la trayectoria.
- La práctica profesional sale de la portada; sigue en el CV.
- Página `/forge/` y su diagrama; Forge sigue en la línea de tiempo de `#agentes` y en la página de Vigilia.

### Fixed

- Diagramas en su composición ancha en escritorio: la columna de prosa mide 46rem y ya no depende de la fuente.
- Móvil: el riel de `#agentes` sin huecos y con su relleno vertical, la caja de detección dentro del margen lateral y «fabrik + episteme» en una sola línea en la consola.
- Marca de agua de las tarjetas fuera del texto y más tenue al pasar el cursor.
- Cabecera: enlaces con 44 px de alto como objetivo táctil, «Proyectos» marcado como sección activa en las páginas de proyecto y logo con nombre accesible que incluye su texto visible.
- Títulos de las páginas de proyecto con mayúsculas en español («El problema», «La solución», «El ciclo de vida», «Estado del proyecto», «Stack técnico»).

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
