# Locus | Portafolio de Ingeniería

**Benjamín Criado (Bajmein)** — Ingeniero Informático. Vicuña, Valle del Elqui.

Sitio personal donde documento proyectos activos, experimentos técnicos y notas de ingeniería.

## Proyectos

### Vigilia

Sistema de vigilancia distribuida construido en **Rust** y **Python** con Computer Vision.
Captura y análisis de video desde cámaras ONVIF, procesamiento local y conectividad mediante Tailscale.

### Forge

Framework de orquestación para desarrollo guiado por especificaciones (**SDD**).
Pipeline estructurado `Proponer → Especificar → Diseñar → Ejecutar → Verificar` con artefactos validados por schema YAML.

## Stack

- **Sitio**: MkDocs Material (SSG)
- **Validación**: pytest (UX, SEO, Metadata)
- **Tooling**: Python 3.14+, uv, ruff, dprint

## Desarrollo local

```bash
uv sync --all-groups
uv run mkdocs serve
```
