Draft a technical design document from an approved spec.

Usage: `/design <NNN-slug>`

You are a technical architect executing the **design** phase of Spec-Driven Development.

## Before You Begin

1. Resolve the change directory: `.engine/changes/$ARGUMENTS/`
2. Read `.engine/changes/$ARGUMENTS/proposal.md` for domain and context. Check `status` — if it is not `proposed`, stop and report:
   `✗ design requires status: proposed — current status is '<status>'`
3. Find and read the delta spec: `Glob(pattern=".engine/changes/$ARGUMENTS/specs/**/*.md")` → read it.
4. Read the accumulated spec if it exists: `.engine/specs/<domain>/spec.md`
5. Read `.engine/schemas/design.yaml` for format validation rules.
6. **Explore the codebase** for the affected domain before designing:
   - Serena MCP: `mcp__serena__get_symbols_overview`, `mcp__serena__find_symbol`, `mcp__serena__find_referencing_symbols`
   - Grep / Glob for file patterns and content
   - `ast-grep --pattern '...' --lang <lang> --json` for structural patterns
   - Read key source files listed in the proposal's Impact section

## Execute

1. Write `.engine/changes/$ARGUMENTS/design.md`:

**Frontmatter (required fields):**

```yaml
---
type: design
domain: <from spec>
status: draft
author: <your model ID, e.g. claude-sonnet-4-6>
created_at: <YYYY-MM-DD>
spec: specs/<domain>/spec.md
tags:
  - area:<domain>
  - path:<affected/file.py>
---
```

**Required sections (all 7 must be present):**

- `## Summary` — one paragraph on the technical approach ("the how")
- `## Technical Context` — table with exactly 9 fields: Language/Version, Primary Dependencies, Storage, Testing, Target Platform, Project Type, Performance Goals, Constraints, Scale/Scope
- `## Architecture` — modules involved, interactions, new abstractions, integration with existing code
- `## Data Model` — Pydantic models, data structures, schema changes, field names and types
- `## Key Decisions` — each entry must include: Decision, Alternatives considered, Rationale
- `## Project Structure` — file tree showing new files `(new)` and modified files `(modified)`
- `## Open Questions` — unresolved technical questions (may be empty, heading required)

2. Report: design path, key architectural decisions made, open questions identified.

## Tools

- **Symbol lookup (preferred)**: Serena MCP — `mcp__serena__find_symbol`, `mcp__serena__find_referencing_symbols`, `mcp__serena__get_symbols_overview`
- **Text search**: Grep
- **File discovery**: Glob
- **Structural search**: `ast-grep --pattern '...' --lang <lang> --json` via Bash
- **Read**: source files, spec, proposal, schema
- **Vault**: Obsidian MCP — `mcp__obsidian__search_notes` for ADRs and architecture notes
- **CLI (read-only)**: `rg`, `eza`, `lsd`, `git log` via Bash
- **Write**: Write tool for `design.md`
