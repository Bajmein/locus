Rapidly draft both a design and task breakdown for an existing spec in a single run (design + break-to-tasks).

Usage: `/fast-plan <NNN-slug>`

You are executing **design + break-to-tasks** back-to-back for speed.

## Before You Begin

1. Resolve the change directory: `.engine/changes/$ARGUMENTS/`
2. Read `.engine/changes/$ARGUMENTS/proposal.md` for domain and context. Check `status` — if it is not `proposed`, stop and report:
   `✗ fast-plan requires status: proposed — current status is '<status>'`
3. Find and read the spec: `Glob(pattern=".engine/changes/$ARGUMENTS/specs/**/*.md")` → read it.
4. Read the accumulated spec if it exists: `.engine/specs/<domain>/spec.md`
5. Read `.engine/schemas/design.yaml` and `.engine/schemas/tasks.yaml` for format validation rules.
6. **Explore the codebase** for the affected domain:
   - Serena MCP: `mcp__serena__get_symbols_overview`, `mcp__serena__find_symbol`
   - Grep / Glob for file patterns and content
   - `ast-grep --pattern '...' --lang <lang> --json` for structural patterns
   - Read key source files listed in the proposal's Impact section

## Execute

**Phase 1 — Design:** Write `.engine/changes/$ARGUMENTS/design.md`

Frontmatter: `type: design`, `domain`, `status: draft`, `author`, `created_at`, `spec: specs/<domain>/spec.md`

Required sections (all 7): `## Summary`, `## Technical Context` (9-field table: Language/Version, Primary Dependencies, Storage, Testing, Target Platform, Project Type, Performance Goals, Constraints, Scale/Scope), `## Architecture`, `## Data Model`, `## Key Decisions` (each: Decision, Alternatives, Rationale), `## Project Structure` (file tree with `(new)` / `(modified)`), `## Open Questions`

**Phase 2 — Break to Tasks:** Write `.engine/changes/$ARGUMENTS/tasks.md`

Frontmatter: `type: tasks`, `domain`, `status: draft`, `author`, `created_at`, `spec: specs/<domain>/spec.md`, `design: design.md`

Required sections: `## Phase 1: Setup`, `## Phase 2: Foundational`, `## Phase N: <feature>` (one per AC), `## Dependencies & Execution Order`, `## Implementation Strategy`

Task format: `- [ ] TXXX [P] [ACN] Description — path/to/file`

3. Report: both artifacts created, key design decisions, total task count, phase structure.

## Tools

- **Symbol lookup (preferred)**: Serena MCP — `mcp__serena__find_symbol`, `mcp__serena__find_referencing_symbols`, `mcp__serena__get_symbols_overview`
- **Text search**: Grep
- **File discovery**: Glob
- **Structural search**: `ast-grep --pattern '...' --lang <lang> --json` via Bash
- **Vault**: Obsidian MCP — `mcp__obsidian__search_notes`
- **Write**: Write tool for both `design.md` and `tasks.md`
