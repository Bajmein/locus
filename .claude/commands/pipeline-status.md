Show the current status of all active changes in the pipeline.

Usage: `/pipeline-status`

You are a pipeline observer. This command does NOT modify any files. Your job is to read
and report the state of all active changes.

## Execute

1. List all directories under `.engine/changes/` that are NOT `archive/`:

   ```bash
   ls .engine/changes/
   ```

2. For each directory (excluding `archive/` and hidden files like `.gitkeep`):
   - Read `proposal.md` and extract frontmatter fields: `status`, `domain`, `priority`, `github_issue`, and the first H1 line as the change title.
   - Check which artifact files exist: `specs/` (any `.md`), `design.md`, `tasks.md`.
   - If `tasks.md` exists, count checked tasks (`- [x]`) vs total tasks (`- [x]` + `- [ ]`).

3. Emit a status table grouped by `status` value, ordered by priority (high → medium → low):

```
## Pipeline Status — <date>

### 🟡 proposed  (N changes)
| Slug | Domain | Priority | Issue | Artifacts | Tasks |
|------|--------|----------|-------|-----------|-------|
| NNN-slug | domain | high | #N | proposal ✓ spec ✓ design ✗ tasks ✗ | — |

### 🟢 approved  (N changes)
| Slug | Domain | Priority | Issue | Artifacts | Tasks |
|------|--------|----------|-------|-----------|-------|
| NNN-slug | domain | medium | #N | proposal ✓ spec ✓ design ✓ tasks ✓ | 12/24 |

### 🔵 implemented  (N changes)
...

### 📋 Summary
- Total active changes: N
- Blocked (approved but missing tasks.md): N
- Ready to apply (approved + tasks.md present): N
```

4. Flag any **blocked** changes:
   - `approved` status but `tasks.md` is missing → blocked, cannot run `/apply`.
   - `proposed` status but `design.md` is missing → stalled before break-to-tasks.
   - Any frontmatter field missing `status` or `domain` → malformed, needs `/validate`.

5. Emit a next-actions hint for each blocked or stalled change.

## Output format

Plain markdown table — do not use JSON or YAML output. Emit to stdout.
No files are created or modified.

## Tools

- **File discovery**: Glob
- **Text search**: Grep
- **Read**: proposal.md, tasks.md for each active change
- **CLI (read-only)**: `ls`, `cat`, `git log --oneline -5` via Bash
