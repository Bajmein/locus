---
alwaysApply: true
---

# Serena MCP — cuándo y cómo usarlo

Serena corre con `--context claude-code`. Herramientas disponibles:
`find_symbol`, `find_referencing_symbols`, `get_symbols_overview`,
`replace_symbol_body`, `insert_after_symbol`, `insert_before_symbol`, `activate_project`.

## Decisión rápida

| Necesito...                                          | Herramienta                                    |
| ---------------------------------------------------- | ---------------------------------------------- |
| Texto literal o regex en archivos                    | `Grep` — no Serena                             |
| Archivos por nombre/patrón                           | `Glob` — no Serena                             |
| Patrones estructurales de código                     | `ast-grep` vía Bash                            |
| Qué símbolos define un archivo (sin leerlo completo) | `get_symbols_overview`                         |
| Dónde está definida una función/clase                | `find_symbol`                                  |
| Qué referencias tiene un símbolo                     | `find_referencing_symbols`                     |
| Reemplazar el cuerpo de una función/método           | `replace_symbol_body`                          |
| Insertar código relativo a un símbolo existente      | `insert_after_symbol` / `insert_before_symbol` |

## Cuándo usar Serena

Usar cuando la pregunta es **semántica**, no textual:

- "¿Qué hace esta función?" → `get_symbols_overview` + `find_symbol`
- "¿Quién llama a `build_prompt`?" → `find_referencing_symbols`
- "Refactorizar `next_id` cambiando su firma" → `find_symbol` → `replace_symbol_body`
- "Agregar un método a la clase `Change`" → `find_symbol` → `insert_after_symbol`

## Flujo estándar

```
1. ToolSearch("select:mcp__serena__get_symbols_overview,mcp__serena__find_symbol")
2. get_symbols_overview(path)         ← vista de símbolos sin leer todo el archivo
3. find_symbol("NombreClase")         ← si no conoces la ruta exacta
4. find_referencing_symbols(...)      ← solo para análisis de impacto/refactor
5. replace_symbol_body(...)           ← editar con precisión de símbolo
```

## Cuándo NO usar Serena

- Búsquedas de texto en YAML/Markdown/config: usar `Grep`.
- Exploración de estructura de directorios: usar `Glob`.
- Cuando Grep ya encontró exactamente lo que necesitas — no añadir una llamada redundante.
- Si no hay `.serena/project.yml` en el proyecto activo: usar `Grep` + `Glob`.

## Activación

El proyecto locus tiene `.serena/project.yml`. Solo llama `activate_project` si recibes
error "no active project" o al cambiar a un worktree distinto.
