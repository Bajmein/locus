---
title: Forge
description: >
  Framework schema-driven para orquestar el ciclo de vida de cambios de software
  con agentes de IA. Propuesta de valor, capacidades y estado del proyecto.
---

# Forge

**Pipeline estructurado para desarrollo asistido por IA.**

Forge resuelve un problema específico: el desarrollo con agentes de IA es potente
pero caótico. Sin estructura, los cambios son difíciles de rastrear, reproducir
o revisar. Forge introduce un pipeline guiado por esquemas que convierte ideas
en código verificado de forma sistemática.

---

## El Problema

Los flujos de trabajo con IA generativa para código tienden a ser ad-hoc:
instrucciones informales, contexto implícito y cambios sin trazabilidad. Esto
funciona para tareas aisladas, pero falla cuando el software crece y el equipo
necesita reproducibilidad, revisión y consistencia.

## La Solución

Forge define un **ciclo de vida explícito** para cada cambio de software:

```
Propuesta → Especificación → Diseño → Tareas → Implementación → Verificación → Archivo
```

Cada etapa produce un artefacto validado contra un esquema YAML. Los agentes
de IA actúan como ejecutores de cada fase; los artefactos son la fuente de verdad.

---

## Capacidades

<div class="grid cards" markdown>

-   **Pipeline schema-driven**

    ---

    Cada cambio avanza a través de fases con artefactos validados
    (`proposal.md`, `spec.md`, `design.md`, `tasks.md`). Los esquemas garantizan
    consistencia entre proyectos y agentes.

-   **Multi-agente y multi-CLI**

    ---

    Compatible con Claude Code, Gemini CLI y GitHub Copilot como motores de
    ejecución. El pipeline es agnóstico al agente: los comandos `/propose`,
    `/apply`, `/verify` funcionan con cualquier cliente compatible.

-   **Jerarquía de conocimiento estructurada**

    ---

    Notion como fuente oficial de especificaciones, Obsidian para contexto interno
    y el filesystem para artefactos activos. Los agentes saben exactamente dónde
    buscar y en qué orden.

-   **Sin runtime propio**

    ---

    Forge no tiene un servidor ni proceso de fondo. Es pura configuración:
    esquemas YAML, prompts Markdown y convenciones de directorio. Ligero,
    portable y versionable en git.

-   **Trazabilidad por diseño**

    ---

    Cada cambio tiene su propio directorio `NNN-slug/` con historia completa.
    El archivo consolida las especificaciones en un spec acumulado del proyecto.

-   **Flujo rápido integrado**

    ---

    Los comandos `/fast-draft` y `/fast-plan` permiten pasar de idea a diseño
    con tareas ejecutables en una sola operación, sin saltarse la validación.

</div>

---

## Stack

| Componente | Tecnología                           |
| ---------- | ------------------------------------ |
| Artefactos | YAML + Markdown                      |
| Desarrollo | Python 3.14+, mise, uv, ruff, dprint |
| Validación | pytest, bandit, ty, vulture          |
| MCP        | context7, github, serena, obsidian   |

---

## Estado del Proyecto

!!! info "En desarrollo activo — v0.1.0"

    Forge está en uso activo en proyectos propios. El pipeline completo
    (propose → archive) está operativo. La integración con Notion y la
    expansión a más CLIs son áreas de mejora continua.

---

## Más sobre Forge

Forge es la infraestructura que impulsa el proceso de desarrollo de este
mismo portafolio y de otros proyectos en el repositorio. La sección
[Laboratorio](/laboratorio/) recoge experimentos y aprendizajes surgidos
de su uso.
