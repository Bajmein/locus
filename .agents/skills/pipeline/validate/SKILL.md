# Skill: Validate

Valida un artefacto del pipeline contra su schema YAML. Este comando es de solo lectura —
no modifica archivos. Reporta pass/fail con errores específicos.

## Role & Objective

Eres un agente de validación. Tu tarea es leer un artefacto de pipeline, aplicar las reglas
del schema correspondiente en `.engine/schemas/`, y emitir un reporte detallado.

## Instructions

### Preparación

1. Parsear `$ARGUMENTS`:
   - Primer token: slug del cambio (`NNN-slug`).
   - Segundo token (opcional): tipo de artefacto — `proposal`, `spec`, `design`, `tasks`.
     Si omitido: validar los cuatro artefactos que existan.
2. Resolver directorio: `.engine/changes/$SLUG/`.
3. Leer schema(s) de `.engine/schemas/`: `proposal.yaml`, `spec.yaml`, `design.yaml`, `tasks.yaml`.

### Checks a ejecutar

**Step 0 — Nombre de carpeta**: Verificar que `$SLUG` coincide con `generates.folder_pattern` del schema.

**Step 1 — Parsear frontmatter**: Extraer bloque YAML entre delimitadores `---`. Si no existe → `✗ Missing frontmatter`.

**Step 2 — Campos requeridos**: Verificar cada campo en `frontmatter.required`:
- Ausente → `✗ Missing required field: <field>`
- Tipo incorrecto → `✗ Wrong type for <field>`
- Valor fuera de enum → `✗ Invalid value for <field>`

**Step 3 — Secciones del body**: Para cada entrada en `sections` con `required: true`:
- Si el heading no existe → `✗ Missing required section: <heading>`

**Step 4 — H1 title** (proposals y designs): Verificar que existe al menos un heading `#`.

**Step 5 — Formato de capabilities** (proposals): Cada capability name debe ser kebab-case: `^[a-z0-9]+(-[a-z0-9]+)*$`.

**Step 6 — Formato de tags** (proposals): Cada tag debe coincidir con `^[a-z0-9-]+:[a-z0-9-]+$`.

**Step 7 — Tasks completeness** (tasks.md): Contar `- [x]` y `- [ ]`. Debe existir al menos una tarea.

### Reporte de salida

```
## Validation Report: <NNN-slug> / <artifact-type>

Schema: .engine/schemas/<type>.yaml
File: .engine/changes/<NNN-slug>/<artifact>.md

### Frontmatter
✓ type: proposal
✗ Missing required field: priority

### Sections
✓ ## Why
✗ Missing required section: ## Impact

---
Result: FAIL  (2 errors found)
```

Si todos los checks pasan: `Result: PASS  (0 errors)`.

## Tools

- **File discovery**: Glob
- **Read**: artefactos, schema YAML files
- **Text search**: Grep (section headings, task items)
- **CLI (read-only)**: Bash para cat/grep si necesario
