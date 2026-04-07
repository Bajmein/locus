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
  - feature:scaffolding
  - tool:mkdocs
branch: change/001
worktree: .worktrees/001
---

# Proposal: Portafolio Web de Arquitectura y R&D (Fase 1: Estructura Base)

## Why
Se requiere una plataforma fiduciaria bajo el dominio `benjamincriado.dev` que actúe como un repositorio centralizado de arquitectura para validar el nivel de *Seniority* ante clientes B2B. Para mantener la eficiencia de desarrollo, la construcción se dividirá en dos fases. Esta propuesta abarca exclusivamente la **Fase 1: Scaffolding y Estructura**, cuyo objetivo es levantar el motor estático, el enrutamiento y los placeholders de contenido. El diseño visual y el contenido final se abordarán en iteraciones posteriores.

## What Changes
Se implementará una arquitectura de sitio estático basada en **MkDocs** con el tema **Material for MkDocs**. Se abandonará cualquier intención de usar HTML/CSS/JS manual para favorecer un flujo de trabajo 100% declarativo y basado en Markdown. Los cambios incluyen:
- Creación de un entorno virtual Python con dependencias aisladas (`mkdocs-material`).
- Definición de un archivo `mkdocs.yml` con el árbol de navegación completo.
- Generación de una estructura de directorios en `/docs/` con placeholders para todas las secciones críticas (Vigilia, Forge, Laboratorio).

## Capabilities
- **scaffolding-mkdocs**: Inicialización rápida del motor del sitio estático sin fricción técnica.
- **declarative-routing**: Árbol de navegación completamente mapeado y funcional desde la configuración.
- **markdown-only-workflow**: Ciclo de actualización basado íntegramente en archivos Markdown.
- **placeholder-structure**: Estructura de archivos base con títulos y advertencias de "Work in Progress".

## Impact
- **Nuevas Dependencias**: Requiere Python y `mkdocs-material`. Se gestionará vía `requirements.txt`.
- **Estructura de Archivos**: Se crea el directorio `/docs/` y el archivo `mkdocs.yml` en la raíz (o subdirectorio según se decida en el diseño).
- **Riesgos**: Mínimos, ya que es un sistema desacoplado de la lógica core de Locus.
- **CI/CD**: Prepara el terreno para despliegue automático en GitHub Pages mediante una estructura estándar de MkDocs.
