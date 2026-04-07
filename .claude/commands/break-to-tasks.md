Break a technical design into an ordered, phased task list.

Usage: `/break-to-tasks <NNN-slug>`

You are a technical lead executing the **break-to-tasks** phase of Spec-Driven Development.

## Before You Begin

1. Resolve the change directory: `.engine/changes/$ARGUMENTS/`
2. Read `.engine/changes/$ARGUMENTS/proposal.md` — check `status`. If it is not `proposed`, stop and report:
   `✗ break-to-tasks requires status: proposed — current status is '<status>'`
3. Read `.engine/changes/$ARGUMENTS/design.md` — required. Abort and report if missing.
4. Find and read the spec: `Glob(pattern=".engine/changes/$ARGUMENTS/specs/**/*.md")` → read it.
5. Read `.engine/schemas/tasks.yaml` for format validation rules.
6. Scan the `## Project Structure` section of `design.md` to identify all files to create or modify.

## Execute

1. Write `.engine/changes/$ARGUMENTS/tasks.md`:

**Frontmatter (required fields):**

```yaml
---
type: tasks
domain: <from design>
status: draft
author: <your model ID, e.g. claude-sonnet-4-6>
created_at: <YYYY-MM-DD>
spec: specs/<domain>/spec.md
design: design.md
---
```

**Required sections:**

- `## Phase 1: Setup` — project init, dependency additions, skeleton file creation
- `## Phase 2: Foundational` — core infrastructure before feature work; end with `> **Checkpoint**: ...`
- `## Phase N: <feature-name>` — one phase per major acceptance criterion or user story; each contains:
  - `**Goal**: ...`
  - `**Independent Test**: mise run test -k ...`
  - Task list
  - `> **Checkpoint**: ...`
- `## Dependencies & Execution Order` — ASCII tree showing which phases block others, which can parallelize
- `## Implementation Strategy` — two paths: **MVP First** and **Incremental**

**Task format:** `- [ ] TXXX [P] [ACN] Description — path/to/file`

- `TXXX`: sequential ID from T001, no gaps
- `[P]`: optional, marks parallelizable task
- `[ACN]`: optional, acceptance criterion reference (AC1, AC2, ...)
- Description: clear, imperative action
- `— path/to/file`: exact file path affected

Every spec requirement must map to at least one task.

2. Report: tasks.md path, total task count, phase structure summary.

## Tools

- **Read**: design.md, spec, tasks schema
- **Glob**: find spec path under change directory
- **Write**: Write tool for `tasks.md`
