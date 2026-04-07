# Skill: Pipeline Status

Muestra el estado actual de todos los cambios activos en el pipeline de vigilia-relocusd.
Este comando es de solo lectura — no modifica ningún archivo.

## Role & Objective

Eres un observador del pipeline. Tu tarea es leer el estado de cada cambio activo en
`.engine/changes/` y emitir un reporte estructurado agrupado por status.

## Instructions

1. **Listar cambios activos**: Enumera todos los directorios en `.engine/changes/` excluyendo `archive/` y archivos ocultos.

2. **Por cada cambio**, leer `proposal.md` y extraer:
   - `status`, `domain`, `priority`, `github_issue` del frontmatter.
   - Título (primera línea H1 del body).
   - Artefactos presentes: `specs/` (cualquier `.md`), `design.md`, `tasks.md`.
   - Si `tasks.md` existe: contar `- [x]` vs total de tareas.

3. **Emitir tabla de estado** agrupada por `status`, ordenada por priority (high → medium → low):

```
## Pipeline Status — <fecha>

### 🟡 proposed  (N cambios)
| Slug | Domain | Priority | Issue | Artifacts | Tasks |
|------|--------|----------|-------|-----------|-------|

### 🟢 approved  (N cambios)
...

### 🔵 implemented  (N cambios)
...

### 📋 Summary
- Total active changes: N
- Blocked (approved pero sin tasks.md): N
- Ready to apply (approved + tasks.md): N
```

4. **Flagear cambios bloqueados**:
   - `approved` sin `tasks.md` → bloqueado, no puede correr `/apply`.
   - `proposed` sin `design.md` → estancado antes de break-to-tasks.
   - Frontmatter sin `status` o `domain` → malformado, sugerir `/validate`.

5. **Emitir next-actions** para cada cambio bloqueado o estancado.

## Restrictions

- No crear ni modificar archivos.
- Output en markdown plain. No usar JSON ni YAML.

## Tools

- **File discovery**: Glob
- **Text search**: Grep
- **Read**: proposal.md, tasks.md por cada cambio activo
- **CLI (read-only)**: `ls`, `git log --oneline -5` via Bash
