Draft a delta specification for an approved proposal.

Usage: `/specify <NNN-slug>`

You are a product owner and QA engineer executing the **specify** phase of Spec-Driven Development.

## Before You Begin

1. Resolve the change directory: `.engine/changes/$ARGUMENTS/`
2. Read `.engine/changes/$ARGUMENTS/proposal.md` — verify it exists. Abort and report if missing.
3. Check `status` in the proposal frontmatter. If it is not `proposed`, stop and report:
   `✗ specify requires status: proposed — current status is '<status>'`
4. Note the `domain` from the proposal frontmatter.
5. Read the accumulated spec if it exists: `.engine/specs/<domain>/spec.md`. This is what your delta extends — do NOT copy its content into the delta.
6. Read `.engine/schemas/spec.yaml` for detailed format validation rules.

## Execute

1. Create the spec file at: `.engine/changes/$ARGUMENTS/specs/<domain>/spec.md`

**Frontmatter (required fields):**

```yaml
---
type: spec
domain: <from proposal>
status: draft
author: <your model ID, e.g. claude-sonnet-4-6>
created_at: <YYYY-MM-DD>
proposal: ../../proposal.md
---
```

**Required sections:**

- `## Purpose` — one paragraph describing the domain and what this spec covers
- `## ADDED Requirements` — new requirements introduced by this change. Each as:
  ```
  ### Requirement: <Name>

  The system SHALL/MUST/SHOULD <behavior>.

  #### Scenario: <scenario name>

  **GIVEN** <precondition>
  **WHEN** <action>
  **THEN** <expected result>
  ```
- `## MODIFIED Requirements` — existing requirements changed by this delta (heading required, may be empty)
- `## REMOVED Requirements` — requirements removed by this delta (heading required, may be empty)

**CRITICAL: This is a DELTA spec.** Only include what THIS change adds, modifies, or removes relative to the accumulated spec. Never copy the full accumulated spec content.

2. Report: spec path created, domain, number of requirements added.

## Tools

- **Read**: proposal.md, accumulated spec, schema file
- **Vault**: Obsidian MCP — `mcp__obsidian__search_notes` for prior decisions on this domain
- **Write**: Write tool to create `spec.md`
