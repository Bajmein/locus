# Locus

Infrastructure for orchestrating AI agents in a structured development pipeline.

Locus permite gestionar el ciclo de vida de cambios en un proyecto mediante una estructura de directorios estandarizada y un CLI potente.

## Requisitos

- Un CLI de agente IA: [Claude Code](https://claude.ai/code), Gemini CLI, o GitHub Copilot
- [mise](https://mise.jdx.dev/) (para development tooling)

## Instalación

1. Clona el repositorio.
2. Instala las herramientas de desarrollo con mise (opcional — solo para contribuidores):
   ```bash
   mise install && mise run install
   ```

## Configuración

La configuración del modelo y proveedor de LLM es gestionada nativamente por el **CLI del agente anfitrión** (Claude Code, Gemini CLI), no por Locus.

- **Claude Code**: configura el modelo en `.claude/settings.json` o con `locus config model <alias>`.
- **Gemini CLI**: configura en `.gemini/settings.json`.
- **Copilot**: el modelo se hereda del entorno de Copilot activo.

No se requiere un archivo `.env` ni variables de entorno `LOCUS_*` para la operación normal.

## Arquitectura de Conocimiento

Locus usa una jerarquía de fuentes de conocimiento para que los agentes consulten contexto en el orden correcto:

| Prioridad | Fuente         | Variable de Entorno         | Uso                                  |
| --------- | -------------- | --------------------------- | ------------------------------------ |
| 1 (alta)  | **Notion**     | `LOCUS_NOTION_SPECS_DB_ID`  | Especificaciones oficiales aprobadas |
| 1 (alta)  | **Notion**     | `LOCUS_NOTION_DOCS_ID`      | Documentación de referencia y APIs   |
| 1 (alta)  | **Notion**     | `LOCUS_NOTION_GUIDES_ID`    | Guías de proceso y directrices       |
| 2 (media) | **Obsidian**   | `LOCUS_OBSIDIAN_VAULT_PATH` | Patrones internos, ADRs, contexto    |
| 3 (baja)  | **Filesystem** | -                           | Artefactos del cambio activo         |

### Notion — fuente oficial

Notion es la fuente autoritativa para requisitos, documentación de APIs y guías de proceso.
Los agentes (`/specify`, `/design`) consultan Notion **antes** que Obsidian o el filesystem local.

Si Notion no está disponible, los agentes continúan con Obsidian + contexto local y añaden
una advertencia: `⚠️ Notion unavailable — output based on Obsidian and local context only.`

### Obsidian — uso interno únicamente

Obsidian (vault Episteme) está reservado para contexto **interno**:

- Architectural Decision Records (ADRs)
- Patrones descubiertos en el codebase
- Contexto de sesión y notas

**No usar Obsidian** para especificaciones oficiales, documentación de APIs ni guías de proceso.

## Estructura del Proyecto

```text
.agents/
  skills/          # System prompts de agentes (skills)
    pipeline/      # Skills de pipeline (propose, specify, design, apply, verify…)
    shared/        # Directivas compartidas entre agentes
    utility/       # Skills utilitarios (semantic-edit, explore…)
.engine/
  changes/         # Directorios NNN-slug/ por cada cambio activo
    archive/       # Cambios archivados
  ideas/           # Ideas/borradores de propuestas
  schemas/         # Schemas YAML — fuente de verdad de artefactos del pipeline
  specs/           # Especificaciones acumuladas (mergeadas tras archive)
```

## Uso del CLI (Agentes)

Locus ya no utiliza un CLI nativo en Python. Todo el flujo se orquesta mediante comandos "slash" (`/`) dentro de los clientes de IA compatibles (Gemini CLI, Claude Code), impulsados por archivos de configuración `.toml` y `.md` bajo `.gemini/commands/` y `.claude/commands/`.

### Comandos de Pipeline

Ejecuta estos comandos dentro del CLI de tu agente IA:

```text
/propose [idea]           # Genera una propuesta inicial (crea NNN-slug)
/specify <id-o-slug>      # Genera especificación desde la propuesta
/design <id-o-slug>       # Genera diseño técnico
/break-to-tasks <id>      # Desglosa diseño en tareas ejecutables
/approve <id-o-slug>      # Aprueba un cambio propuesto (proposed → approved)
/apply <id-o-slug>        # Implementa las tareas de un cambio en un git worktree
/verify <id-o-slug>       # Valida implementación, corre tests y comitea
/archive <id-o-slug>      # Archiva un cambio y consolida especificaciones
```

### Comandos de Utilidad

```text
/fast-draft [idea]        # Prototipa rápidamente una idea en draft
/fast-plan <id-o-slug>    # Acelera el pipeline ejecutando diseño y tareas juntas
/explore [topic]          # Exploración libre del codebase con un agente
/serena-init              # Inicializa Serena MCP para análisis de código
```

## Desarrollo Local (mise)

Todas las tareas de linting, testing y formateo se delegan en `mise` o `uv`:

```bash
mise run check      # Ejecuta todos los checks (test, lint, typecheck, security)
mise run test       # Ejecuta los tests con pytest
mise run format     # Formatea el código con ruff y dprint
```

## Stack

- **Artefactos**: YAML schemas + Markdown (no Python runtime en el flujo principal)
- **Herramientas de desarrollo**: mise, uv, ruff, dprint, bandit, ty, pytest
- **MCP**: context7-mcp, github-mcp, serena-mcp, obsidian-mcp
