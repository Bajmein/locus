Verify that a change was correctly implemented against its spec, design, and tasks.

Usage: `/verify <NNN-slug>`

You are a QA engineer executing the **verify** phase of Spec-Driven Development.

## Before You Begin

1. Resolve the change directory: `.engine/changes/$ARGUMENTS/`
2. Read `.engine/changes/$ARGUMENTS/proposal.md` — note `domain`, `worktree`, and the first line of `## What Changes` for the commit message.
3. Read all three artifacts:
   - `.engine/changes/$ARGUMENTS/tasks.md`
   - `.engine/changes/$ARGUMENTS/design.md`
   - Spec: `Glob(pattern=".engine/changes/$ARGUMENTS/specs/**/*.md")` → read it
4. Note which tasks are marked done (`- [x]`) vs pending (`- [ ]`).

## Execute

1. **Run the quality checks** via Bash:
   ```
   mise run test
   mise run lint
   mise run typecheck
   ```
   Capture pass/fail status and any error output for each.

2. **Cross-reference tasks vs code**: for each completed task (`- [x]`), verify the described change is present in the target file. Use Serena MCP, Grep, or Read as appropriate.

3. **Cross-reference spec vs implementation**: for each requirement in the `## ADDED Requirements` section, verify a corresponding test scenario exists and passes.

4. **Emit a Verification Report**:

```
## Verification Report

**Status**: PASS | FAIL

### Quality Checks
- Tests: PASS | FAIL (N passed, M failed)
- Lint: PASS | FAIL
- Typecheck: PASS | FAIL

### Task Completion
- X / Y tasks marked done
- Uncompleted tasks: [list if any]

### Spec Coverage
- Requirement: <Name> — VERIFIED | MISSING
- ...

### Issues Found
[List any discrepancies, failing tests, or missing implementations]
```

5. **Commit (only when Status is PASS and Issues Found is empty)**

   If there are any issues found: fix them first, re-run the quality checks, and re-emit the report. Only proceed to commit once the report shows PASS with no issues.

   Build the commit message from proposal metadata:
   - `type`: `feat`
   - `scope`: `domain` field from proposal frontmatter
   - `description`: first meaningful line from `## What Changes` (imperative, max 72 chars total)

   Format: `feat(<domain>): <description>`

   Stage and commit from the worktree:
   ```bash
   git -C .worktrees/$ARGUMENTS add -A
   git -C .worktrees/$ARGUMENTS commit -m "feat(<domain>): <description>"
   ```

   If `worktree` is not set in proposal.md (change predates worktrees), commit from the main repo instead:
   ```bash
   git add -A
   git commit -m "feat(<domain>): <description>"
   ```

6. **Update CHANGELOG.md**

   After a successful commit, add an entry under `## [Unreleased]` in `CHANGELOG.md` (main repo root).

   - Determine the appropriate subsection (`### Added`, `### Changed`, `### Fixed`, `### Removed`) from the nature of the change described in `## What Changes`.
   - Write a concise bullet point summarising what was delivered. Reference the domain and slug.
   - If the subsection already exists, append to it; if not, add it below `## [Unreleased]`.
   - Do **not** create a new versioned section — entries accumulate under `[Unreleased]` until a release is cut.

7. **Update artifact statuses** (main repo, always — even if worktree was used)

   Mark all pipeline artifacts for this change as `implemented`/`done` in their frontmatter:

   - `spec.md` (all files under `.engine/changes/$ARGUMENTS/specs/`): `status: implemented`
   - `design.md`: `status: implemented`
   - `tasks.md`: `status: done`

   Edit each file's frontmatter in-place. These status values are valid per the schemas
   (`spec.yaml` and `design.yaml` allow `implemented`; `tasks.yaml` allows `done`).

   Commit these status updates to the main repo:
   ```bash
   git add .engine/changes/$ARGUMENTS/
   git commit -m "chore($ARGUMENTS): mark artifacts as implemented"
   ```

## Tools

- **CLI**: `mise run test`, `mise run lint`, `mise run typecheck` via Bash
- **Symbol lookup**: Serena MCP — `mcp__serena__find_symbol`, `mcp__serena__get_symbols_overview`
- **Text search**: Grep
- **File discovery**: Glob
- **Read**: source files, artifacts
