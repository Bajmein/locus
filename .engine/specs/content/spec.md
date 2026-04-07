---
type: spec
domain: content
status: accumulated
author: claude-sonnet-4-6
created_at: 2026-04-07
tags:
  - area:content
  - feature:showcase
  - path:docs/vigilia/index.md
  - path:docs/forge/index.md
  - area:infrastructure
  - feature:public-repo
---

## Purpose

Especificación acumulada del dominio `content`. Cubre los requisitos de los repositorios públicos de exhibición de Vigilia (`vigilia-reforged-showcase`) y Forge (`forge-showcase`), y su integración en las páginas `docs/vigilia/index.md` y `docs/forge/index.md` del portafolio locus. Define el contenido exigible de los artefactos del showcase, las secciones nuevas en las páginas de proyecto, y las invariantes Zero Trust que garantizan que no se expone código fuente ni datos sensibles.

## ADDED Requirements

### Requirement: Vigilia Showcase — README técnico con banner de exhibición y diagrama Mermaid

El archivo `README.md` del repositorio `vigilia-reforged-showcase` SHALL contener: (1) un banner `[!IMPORTANT]` que identifique el repositorio como exhibición sin código fuente, con referencia a `github.com/Bajmein`; (2) el diagrama Mermaid completo del pipeline de datos (Ingestión → Análisis → Decisión → Acción); (3) la tabla de stack técnico con todas las capas descritas en la propuesta.

#### Scenario: Banner de exhibición presente y legible

**GIVEN** el archivo `README.md` en el repositorio `vigilia-reforged-showcase`
**WHEN** se renderiza en GitHub
**THEN** la primera sección visible es un bloque `[!IMPORTANT]` que indica explícitamente que el código fuente es privado y apunta a `github.com/Bajmein` para consultas

#### Scenario: Diagrama Mermaid del pipeline completo

**GIVEN** el `README.md` del showcase
**WHEN** GitHub renderiza el bloque `mermaid`
**THEN** el diagrama muestra los cuatro subgrafos (Ingestión, Análisis, Decisión, Acción) con todos los nodos y conexiones definidas en la propuesta, sin errores de sintaxis Mermaid

#### Scenario: Tabla de stack con todas las capas

**GIVEN** el `README.md` del showcase
**WHEN** se verifica su contenido
**THEN** la tabla de stack contiene exactamente las capas: Core de análisis (Rust), Orquestación (Python/Pydantic v2), Interfaz (PySide6), Integraciones (ONVIF/MQTT), Acceso remoto (Tailscale/WebRTC), Infraestructura (Docker Compose), Tooling (mise/uv/ruff/dprint)

---

### Requirement: Vigilia Showcase — Plantilla docker-compose.example.yml sin credenciales

El archivo `docker-compose.example.yml` SHALL definir la topología completa de 5 servicios (vigilia-ingest, vigilia-analyzer, vigilia-orchestrator, mqtt-broker, vigilia-storage), con reservas de GPU para el servicio analyzer, red interna `vigilia-net` y volúmenes nombrados — sin ninguna credencial real, IP real ni ruta de código fuente.

#### Scenario: Cinco servicios definidos con dependencias correctas

**GIVEN** el archivo `docker-compose.example.yml` del showcase
**WHEN** se valida con `docker compose config --quiet`
**THEN** el comando termina sin errores y el output contiene exactamente los servicios: `vigilia-ingest`, `vigilia-analyzer`, `vigilia-orchestrator`, `mqtt-broker`, `vigilia-storage`

#### Scenario: Reserva de GPU declarada para el analyzer

**GIVEN** el servicio `vigilia-analyzer` en `docker-compose.example.yml`
**WHEN** se inspecciona el bloque `deploy.resources.reservations.devices`
**THEN** hay exactamente una entrada con `driver: nvidia`, `count: 1` y `capabilities: [gpu]`

#### Scenario: Sin credenciales reales en el archivo

**GIVEN** el contenido completo de `docker-compose.example.yml`
**WHEN** se busca cualquier cadena que no sea un placeholder (`<...>`) en campos de `environment` con sufijo `_PASSWORD`, `_SECRET` o `_TOKEN`
**THEN** no se encuentra ninguna cadena que parezca una credencial real (longitud > 8, sin caracteres `<>`)

#### Scenario: Red y volúmenes declarados correctamente

**GIVEN** `docker-compose.example.yml`
**WHEN** se verifica la sección `networks` y `volumes`
**THEN** existe la red `vigilia-net` con driver `bridge` y los volúmenes `ipc-socket`, `mqtt-data`, `mqtt-log`, `clips-data`

---

### Requirement: Vigilia Showcase — Plantilla config.example.yaml declarativa

El archivo `config.example.yaml` SHALL contener definiciones de ejemplo para: fuentes RTSP (sección `sources`), zonas geométricas (sección `zones`) con coordenadas normalizadas en `[0.0, 1.0]`, reglas de acción (sección `rules`) con `cooldown_s` y acciones tipadas, e integraciones opcionales (VMS, storage, remote_access) — todas las IPs y credenciales como placeholders genéricos.

#### Scenario: Secciones requeridas presentes y parseables

**GIVEN** el archivo `config.example.yaml` del showcase
**WHEN** se parsea con `python -c "import yaml; yaml.safe_load(open('config.example.yaml'))"`
**THEN** el comando termina sin errores y el documento contiene las claves de nivel superior: `sources`, `zones`, `rules`, `vms`, `storage`, `remote_access`

#### Scenario: Coordenadas de zonas normalizadas

**GIVEN** la sección `zones` de `config.example.yaml`
**WHEN** se verifica cada punto de `geometry` en cada zona
**THEN** todos los valores `x` e `y` están en el rango `[0.0, 1.0]`

#### Scenario: Sin IPs reales ni credenciales

**GIVEN** el contenido completo de `config.example.yaml`
**WHEN** se busca cualquier valor de tipo string en campos `url`, `endpoint`, `username`, `password`, `hostname`
**THEN** todos los valores que representarían datos sensibles son placeholders con formato `<MAYUSCULAS>` (e.g., `<CAMERA_IP>`, `<USER>`, `<PASSWORD>`)

#### Scenario: Cooldown y acciones tipadas en reglas

**GIVEN** la sección `rules` de `config.example.yaml`
**WHEN** se verifica cada regla
**THEN** cada regla tiene `trigger.cooldown_s` como entero positivo y al menos una acción en `actions` con campo `type` no vacío

---

### Requirement: locus — Sección "Repositorio Vitrina" en docs/vigilia/index.md

La página `docs/vigilia/index.md` SHALL incluir una nueva sección `## Repositorio Vitrina` con descripción de la estrategia de exhibición y un botón Material que enlace a `https://github.com/Bajmein/vigilia-reforged-showcase`, insertada antes de la sección `## Más sobre Vigilia`.

#### Scenario: Sección insertada en la posición correcta

**GIVEN** `docs/vigilia/index.md` con la sección `## Repositorio Vitrina` añadida
**WHEN** se verifica el orden de los encabezados H2 en el archivo
**THEN** `## Repositorio Vitrina` aparece inmediatamente antes de `## Más sobre Vigilia`

#### Scenario: Botón Material con enlace correcto

**GIVEN** la sección `## Repositorio Vitrina` en `docs/vigilia/index.md`
**WHEN** MkDocs genera la página
**THEN** el enlace renderizado apunta a `https://github.com/Bajmein/vigilia-reforged-showcase` y tiene la clase `md-button`

#### Scenario: Build estricto sin errores tras la adición

**GIVEN** `docs/vigilia/index.md` con la sección nueva
**WHEN** se ejecuta `uv run mkdocs build --strict`
**THEN** el comando termina con código de salida 0 sin warnings ni errores relacionados con la página de Vigilia

#### Scenario: Tests SEO no se ven afectados

**GIVEN** el frontmatter existente de `docs/vigilia/index.md` (sin cambios: `title` y `description` presentes)
**WHEN** se ejecuta `mise run test`
**THEN** todos los tests de metadata y SEO pasan sin modificaciones al conjunto de tests

---

### Requirement: Vigilia Zero Trust — Artefactos del showcase libres de información sensible

Los tres artefactos del showcase (`README.md`, `docker-compose.example.yml`, `config.example.yaml`) SHALL NO contener: código fuente de Vigilia (Rust o Python), direcciones IP reales, credenciales RTSP reales, rutas de socket IPC internas, detalles de implementación de CUDA, ni ningún dato que identifique un entorno de producción específico.

#### Scenario: Ningún fragmento de código fuente en el showcase

**GIVEN** el contenido de los tres artefactos del showcase
**WHEN** se buscan bloques de código con extensiones `.rs` o `.py` o sintaxis Rust/Python no declarativa
**THEN** no se encuentra ningún fragmento de código fuente funcional — solo configuración YAML, comandos shell genéricos y diagramas Mermaid

#### Scenario: Repositorio público no enlaza al repo privado

**GIVEN** el contenido completo de `README.md` del showcase
**WHEN** se busca cualquier referencia a `vigilia-reforged` como repositorio de origen
**THEN** no existe ningún enlace ni mención que apunte al repositorio privado `vigilia-reforged/`

---

### Requirement: Vigilia — Repositorio GitHub público creado y accesible

El repositorio `Bajmein/vigilia-reforged-showcase` SHALL existir en GitHub como repositorio público con descripción, homepage apuntando a la página de Vigilia en locus, y los tres artefactos en la rama `main`.

#### Scenario: Repositorio público visible sin autenticación

**GIVEN** el repositorio `https://github.com/Bajmein/vigilia-reforged-showcase`
**WHEN** se accede sin autenticación
**THEN** el repositorio es accesible, marcado como público, y muestra el `README.md` renderizado

#### Scenario: Homepage del repositorio apunta a locus

**GIVEN** los metadatos del repositorio en GitHub
**WHEN** se consulta el campo `homepage`
**THEN** el valor es `https://bajmein.github.io/locus/vigilia/`

#### Scenario: Los tres artefactos están en la rama main

**GIVEN** la rama `main` del repositorio `vigilia-reforged-showcase`
**WHEN** se listan los archivos en la raíz
**THEN** existen exactamente los archivos: `README.md`, `docker-compose.example.yml`, `config.example.yaml`

---

### Requirement: Forge Showcase — README técnico con banner, diagrama Mermaid SDD y CLI slash

El archivo `README.md` del repositorio `forge-showcase` SHALL contener: (1) un banner `[!IMPORTANT]` que identifique el repositorio como exhibición sin código fuente, con referencia a `github.com/Bajmein`; (2) diagrama Mermaid `flowchart LR` con 5 nodos (Usuario, Especificación, Motor, Agente IA, Output) y bucle de retroalimentación; (3) tabla de Arquitectura de Conocimiento (Notion, Obsidian, Filesystem); (4) tabla de comandos slash con ≥ 8 comandos de pipeline + 2 atajos; (5) tabla de Stack con exactamente 5 filas; (6) sección Estado con versión `v0.1.0`; (7) sección Licencia indicando que el código fuente no está disponible.

#### Scenario: Banner de exhibición presente y legible

**GIVEN** el archivo `README.md` en el repositorio `forge-showcase`
**WHEN** se renderiza en GitHub
**THEN** la primera sección visible es un bloque `[!IMPORTANT]` que indica explícitamente que el código fuente es privado y apunta a `github.com/Bajmein` para consultas

#### Scenario: Diagrama Mermaid SDD con 5 nodos y bucle de retroalimentación

**GIVEN** el `README.md` del showcase
**WHEN** GitHub renderiza el bloque `mermaid` de tipo `flowchart LR`
**THEN** el diagrama contiene exactamente los nodos Usuario, Especificación, Motor, Agente IA y Output, con una arista de retroalimentación desde Output hacia la especificación acumulada

#### Scenario: Tabla slash CLI con 10 comandos

**GIVEN** la sección `## Flujo de Comandos (Slash CLI)` del README
**WHEN** se cuentan las entradas de comandos
**THEN** hay al menos 8 comandos del pipeline (`/propose`, `/specify`, `/design`, `/break-to-tasks`, `/approve`, `/apply`, `/verify`, `/archive`) y 2 atajos (`/fast-draft`, `/fast-plan`)

#### Scenario: Stack table con 5 filas

**GIVEN** la sección `## Stack` del README
**WHEN** se cuentan las filas de la tabla
**THEN** hay exactamente 5 filas: Artefactos, Desarrollo, Validación, MCP Servers, Clientes IA

---

### Requirement: Forge Showcase — tree_structure.txt con topología anotada

El archivo `tree_structure.txt` SHALL contener la topología de directorios de Forge con anotaciones `#` para cada directorio clave; `src/forge/` y `tests/` marcados explícitamente como privados; subdirectorios de `.agents/skills/` (pipeline, shared, utility) y `.engine/` (changes, archive, ideas, schemas, specs) presentes.

#### Scenario: Directorios clave presentes y anotados

**GIVEN** el archivo `tree_structure.txt` del showcase
**WHEN** se verifica su contenido
**THEN** están presentes `.agents/`, `.engine/`, `docs/`, `src/`, `tests/` cada uno con comentario `#` explicativo

#### Scenario: src/forge/ y tests/ marcados como privados

**GIVEN** `tree_structure.txt`
**WHEN** se busca la palabra `privado` en las líneas de `src/forge/` y `tests/`
**THEN** ambas líneas contienen la palabra `privado` indicando exclusión del showcase

#### Scenario: Sin archivos .py bajo src/

**GIVEN** `tree_structure.txt`
**WHEN** se buscan nombres de archivos con extensión `.py` bajo la entrada `src/`
**THEN** no se encuentra ninguno — el directorio solo indica que el contenido es privado

---

### Requirement: Forge Showcase — mise.toml saneado sin variables privadas

El archivo `mise.toml` SHALL contener: comentario de sanitización en las primeras 3 líneas; sección `[tools]` con `python = "3.14"`, `uv`, `ruff`, `dprint`; 8 tareas (`default`, `install`, `lint`, `format`, `test`, `security`, `typecheck`, `check`) con `check` usando `depends`; sin sección `[vars]`, sin directiva `_.python.venv`, sin directiva `_.file`.

#### Scenario: Tareas del pipeline de calidad definidas

**GIVEN** el archivo `mise.toml` del showcase
**WHEN** se listan las secciones `[tasks.*]`
**THEN** están presentes exactamente: `default`, `install`, `lint`, `format`, `test`, `security`, `typecheck`, `check`

#### Scenario: check task con depends correctos

**GIVEN** la tarea `[tasks.check]` en `mise.toml`
**WHEN** se verifica el campo `depends`
**THEN** el valor es `["lint", "test", "security", "typecheck"]`

#### Scenario: Ausencia de configuración privada

**GIVEN** el contenido completo de `mise.toml`
**WHEN** se buscan las cadenas `[vars]`, `_.python.venv`, `_.file`
**THEN** no se encuentra ninguna de ellas — el archivo solo contiene configuración de referencia pública

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

#### Scenario: Test de cross-link pasa

**GIVEN** `docs/forge/index.md` con la sección nueva
**WHEN** se ejecuta `mise run test`
**THEN** el test `test_forge_links_to_showcase` pasa confirmando que `forge-showcase` aparece en el cuerpo de la página

---

### Requirement: Forge Zero Trust — Artefactos del showcase libres de información sensible

Los tres artefactos del showcase de Forge (`README.md`, `tree_structure.txt`, `mise.toml`) SHALL NO contener: código fuente Python de Forge, rutas locales privadas (`/home/`, `~/BenjaLabs/`), referencias al repositorio privado (`BenjaLabs/forge`, `BenjaLabs/locus`), tokens de API, ni configuración que identifique un entorno de producción.

#### Scenario: Ningún bloque de código Python en README

**GIVEN** el `README.md` del showcase de Forge
**WHEN** se buscan bloques de código con etiqueta ` ```python ` o ` ```py `
**THEN** no se encuentra ninguno — solo bloques `mermaid`, texto plano y TOML

#### Scenario: Sin rutas privadas ni referencias al repo privado

**GIVEN** el contenido de los tres artefactos
**WHEN** se buscan las cadenas `/home/`, `~/BenjaLabs/`, `BenjaLabs/forge`, `BenjaLabs/locus`
**THEN** ninguna aparece en ninguno de los tres archivos

---

### Requirement: Forge — Repositorio GitHub público creado y accesible

El repositorio `Bajmein/forge-showcase` SHALL existir en GitHub como repositorio público con descripción indicando que es un showcase SDD, homepage apuntando a la página de Forge en locus, y los tres artefactos en la rama `main`.

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
**THEN** existen los archivos: `README.md`, `tree_structure.txt`, `mise.toml`

## MODIFIED Requirements

### Requirement: docs/vigilia/index.md — Adición de sección sin romper requisitos existentes

La página `docs/vigilia/index.md` SHALL mantener todos sus requisitos previos (frontmatter SEO, secciones de Capacidades, Stack, Estado del Proyecto y Más sobre Vigilia) intactos tras la inserción de la sección `## Repositorio Vitrina`.

#### Scenario: Frontmatter sin cambios

**GIVEN** `docs/vigilia/index.md` modificado con la nueva sección
**WHEN** se verifica el frontmatter YAML
**THEN** los campos `title` y `description` son idénticos a los valores pre-modificación

#### Scenario: Secciones existentes preservadas

**GIVEN** `docs/vigilia/index.md` con la sección nueva añadida
**WHEN** se verifica la presencia de todos los encabezados H2
**THEN** los encabezados `## El Problema`, `## La Solución`, `## Capacidades`, `## Stack`, `## Estado del Proyecto` y `## Más sobre Vigilia` siguen presentes y en el mismo orden relativo entre sí

### Requirement: docs/forge/index.md — Adición de sección sin romper requisitos existentes

La página `docs/forge/index.md` SHALL mantener todos sus requisitos previos (frontmatter SEO, secciones de Capacidades, Stack, Estado del Proyecto y Más sobre Forge) intactos tras la inserción de la sección `## Repositorio Vitrina`.

#### Scenario: Frontmatter sin cambios

**GIVEN** `docs/forge/index.md` modificado con la nueva sección
**WHEN** se verifica el frontmatter YAML
**THEN** los campos `title` y `description` son idénticos a los valores pre-modificación

#### Scenario: Secciones existentes preservadas

**GIVEN** `docs/forge/index.md` con la sección nueva añadida
**WHEN** se verifica la presencia de todos los encabezados H2
**THEN** los encabezados `## El Problema`, `## La Solución`, `## Capacidades`, `## Stack`, `## Estado del Proyecto` y `## Más sobre Forge` siguen presentes y en el mismo orden relativo entre sí

## REMOVED Requirements

_No aplica._

## Changes

- `006-vigilia-showcase` (2026-04-07)
- `007-forge-showcase` (2026-04-07)
