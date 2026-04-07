---
type: spec
domain: content
status: draft
author: claude-sonnet-4-6
created_at: 2026-04-07
proposal: ../../../proposal.md
tags:
  - area:content
  - feature:showcase
  - path:docs/forge/index.md
  - area:infrastructure
  - feature:public-repo
---

## Purpose

Este delta cubre los requisitos del repositorio público de exhibición de Forge (`forge-showcase`) y su integración en la página `docs/forge/index.md` del portafolio locus. Define el contenido exigible de los artefactos del showcase (README técnico, topología de directorios anotada, entorno de desarrollo saneado), la sección nueva en la página de Forge, y las invariantes Zero Trust que garantizan que no se expone código fuente ni configuración sensible.

## ADDED Requirements

### Requirement: Showcase — README técnico con banner de exhibición y diagrama Mermaid SDD

El archivo `README.md` del repositorio `forge-showcase` SHALL contener: (1) un banner `[!IMPORTANT]` que identifique el repositorio como exhibición sin código fuente, con referencia a `github.com/Bajmein`; (2) el diagrama Mermaid completo del flujo SDD (Usuario → Especificación → Motor → Agente IA → Output → Spec acumulado); (3) la tabla de comandos slash del CLI (`/propose`, `/specify`, `/design`, `/break-to-tasks`, `/approve`, `/apply`, `/verify`, `/archive`); (4) la tabla de stack técnico con todos los componentes descritos en la propuesta.

#### Scenario: Banner de exhibición presente y legible

**GIVEN** el archivo `README.md` en el repositorio `forge-showcase`
**WHEN** se renderiza en GitHub
**THEN** la primera sección visible es un bloque `[!IMPORTANT]` que indica explícitamente que el código fuente es privado y apunta a `github.com/Bajmein` para consultas

#### Scenario: Diagrama Mermaid del flujo SDD completo

**GIVEN** el `README.md` del showcase
**WHEN** GitHub renderiza el bloque `mermaid`
**THEN** el diagrama muestra los cinco nodos (Usuario, Especificación, Motor, Agente IA, Output) con el ciclo de retroalimentación final (Output → Spec acumulado), sin errores de sintaxis Mermaid

#### Scenario: Tabla de comandos slash del CLI

**GIVEN** el `README.md` del showcase
**WHEN** se verifica su contenido
**THEN** la tabla de comandos slash contiene al menos los ocho comandos del pipeline: `/propose`, `/specify`, `/design`, `/break-to-tasks`, `/approve`, `/apply`, `/verify`, `/archive`; y los dos atajos `/fast-draft` y `/fast-plan`

#### Scenario: Tabla de stack con todos los componentes

**GIVEN** el `README.md` del showcase
**WHEN** se verifica su contenido
**THEN** la tabla de stack contiene exactamente los componentes: Artefactos (YAML schemas + Markdown), Desarrollo (Python 3.14+, mise, uv, ruff, dprint), Validación (pytest, bandit, ty, vulture, deptry), MCP Servers (context7, github, serena, obsidian), Clientes IA (Claude Code, Gemini CLI, GitHub Copilot)

---

### Requirement: Showcase — tree_structure.txt con topología de directorios anotada

El archivo `tree_structure.txt` del repositorio `forge-showcase` SHALL contener la topología completa de directorios de Forge con anotaciones de propósito para cada directorio de primer y segundo nivel: `.agents/` (con subdirectorios `skills/pipeline/`, `skills/shared/`, `skills/utility/`), `.engine/` (con subdirectorios `changes/`, `changes/archive/`, `ideas/`, `schemas/`, `specs/`), `docs/`, `src/forge/` y `tests/`.

#### Scenario: Todos los directorios clave presentes y anotados

**GIVEN** el archivo `tree_structure.txt` del showcase
**WHEN** se verifica su contenido
**THEN** los directorios `.agents/`, `.engine/`, `docs/`, `src/`, `tests/` aparecen como entradas de primer nivel con comentario `#` que describe su propósito

#### Scenario: Subdirectorios de .agents/ y .engine/ correctamente desglosados

**GIVEN** el archivo `tree_structure.txt` del showcase
**WHEN** se verifica la jerarquía bajo `.agents/` y `.engine/`
**THEN** `.agents/skills/` muestra los tres subdirectorios `pipeline/`, `shared/`, `utility/`; y `.engine/` muestra `changes/`, `changes/archive/`, `ideas/`, `schemas/`, `specs/`

#### Scenario: src/ marcado como privado

**GIVEN** el archivo `tree_structure.txt` del showcase
**WHEN** se verifica la anotación de `src/forge/`
**THEN** la línea contiene una nota explícita que indica que el código fuente es privado y no está incluido en el showcase

---

### Requirement: Showcase — mise.toml saneado sin variables privadas ni rutas de entorno

El archivo `mise.toml` del repositorio `forge-showcase` SHALL definir las herramientas del entorno (`python = "3.14"`, `uv`, `ruff`, `dprint`), y las tareas `install`, `lint`, `format`, `test`, `security`, `typecheck`, `check` — sin ninguna sección `[vars]`, sin directivas `_.python.venv` ni `_.file = ".env"`, y con un comentario de sanitización visible al inicio del archivo.

#### Scenario: Secciones [vars] y directivas privadas ausentes

**GIVEN** el archivo `mise.toml` del showcase
**WHEN** se verifica su contenido completo
**THEN** no existe ninguna sección `[vars]`, ninguna directiva `_.python.venv` ni `_.file` en el archivo

#### Scenario: Comentario de sanitización presente

**GIVEN** el archivo `mise.toml` del showcase
**WHEN** se leen las primeras líneas del archivo
**THEN** hay un comentario que indica explícitamente que es una versión de referencia saneada sin variables privadas ni configuración de entorno local

#### Scenario: Tareas del pipeline de validación completas

**GIVEN** el archivo `mise.toml` del showcase
**WHEN** se verifica la lista de tareas definidas
**THEN** existen las tareas: `install`, `lint`, `format`, `test`, `security`, `typecheck`, `check`; y la tarea `check` declara `depends` sobre al menos `lint`, `test`, `security`, `typecheck`

---

### Requirement: locus — Sección "Repositorio Vitrina" en docs/forge/index.md

La página `docs/forge/index.md` SHALL incluir una nueva sección `## Repositorio Vitrina` con descripción de la estrategia de exhibición y un botón Material que enlace a `https://github.com/Bajmein/forge-showcase`, insertada antes de la sección `## Más sobre Forge`.

#### Scenario: Sección insertada en la posición correcta

**GIVEN** `docs/forge/index.md` con la sección `## Repositorio Vitrina` añadida
**WHEN** se verifica el orden de los encabezados H2 en el archivo
**THEN** `## Repositorio Vitrina` aparece inmediatamente antes de `## Más sobre Forge`

#### Scenario: Botón Material con enlace correcto

**GIVEN** la sección `## Repositorio Vitrina` en `docs/forge/index.md`
**WHEN** MkDocs genera la página
**THEN** el enlace renderizado apunta a `https://github.com/Bajmein/forge-showcase` y tiene la clase `md-button`

#### Scenario: Build estricto sin errores tras la adición

**GIVEN** `docs/forge/index.md` con la sección nueva
**WHEN** se ejecuta `uv run mkdocs build --strict`
**THEN** el comando termina con código de salida 0 sin warnings ni errores relacionados con la página de Forge

#### Scenario: Tests SEO no se ven afectados

**GIVEN** el frontmatter existente de `docs/forge/index.md` (sin cambios: `title` y `description` presentes)
**WHEN** se ejecuta `mise run test`
**THEN** todos los tests de metadata y SEO pasan sin modificaciones al conjunto de tests

---

### Requirement: Zero Trust — Artefactos del showcase libres de información sensible

Los tres artefactos del showcase (`README.md`, `tree_structure.txt`, `mise.toml`) SHALL NO contener: código fuente de Forge (Python), rutas locales privadas del entorno de producción, tokens de API, variables de entorno reales, nombres de usuario de sistemas internos, ni ningún dato que identifique un entorno de desarrollo o producción específico.

#### Scenario: Ningún fragmento de código fuente Python en el showcase

**GIVEN** el contenido de los tres artefactos del showcase
**WHEN** se buscan bloques de código con sintaxis Python funcional (imports, class/def, lógica de negocio)
**THEN** no se encuentra ningún fragmento de código fuente funcional — solo configuración TOML, texto descriptivo y diagramas Mermaid

#### Scenario: Ninguna ruta local privada en los artefactos

**GIVEN** el contenido completo de los tres artefactos
**WHEN** se buscan cadenas que comiencen con `/home/`, `~/BenjaLabs/` o similares rutas absolutas locales
**THEN** no se encuentra ninguna ruta que revele la estructura del entorno de desarrollo privado

#### Scenario: Repositorio público no enlaza al repositorio privado de Forge

**GIVEN** el contenido completo de `README.md` del showcase
**WHEN** se busca cualquier referencia a un repositorio privado de Forge
**THEN** no existe ningún enlace ni mención que apunte a repositorios privados; solo se referencia `github.com/Bajmein` como punto de contacto

---

### Requirement: Repositorio GitHub público creado y accesible

El repositorio `Bajmein/forge-showcase` SHALL existir en GitHub como repositorio público con descripción que mencione "SDD pipeline showcase", homepage apuntando a la página de Forge en locus, y los tres artefactos en la rama `main`.

#### Scenario: Repositorio público visible sin autenticación

**GIVEN** el repositorio `https://github.com/Bajmein/forge-showcase`
**WHEN** se accede sin autenticación
**THEN** el repositorio es accesible, marcado como público, y muestra el `README.md` renderizado

#### Scenario: Homepage del repositorio apunta a locus

**GIVEN** los metadatos del repositorio en GitHub
**WHEN** se consulta el campo `homepage`
**THEN** el valor es `https://bajmein.github.io/locus/forge/`

#### Scenario: Los tres artefactos están en la rama main

**GIVEN** la rama `main` del repositorio `forge-showcase`
**WHEN** se listan los archivos en la raíz
**THEN** existen exactamente los archivos: `README.md`, `tree_structure.txt`, `mise.toml`

## MODIFIED Requirements

### Requirement: docs/forge/index.md — Adición de sección sin romper requisitos existentes

La página `docs/forge/index.md` SHALL mantener todos sus requisitos previos (frontmatter SEO, secciones de contenido existentes y `## Más sobre Forge`) intactos tras la inserción de la sección `## Repositorio Vitrina`.

#### Scenario: Frontmatter sin cambios

**GIVEN** `docs/forge/index.md` modificado con la nueva sección
**WHEN** se verifica el frontmatter YAML
**THEN** los campos `title` y `description` son idénticos a los valores pre-modificación

#### Scenario: Secciones existentes preservadas

**GIVEN** `docs/forge/index.md` con la sección nueva añadida
**WHEN** se verifica la presencia de todos los encabezados H2
**THEN** todos los encabezados H2 previos a la modificación siguen presentes y en el mismo orden relativo entre sí, con `## Repositorio Vitrina` insertada únicamente antes de `## Más sobre Forge`

## REMOVED Requirements

_No aplica._
