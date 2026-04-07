# Skill: Rollback

Revierte un cambio aplicado a su estado pre-apply. Usar cuando `/verify` falla y la
implementación debe descartarse para re-aplicar desde un estado limpio.

## Role & Objective

Eres un agente de recuperación. Tu tarea es deshacer la aplicación de un cambio:
eliminar el worktree, borrar la rama, y resetear los artefactos a `approved`.

## Instructions

### Pre-condiciones

1. Resolver el directorio del cambio: `.engine/changes/$ARGUMENTS/`.
2. Leer `proposal.md`. Extraer: `status`, `branch`, `worktree`, `domain`, `github_issue`.
3. Validar que `status` sea `implemented` o `approved` (rollback parcial si existe worktree).
   - Si `status == archived`: detener — el archive es permanente.
   - Si `status == proposed` y no hay campo `worktree`: detener — nada que revertir.
4. **Confirmar con el usuario** antes de proceder (operación destructiva):
   ```
   ⚠️  Rolling back $ARGUMENTS will:
     - Remove worktree: <worktree path>
     - Delete local branch: <branch>
     - Reset proposal.md status to: approved
   Proceed? (yes/no)
   ```
   Esperar confirmación explícita `yes`. Cualquier otra respuesta = abortar.

### Ejecución

**Step 1 — Cerrar PR abierto** (si `github_issue` presente):
```bash
gh pr view "change/$ARGUMENTS" --json state --jq '.state' 2>/dev/null || echo "not_found"
```
- Si `OPEN`: cerrar sin mergear con comentario de rollback.
- Si `MERGED`: detener — no se puede revertir un PR mergeado.

**Step 2 — Eliminar worktree**:
```bash
git worktree remove <worktree_path> --force
```

**Step 3 — Eliminar rama local y remota**:
```bash
git branch -D change/$ARGUMENTS 2>/dev/null || true
git push origin --delete "change/$ARGUMENTS" 2>/dev/null || true
```

**Step 4 — Resetear artefactos** (en el repo principal):
- `proposal.md`: `status: approved`, remover campos `branch` y `worktree`.
- `tasks.md`: `status: draft`, resetear todos `- [x]` → `- [ ]`.
- `design.md`: `status: draft`.
- `specs/**/*.md`: `status: draft`.

**Step 5 — Commit**:
```bash
git add .engine/changes/$ARGUMENTS/
git commit -m "chore($ARGUMENTS): rollback to approved — re-apply pending"
```

## Output

```
✓ Change $ARGUMENTS rolled back to status: approved
  - Worktree removed: <path>
  - Branch deleted: change/$ARGUMENTS

Next steps:
  1. Fix the issues identified in /verify output.
  2. Run /apply $ARGUMENTS to re-implement.
  3. Run /verify $ARGUMENTS to validate again.
```

## Tools

- **Read**: proposal.md, tasks.md, design.md, specs
- **Edit**: frontmatter fields en archivos de artefactos
- **CLI**: `git worktree remove`, `git branch -D`, `git push --delete`, `gh pr view/close` via Bash
