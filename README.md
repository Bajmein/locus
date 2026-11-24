# Locus | Portafolio de Ingeniería

**Benjamín Criado (Bajmein)** — Ingeniero Informático. Agentes de IA y automatización.

Código fuente de [benjamincriado.dev](https://benjamincriado.dev): trabajo con agentes, proyectos, experiencia y currículum.

## Trabajo con agentes

Desde abril de 2026 construyo las herramientas con que trabajo con agentes de código: Forge, pulse, fabrik y episteme. Cada una resolvió lo que la anterior dejaba abierto, del pipeline guiado por especificaciones a la memoria persistente. Las cuatro y el método están en [benjamincriado.dev/#agentes](https://benjamincriado.dev/#agentes).

## Proyectos

Agentes de IA primero y visión por computador después, en el mismo orden que la portada.

### [episteme](https://benjamincriado.dev/episteme/)
Memoria y documentación persistente para agentes de IA, servida por MCP desde un vault de notas Markdown que el usuario controla. En uso diario desde octubre de 2026; código privado.

### [Forge](https://benjamincriado.dev/forge/)
Desarrollo guiado por especificaciones (SDD) para agentes de IA: un pipeline de artefactos validados con esquemas YAML que convierte ideas en código verificado. Ciclo cerrado (abril a julio de 2026). Vitrina: [forge-showcase](https://github.com/Bajmein/forge-showcase).

### [Vigilia Reforged](https://benjamincriado.dev/vigilia/)
Segunda generación de Vigilia (2026): monitoreo inteligente con análisis de video en tiempo real, arquitectura híbrida Python-Rust, decodificación NVDEC por hardware, zonas de seguridad configurables y alertas multicanal. Vitrina: [vigilia-reforged-showcase](https://github.com/Bajmein/vigilia-reforged-showcase).

### [Vigilia Edge](https://benjamincriado.dev/vigilia-edge/)
Primera generación de Vigilia (2025): vigilancia de escritorio con inferencia local (YOLO y TensorRT), núcleo en Rust e interfaz PySide6, sin nube. Vitrina: [vigilia-edge-showcase](https://github.com/Bajmein/vigilia-edge-showcase).

## Stack

- **Sitio**: Astro (estático), GitHub Pages
- **Diseño**: tema oscuro «Vigilia nocturna» ([DESIGN.md](DESIGN.md)), Archivo, Geist y Geist Mono, un tono por proyecto, íconos y animaciones en CSS nativo y diagramas SVG en línea, sin librerías en el cliente
- **Validación**: `astro check` y `node:test` sobre `dist/` (páginas, SEO, JSON-LD, sitemap, `llms.txt`, imagen social, piso de 12 px en la tipografía, diagramas, orden y tono de los proyectos, cabecera, contacto, caja de detección, privacidad y enlaces)
- **CI/CD**: GitHub Actions valida cada PR a `main` y despliega a GitHub Pages al fusionar; Dependabot semanal para npm y las acciones
- **Tooling**: Node 24, npm

## Desarrollo local

```bash
npm install
npm run dev        # http://localhost:4321
npm run check      # tipos
npm run build && npm test
```

Los cambios se registran en [CHANGELOG.md](CHANGELOG.md).

## Contacto

[kenno13@proton.me](mailto:kenno13@proton.me)
