# locus

Infraestructura para orquestar agentes de IA en un pipeline de desarrollo estructurado.
El proyecto define el flujo completo desde una idea hasta un plan ejecutable mediante artefactos schema-driven.

## Stack

- **Arquitectura**: Schema-driven pipeline (Markdown + YAML)
- **Source of Truth**: `.engine/schemas/*.yaml`
- **Agentes**: Basados en Skills (.agents/skills/)
- **Development tooling**: Python 3.14+ gestionado con `mise` + `uv`
- **Linting**: ruff, deptry, vulture
- **Format**: dprint
- **Security**: bandit
- **Testing**: pytest (valida schemas y estructura de artefactos)
- **Task runner**: mise (`mise.toml` en la raíz)
- **MCP**: context7, github, notion, serena, obsidian

## Estructura del proyecto

```
.agents/
  skills/          # Instrucciones centralizadas de agentes (system prompts)
    pipeline/      # Skills de flujo (propose, specify, design, apply, verify…)
    shared/        # Directivas comunes (knowledge-tiers, obsidian-knowledge)
    utility/       # Skills utilitarios (semantic-edit, explore…)
.engine/
  changes/         # Directorios NNN-slug/ por cada cambio activo
    archive/       # Cambios implementados y archivados
  ideas/           # Borradores de propuestas iniciales
  schemas/         # YAML Schemas — Fuente de verdad de la estructura del pipeline
  specs/           # Especificaciones acumuladas (mergeadas tras archive)
src/locus/
  __init__.py      # Namespace (skeleton)
tests/             # Validación de schemas y coherencia de artefactos
mise.toml          # Orquestador de tareas de desarrollo
llms.txt           # Mapeo de dependencias a Context7 IDs
```

## Ciclo de Vida del Cambio (Pipeline)

Los cambios siguen un flujo de estados estricto validado contra los schemas de `.engine/schemas/`:

1. **propose**: Crea `proposal.md` en `.engine/changes/NNN-slug/` (status: `proposed`)
2. **specify**: Genera `specs/<domain>/spec.md` (status: `proposed`)
3. **design**: Genera `design.md` (status: `proposed`)
4. **break-to-tasks**: Genera `tasks.md` (status: `draft`)
5. **approve**: Transiciona estados a `approved`
6. **apply**: Implementa las tareas aisladamente en un git worktree (`.worktrees/NNN-slug/`) (status: `implemented`)
7. **verify**: Valida la implementación, corre tests y comitea (status: `implemented`)
8. **archive**: Mueve el cambio a `archive/`, elimina el worktree y mergea specs (status: `archived`)

## Herramientas de Desarrollo (mise)

```bash
mise run install      # instala dependencias (uv sync)
mise run lint         # ruff + deptry + vulture
mise run format       # ruff format + dprint
mise run test         # pytest (valida schemas)
mise run check        # ejecuta todo (lint + test + security)
```

## Convenciones

- **Slugs**: kebab-case obligatorio (`mi-feature`, `fix-auth-bug`)
- **Carpetas**: `NNN-slug/` con padding de 3 dígitos
- **Configuración**: El agente usa la configuración nativa del CLI anfitrión (Gemini CLI / Claude Code). No se requieren variables de entorno `LOCUS_*`.
- **Discovery**: Los agentes descubren contexto dinámicamente vía MCP (Notion, Obsidian, Context7, Serena).

## Reliability

- **Schema Enforcement**: Los artefactos se validan estructuralmente contra sus schemas YAML.
- **FSM logic**: Las transiciones de estado (`status`) están gobernadas por las reglas definidas en los schemas de frontmatter.
- **Semantic Editing**: Se prefieren ediciones quirúrgicas en Markdown para mantener la integridad de los artefactos.
