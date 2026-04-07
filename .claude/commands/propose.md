Draft a proposal for a new change in the Locus pipeline.

Usage: `/propose <idea-description or NNN-slug>`

You are a software architect executing the **propose** phase of Spec-Driven Development.

## Before You Begin

1. Parse `$ARGUMENTS`. If it looks like a change slug (`NNN-slug`), check `.engine/changes/$ARGUMENTS/` for an existing `proposal.md` — you may be updating a draft. If it's free-text, you will create a new change directory.
2. Determine the next sequential change number: `Glob(pattern=".engine/changes/[0-9]*")` → find the highest NNN, increment by 1.
3. Check `.engine/ideas/` for any matching idea file (`Glob(pattern=".engine/ideas/*.md")`). Read it if found.
4. Read `.engine/CAMPAIGN.md` or `.engine/changes/roadmap.md` for strategic context if they exist.
5. Read `.engine/specs/` to understand the current accumulated spec state for the relevant domain.
6. Explore the codebase for the idea's domain:
   - Serena MCP: `mcp__serena__get_symbols_overview`, `mcp__serena__find_symbol`
   - Grep / Glob for file patterns and content
   - Obsidian MCP: `mcp__obsidian__search_notes` for prior decisions

## Execute

1. Determine the change directory: `.engine/changes/<NNN>-<slug>/` (slug = kebab-case summary of the idea).
2. Write `.engine/changes/<NNN>-<slug>/proposal.md`:

**Frontmatter (required fields):**

```yaml
---
type: proposal
domain: <area of the system>
status: proposed
priority: <low|medium|high>
author: <your model ID, e.g. claude-sonnet-4-6>
created_at: <YYYY-MM-DD>
model: <human-readable model name>
tags:
  - area:<domain>
  - feature:<kebab-case-feature-name>
  - path:<affected/file.py>
---
```

**Required sections (H2 headings):**

- `## Why` — motivation and problem statement
- `## What Changes` — high-level behavioral and structural changes
- `## Capabilities` — bulleted list; each capability name in **kebab-case** with a one-line description
- `## Impact` — affected modules, risks, dependencies, breaking changes

3. Report: change directory created, proposal path, and a summary of key capabilities proposed.

## Tools

- **Symbol lookup**: Serena MCP — `mcp__serena__find_symbol`, `mcp__serena__get_symbols_overview`
- **Text search**: Grep
- **File discovery**: Glob
- **Structural search**: `ast-grep --pattern '...' --lang <lang> --json` via Bash
- **Vault context**: Obsidian MCP — `mcp__obsidian__search_notes`, `mcp__obsidian__read_note`
- **CLI (read-only)**: `eza`, `lsd`, `git log`, `rg` via Bash
- **Write**: Write tool for `proposal.md`
