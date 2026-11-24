# Locus | Portafolio de Ingeniería

**Benjamín Criado (Bajmein)** — Ingeniero Informático. Agentes de IA y automatización.

Código fuente de [benjamincriado.dev](https://benjamincriado.dev): trabajo con agentes, proyectos, experiencia y currículum.

## Trabajo con agentes

Desde abril de 2026 construyo las herramientas con que trabajo con agentes de código: Forge, pulse, fabrik y episteme. Cada una resolvió lo que la anterior dejaba abierto, del pipeline guiado por especificaciones a la memoria persistente. Las cuatro y el método están en [benjamincriado.dev/#agentes](https://benjamincriado.dev/#agentes).

## Proyectos

### episteme
Memoria y documentación persistente para agentes de IA, servida por MCP desde un vault de notas Markdown compatible con Obsidian.

### Forge
Infraestructura de orquestación para el desarrollo guiado por especificaciones (SDD). Proporciona un pipeline estandarizado que garantiza la trazabilidad y calidad del código mediante la validación de artefactos con esquemas YAML.

### Vigilia Reforged
Sistema de videovigilancia de alto rendimiento con arquitectura híbrida Python-Rust. Utiliza decodificación NVDEC por hardware y memoria compartida (IPC) para procesamiento de video en tiempo real con latencia mínima.

### Vigilia Edge
Solución de vigilancia inteligente diseñada para entornos locales con latencia predecible. Implementa inferencia en el borde (YOLOv11/v12) y optimización mediante TensorRT para máxima eficiencia sin dependencia de nube.

## Stack

- **Sitio**: Astro (estático), GitHub Pages
- **Diseño**: tema oscuro «Vigilia nocturna» ([DESIGN.md](DESIGN.md)), Archivo, Geist y Geist Mono, un tono por proyecto, íconos y animaciones en CSS nativo y diagramas SVG en línea, sin librerías en el cliente
- **Validación**: `astro check` y `node:test` (páginas, SEO, JSON-LD, sitemap, `llms.txt`, imagen social, tipografía, orden y tono de los proyectos, privacidad, enlaces)
- **Tooling**: Node 24, npm

## Desarrollo local

```bash
npm install
npm run dev        # http://localhost:4321
npm run build && npm test
```

## Contacto

[kenno13@proton.me](mailto:kenno13@proton.me)
