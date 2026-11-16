# Locus | Portafolio de Ingeniería

**Benjamín Criado (Bajmein)** — Ingeniero Informático.

Código fuente de [benjamincriado.dev](https://benjamincriado.dev): proyectos, experiencia y currículum.

## Proyectos

### Vigilia Reforged
Sistema de videovigilancia de alto rendimiento con arquitectura híbrida Python-Rust. Utiliza decodificación NVDEC por hardware y memoria compartida (IPC) para procesamiento de video en tiempo real con latencia mínima.

### Vigilia Edge
Solución de vigilancia inteligente diseñada para entornos locales con latencia predecible. Implementa inferencia en el borde (YOLOv11/v12) y optimización mediante TensorRT para máxima eficiencia sin dependencia de nube.

### episteme
Memoria y documentación persistente para agentes de IA, servida por MCP desde un vault de notas Markdown compatible con Obsidian.

### Forge
Infraestructura de orquestación para el desarrollo guiado por especificaciones (SDD). Proporciona un pipeline estandarizado que garantiza la trazabilidad y calidad del código mediante la validación de artefactos con esquemas YAML.

## Stack

- **Sitio**: Astro (estático), GitHub Pages
- **Validación**: `astro check` y `node:test` (páginas, SEO, sitemap, privacidad, enlaces)
- **Tooling**: Node 24, npm

## Desarrollo local

```bash
npm install
npm run dev        # http://localhost:4321
npm run build && npm test
```

## Contacto

[kenno13@proton.me](mailto:kenno13@proton.me)
