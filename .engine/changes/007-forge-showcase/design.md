---
type: design
domain: content
status: draft
author: claude-sonnet-4-6
created_at: 2026-04-07
spec: specs/content/spec.md
tags:
  - area:content
  - feature:showcase
  - path:docs/forge/index.md
  - area:infrastructure
  - feature:public-repo
  - path:tests/unit/test_pages_content.py
---

## Summary

El cambio se divide en dos ámbitos independientes: (1) un repositorio público nuevo en `~/BenjaLabs/showcase/forge-showcase/` con tres artefactos de arquitectura Zero Trust (`README.md` con banner + diagrama Mermaid SDD + tabla de comandos slash + tabla de stack, `tree_structure.txt` con topología anotada de directorios, `mise.toml` saneado con 7 tareas y sin variables privadas), creado y publicado con `gh repo create`; (2) la adición de la sección `## Repositorio Vitrina` con botón Material en `docs/forge/index.md`, insertada antes de `## Más sobre Forge` (actualmente línea 114). No se modifica `mkdocs.yml` (Forge ya está en `nav:`), ni el frontmatter de la página, ni las extensiones de MkDocs. Se añade un test de cross-link al archivo existente `test_pages_content.py`.

## Technical Context

| Field | Value |
|---|---|
| Language/Version | Markdown + TOML + plaintext (MkDocs 1.6+, Material for MkDocs) |
| Primary Dependencies | mkdocs-material, attr_list (ya habilitado), md_in_html (ya habilitado) |
| Storage | Dos sistemas de archivos: `locus/docs/` (sitio estático) + `~/BenjaLabs/showcase/forge-showcase/` (repo nuevo) |
| Testing | pytest (`tests/unit/test_pages_content.py` — test de cross-link añadido), `uv run mkdocs build --strict` |
| Target Platform | GitHub (showcase repo renderiza README), GitHub Pages vía Actions (locus) |
| Project Type | Sitio estático (MkDocs Material) + repositorio de exhibición standalone |
| Performance Goals | Sin assets nuevos en locus; sin requests externos desde la página de Forge |
| Constraints | Zero Trust: ningún artefacto del showcase expone código fuente Python, rutas locales privadas ni referencias a repositorios privados; build `--strict` sin warnings; tests existentes no se modifican |
| Scale/Scope | 1 sección añadida en locus, 1 test nuevo, 3 archivos en repo externo, 1 repo GitHub público |

## Architecture

### Ámbito A — locus: `docs/forge/index.md`

**Módulo modificado:** `docs/forge/index.md`

Insertar el bloque Markdown siguiente **inmediatamente antes de la línea que contiene `## Más sobre Forge`** (actualmente línea 114). El punto de inserción está tras el `---` de cierre de la sección Estado del Proyecto:

```markdown
---

## Repositorio Vitrina

El código fuente de Forge es privado. Para demostrar la arquitectura del pipeline,
la topología de directorios y el entorno de desarrollo, se mantiene un repositorio
de exhibición con documentación técnica y artefactos de referencia.

[Ver repositorio vitrina en GitHub](https://github.com/Bajmein/forge-showcase){ .md-button }

---
```

- El enlace usa la sintaxis `{ .md-button }` de `attr_list` (ya habilitado en `mkdocs.yml`).
- El `---` al inicio y al final mantienen el patrón visual del resto de secciones del archivo.
- El frontmatter (`title`, `description`) no se toca — los tests SEO de `test_pages_content.py` siguen pasando sin cambios.

**Módulo modificado (tests):** `tests/unit/test_pages_content.py`

Añadir un único test al grupo de cross-links (Phase 9), siguiendo el patrón de `test_forge_links_to_laboratorio`:

```python
def test_forge_links_to_showcase(forge_page):
    _, body = forge_page
    assert "forge-showcase" in body, (
        "forge/index.md must link to the forge-showcase repo"
    )
```

No se modifica `mkdocs.yml` — `- Forge: forge/index.md` ya está en `nav:`.

---

### Ámbito B — showcase: `~/BenjaLabs/showcase/forge-showcase/`

Repositorio standalone, completamente independiente de locus. Los tres artefactos se crean desde cero.

**`README.md`** — estructura:

1. Banner `[!IMPORTANT]` (primera línea visible en GitHub) identificando el repo como exhibición sin código fuente, con referencia a `github.com/Bajmein`.
2. Título `# Forge` y tagline.
3. Sección `## Spec-Driven Development (SDD)` con bloque `mermaid` de `flowchart LR` — cinco nodos: Usuario, Especificación, Motor, Agente IA, Output; con ciclo de retroalimentación (Output → Spec acumulado).
4. Sección `## Arquitectura de Conocimiento` con tabla de prioridades (Notion, Obsidian, Filesystem).
5. Sección `## Flujo de Comandos (Slash CLI)` con tabla de 8 comandos del pipeline (`/propose`, `/specify`, `/design`, `/break-to-tasks`, `/approve`, `/apply`, `/verify`, `/archive`) y 2 atajos (`/fast-draft`, `/fast-plan`).
6. Sección `## Stack` con tabla de 5 componentes.
7. Sección `## Estado` con versión `v0.1.0`.
8. Sección `## Licencia` con nota de código no disponible.

**`tree_structure.txt`** — topología de directorios anotada:

- `forge/` como raíz
- `.agents/` con subdirectorios `skills/pipeline/`, `skills/shared/`, `skills/utility/` — cada uno con comentario `#` descriptivo
- `.engine/` con `changes/`, `changes/archive/`, `ideas/`, `schemas/`, `specs/` — cada uno anotado
- `docs/` con listado de archivos de documentación técnica (sin contenido privado)
- `src/forge/` marcado explícitamente como privado: `# Código fuente (privado — no incluido en showcase)`
- `tests/` marcado como privado: `# Tests de validación (privado — no incluido en showcase)`
- Archivos raíz de configuración pública: `AGENTS.md`, `CHANGELOG.md`, `CLAUDE.md`, `dprint.json`, `llms.txt`, `mise.toml`, `pyproject.toml`, `README.md`

**`mise.toml`** (saneado) — estructura:

- Comentario de cabecera con nota explícita de sanitización (sin `[vars]`, sin `.env` loading).
- Sección `[tools]`: `python = "3.14"`, `uv = "latest"`, `ruff = "latest"`, `dprint = "latest"`.
- 8 tareas: `default` (lista tareas), `install` (uv sync), `lint` (ruff + deptry + vulture), `format` (ruff format + dprint), `test` (pytest), `security` (bandit), `typecheck` (ty check), `check` (depends: lint, test, security, typecheck).
- Sin sección `[vars]`, sin `_.python.venv`, sin `_.file = ".env"`.

**Secuencia de creación del repositorio:**

```bash
mkdir -p ~/BenjaLabs/showcase/forge-showcase
cd ~/BenjaLabs/showcase/forge-showcase
git init && git branch -M main
# Crear los 3 artefactos
git add README.md tree_structure.txt mise.toml
git commit -m "feat: initial forge showcase — architecture docs and dev environment reference"
gh repo create Bajmein/forge-showcase \
  --public \
  --description "Forge — SDD pipeline showcase. Source code is private. Architecture docs and dev tooling reference." \
  --homepage "https://bajmein.github.io/locus/forge/" \
  --source . --remote origin --push
```

## Data Model

### Sección insertada en `docs/forge/index.md`

| Campo | Valor |
|---|---|
| Encabezado | `## Repositorio Vitrina` |
| Posición | Antes de `## Más sobre Forge` (línea 114 del archivo original) |
| Enlace href | `https://github.com/Bajmein/forge-showcase` |
| Clase CSS del enlace | `md-button` (via `attr_list`: `{ .md-button }`) |
| Separador previo | `---` (antes del encabezado, para consistencia visual) |
| Separador posterior | `---` (al final de la sección) |
| Impacto en frontmatter | Ninguno |

### Test añadido a `test_pages_content.py`

| Campo | Valor |
|---|---|
| Nombre | `test_forge_links_to_showcase` |
| Fixture | `forge_page` (existente) |
| Aserción | `"forge-showcase" in body` |
| Grupo | Phase 9: Cross-links |

### Metadatos del repositorio GitHub

| Campo | Valor |
|---|---|
| Nombre | `forge-showcase` |
| Owner | `Bajmein` |
| Visibilidad | `public` |
| Descripción | `Forge — SDD pipeline showcase. Source code is private. Architecture docs and dev tooling reference.` |
| Homepage | `https://bajmein.github.io/locus/forge/` |
| Rama principal | `main` |
| Archivos raíz | `README.md`, `tree_structure.txt`, `mise.toml` |

## Key Decisions

### Decisión 1: Test de cross-link añadido a `test_pages_content.py` (no archivo nuevo)

- **Alternativas:** (a) archivo nuevo `test_forge_showcase.py`, (b) añadir a `test_pages_content.py`.
- **Decisión:** Añadir a `test_pages_content.py` en Phase 9.
- **Racional:** El test es estructuralmente idéntico a `test_forge_links_to_laboratorio` — mismo fixture `forge_page`, mismo patrón de aserción de substring. Crear un archivo nuevo para un único test sería overkill. Phase 9 ya está diseñada para cross-links de forge/vigilia.

### Decisión 2: Separador `---` al inicio y al final de "Repositorio Vitrina"

- **Alternativas:** (a) sin separador previo, (b) solo separador posterior, (c) ambos.
- **Decisión:** Separador `---` tanto antes como después de la sección.
- **Racional:** El archivo `forge/index.md` existente tiene el patrón consistente de `---` entre todas sus secciones H2. La propuesta muestra el bloque de inserción con `---` antes y después. Seguir el patrón visual existente.

### Decisión 3: `{ .md-button }` sin `--primary`

- **Alternativas:** (a) `{ .md-button .md-button--primary }`, (b) `{ .md-button }`.
- **Decisión:** `{ .md-button }` (botón secundario).
- **Racional:** La propuesta especifica `{ .md-button }` sin modificador `--primary`. Consistente con la decisión tomada en 006 (vigilia-showcase): el botón primario está reservado para acciones de mayor prominencia. Un enlace externo de referencia arquitectónica merece jerarquía secundaria.

### Decisión 4: Repositorio creado como standalone (no submódulo de locus)

- **Alternativas:** (a) submódulo git dentro de locus, (b) repositorio independiente.
- **Decisión:** Repositorio completamente independiente en `~/BenjaLabs/showcase/`.
- **Racional:** El showcase tiene ciclo de vida propio. Como submódulo, cualquier commit al showcase requeriría un commit de actualización en locus. El desacoplamiento es más limpio y el enlace en locus es simplemente una URL. Mismo patrón que 006.

### Decisión 5: `tree_structure.txt` en texto plano (no `tree_structure.md`)

- **Alternativas:** (a) Markdown con bloque de código, (b) archivo `.txt` plano.
- **Decisión:** Archivo `.txt` plano, con sintaxis de árbol estándar (`├──`, `└──`, `│`).
- **Racional:** La propuesta especifica `tree_structure.txt`. El formato texto plano es más portable, se renderiza correctamente en GitHub como código preformateado, y no requiere delimitadores de bloque de código adicionales.

### Decisión 6: `mise.toml` con tarea `default` listando tareas disponibles

- **Alternativas:** (a) sin tarea `default`, (b) `default` que ejecuta `check`.
- **Decisión:** Tarea `default` que ejecuta `mise tasks`.
- **Racional:** La propuesta incluye `[tasks.default]` con `run = "mise tasks"`. Es el patrón de Forge para que un usuario que descubra el repo pueda ejecutar `mise` sin argumentos y ver qué tareas existen, mejorando la DX del showcase como referencia de entorno.

## Project Structure

```
~/BenjaLabs/showcase/
└── forge-showcase/                         # new repo — standalone, no submódulo
    ├── README.md                            # new — banner exhibición, Mermaid SDD, slash CLI, stack
    ├── tree_structure.txt                   # new — topología anotada, src/ marcado privado
    └── mise.toml                            # new — saneado sin [vars] ni .env loading

locus/
├── docs/
│   └── forge/
│       └── index.md                        # modified — +sección "Repositorio Vitrina" antes de "Más sobre Forge"
└── tests/
    └── unit/
        └── test_pages_content.py           # modified — +test_forge_links_to_showcase en Phase 9
```

## Open Questions

_Ninguna. Los tres artefactos tienen contenido completamente especificado en la propuesta. La posición de inserción en `index.md` es inequívoca (línea 114, antes de `## Más sobre Forge`). Las extensiones MkDocs necesarias (`attr_list`) ya están habilitadas. El token de GitHub está disponible vía `gh` CLI autenticado._
