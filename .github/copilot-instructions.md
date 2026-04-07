# Locus - Copilot Instructions

Locus es el sitio web portafolio personal, construido con **MkDocs Material**. El proyecto se enfoca en la creación de contenido estático y su validación mediante tests de UX/SEO.

## Build, Test, and Lint

Todas las tareas se gestionan a través de `mise` (configurado en `mise.toml`):

```bash
# Setup
mise install                    # Instala herramientas (python 3.14, uv, ruff, dprint)
mise run install                # Instala dependencias del sitio (mkdocs-material, etc.)

# Desarrollo local
mise run serve                  # Lanza el servidor de desarrollo local con live-reload
mise run build                  # Genera los archivos estáticos (strict mode)

# Calidad y Validación
mise run test                   # Ejecuta tests de UX/SEO con pytest
mise run lint                   # Ejecuta ruff y dprint
mise run check                  # Ejecuta todo: lint + test + build
```

## Arquitectura

- **Motor Estático**: MkDocs con el tema Material.
- **Contenido**: Markdown enriquecido con extensiones de Material (tabs, cards, grids).
- **Validación**: Pytest para verificar que la configuración (`mkdocs.yml`) cumpla con los estándares de SEO y UX.
- **CI/CD**: GitHub Actions para validación de PRs y despliegue automático a GitHub Pages.

## Convenciones de Contenido

### Estructura de Documentos

Cada página Markdown (`.md`) debe incluir frontmatter YAML para SEO:

```yaml
---
title: Mi Proyecto Genial
description: Una descripción breve para los resultados de búsqueda.
---

# Título de la Página
...
```

### Rutas y Assets

- **Imágenes**: Siempre guardarlas en `docs/assets/`.
- **Navegación**: Se define únicamente en `mkdocs.yml`. No añadir archivos sin actualizar el menú.

### Estilo

- Usar **Admonitions** para notas y avisos.
- Usar **Content Blocks** para secciones reutilizables.
- Mantener un tono profesional pero personal.

## Librerías principales

- `mkdocs`: Generador de sitio estático.
- `mkdocs-material`: Tema y extensiones visuales.
- `pyyaml`: Validación de configuración YAML en tests.
