# Locus | Portafolio de Ingeniería

**Benjamín Criado (Bajmein)** — Ingeniero Informático.

Sitio personal donde documento proyectos activos, experimentos técnicos y notas de ingeniería.

## Proyectos

### Vigilia Reforged
Sistema de videovigilancia de alto rendimiento con arquitectura híbrida Python-Rust. Utiliza decodificación NVDEC por hardware y memoria compartida (IPC) para procesamiento de video en tiempo real con latencia mínima, orquestado mediante un pipeline de desarrollo basado en IA.

### Vigilia Edge
Solución de vigilancia inteligente diseñada para entornos locales con latencia predecible. Implementa inferencia en el borde (YOLOv11/v12) y optimización mediante TensorRT para máxima eficiencia sin dependencia de nube.

### Forge
Infraestructura de orquestación para el desarrollo guiado por especificaciones (SDD). Proporciona un pipeline estandarizado que garantiza la trazabilidad y calidad del código mediante la validación de artefactos con esquemas YAML y agentes autónomos.

## Stack

- **Sitio**: MkDocs Material (SSG)
- **Validación**: pytest (UX, SEO, Metadata)
- **Tooling**: Python 3.14+, uv, ruff, dprint

## Desarrollo local

```bash
uv sync --all-groups
uv run mkdocs serve
```

## Contacto

[kenno13@proton.me](mailto:kenno13@proton.me)
