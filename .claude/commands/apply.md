Implement the tasks defined in a change's tasks.md.

Usage: `/apply <NNN-slug>`

You are a software engineer executing the **apply** phase of Spec-Driven Development.

## Before You Begin

0. **Create the worktree** (if not already present):
   ```bash
   git worktree add .worktrees/$ARGUMENTS -b change/$ARGUMENTS 2>/dev/null \
     || echo "worktree already exists"
   ```
   Then edit `.engine/changes/$ARGUMENTS/proposal.md` in the **main repo** to add these fields under `optional`:
   ```yaml
   branch: change/$ARGUMENTS
   worktree: .worktrees/$ARGUMENTS
   ```
   All subsequent file reads and writes target the worktree root. When a task in `tasks.md` refers to a path like `src/locus/cli.py`, the actual path is `.worktrees/$ARGUMENTS/src/locus/cli.py`.

1. Resolve the change directory: `.engine/changes/$ARGUMENTS/`
2. Read `.engine/changes/$ARGUMENTS/tasks.md` — required. Abort and report if missing.
3. Read `.engine/changes/$ARGUMENTS/design.md` for architectural guidance.
4. Find and read the spec: `Glob(pattern=".engine/changes/$ARGUMENTS/specs/**/*.md")`
5. Identify pending tasks (`- [ ]`) vs completed (`- [x]`). Resume from the first unchecked task.
6. For each target file in upcoming tasks, explore its current state before modifying:
   - Serena MCP: `mcp__serena__find_symbol`, `mcp__serena__get_symbols_overview`
   - Read the file directly if small

## Execute

For each pending task in order:

1. Read the task description and target file path from `tasks.md`.
2. Implement the change using Edit or Write tools.
3. After completing the task, mark it done in `tasks.md`: change `- [ ] TXXX` to `- [x] TXXX`.
4. At each phase checkpoint, run `mise run test` via Bash. Fix failures before proceeding to the next phase.

After all tasks are complete, run the full suite:

```
mise run lint
mise run typecheck
mise run test
```

If all checks pass, edit `.engine/changes/$ARGUMENTS/proposal.md` — set `status: implemented`.

Do not deviate from `design.md`. When a task is ambiguous, read the design for clarification before acting.

## Tools

- **Symbol lookup (preferred)**: Serena MCP — `mcp__serena__find_symbol`, `mcp__serena__find_referencing_symbols`, `mcp__serena__get_symbols_overview`
- **Text search**: Grep
- **File discovery**: Glob
- **Structural search**: `ast-grep --pattern '...' --lang <lang> --json` via Bash
- **Edit / Write**: source code changes
- **Edit**: mark tasks done in `tasks.md`
- **CLI**: `mise run test/lint/typecheck`, `rg`, `ast-grep`, `eza`, `lsd`, `git` via Bash
