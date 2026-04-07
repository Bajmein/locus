---
type: proposal
domain: web-infrastructure
status: implemented
priority: medium
author: gemini-2-0-flash-exp-001
created_at: 2026-04-06
model: Gemini 2.0 Flash
tags:
  - area:portafolio
  - feature:identidad-ux
  - tool:mkdocs
branch: change/002
worktree: .worktrees/002
---

# Proposal: Portafolio Web de Arquitectura y R&D (Fase 2: Identidad y UX)

## Why
La Fase 1 estableció con éxito el scaffolding, el enrutamiento base y los placeholders en Markdown. Ahora, para que el dominio `benjamincriado.dev` cumpla su objetivo fiduciario ante clientes y reclutadores, se requiere configurar la capa de presentación utilizando las capacidades nativas de `Material for MkDocs`. El objetivo es proyectar un perfil técnico sobrio, pragmático y de alta legibilidad, evitando modificaciones manuales de CSS.

## What Changes
Se modificará el archivo `mkdocs.yml` existente para integrar el motor de `Material`. No se crearán archivos CSS ni JS adicionales; toda la configuración se realizará de manera declarativa en YAML. Los cambios incluyen:
- Implementación de un esquema de colores oscuros (Dark Mode) por defecto.
- Configuración de características avanzadas de navegación (pestañas, búsqueda, barra lateral auto-colapsable).
- Definición de metadatos del sitio para SEO técnico básico (título, autor, descripción).
- Integración de enlaces sociales en el pie de página.

## Capabilities
- **dark-mode-identity**: Implementación de un esquema de colores `slate` con colores primarios y de acento técnicos.
- **advanced-navigation-ux**: Habilitación de `navigation.tabs`, `navigation.sections`, y `navigation.top` para mejorar la usabilidad.
- **technical-seo-metadata**: Configuración centralizada de `site_name`, `site_author`, y `site_description`.
- **social-integration**: Conexión directa con perfiles profesionales vía GitHub y LinkedIn.

## Impact
- **mkdocs.yml**: Se inyectarán los bloques de configuración `theme`, `palette`, `features` y `extra.social`.
- **Cero código custom**: Se prohíbe explícitamente la creación de archivos `.css` o `.js` en `docs/`.
- **Sobriedad estricta**: El diseño debe alinearse con un perfil técnico pragmático sin animaciones innecesarias.
- **Dependencias**: Sin cambios adicionales respecto a la Fase 1.
