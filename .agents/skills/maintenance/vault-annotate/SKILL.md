---
description: Write a structured note to the episteme vault
argument-hint: "[decision|reference|context|skill|snippet] [topic]"
allowed-tools: Read, ToolSearch, mcp__obsidian__write_note, mcp__obsidian__read_note, mcp__obsidian__search_notes, mcp__obsidian__list_directory
---

Write a structured note to the Obsidian episteme vault at `/home/kenno/BenjaLabs/episteme/`.

The vault uses a **flat structure (no folders)**. Notes are organized by filename prefix and navigated via MOCs (Maps of Content), backlinks, and tags.

Usage: `/annotate [type] [topic]`

Arguments: `$ARGUMENTS`

## Phase 1 — Resolve tools

```
ToolSearch(query="select:mcp__obsidian__write_note,mcp__obsidian__read_note,mcp__obsidian__search_notes,mcp__obsidian__list_directory")
```

## Phase 2 — Parse arguments

Parse `$ARGUMENTS` as: `<type> <topic>`

- **type**: one of `decision`, `reference`, `context`, `skill`, `snippet`
- **topic**: remaining words become the slug (kebab-case) and title

If type is missing or not in the allowed list, ask the user:

> "What type of note? Options: decision, reference, context, skill, snippet"

If topic is missing, ask:

> "What is the topic or title for this note?"

## Phase 3 — Check for duplicates

Run `search_notes(topic)` before writing.

- If a matching note exists: show the path and ask "Update existing note or create new one?"
  - Update: read the note, draft changes, confirm, then patch/overwrite
  - New: continue to Phase 4

## Phase 4 — Determine path

Calculate the target path based on type:

### `decision` → `decision-NNN-slug.md`

1. `list_directory(".")` and count files matching `decision-*.md`
2. NNN = count + 1, zero-padded to 3 digits (e.g., `001`, `002`)
3. slug = kebab-case of topic
4. Path: `decision-NNN-slug.md`

### `reference` → `<domain>-NN-slug.md`

1. Ask user: "What domain? (e.g., locus, mise, uv)"
2. `list_directory(".")` and count files matching `<domain>-*.md` (excluding the MOC `<domain>.md`)
3. NN = count + 1, zero-padded to 2 digits
4. Path: `<domain>-NN-slug.md`

### `context` → `context-<proyecto>-<aspecto>.md`

1. Parse topic as `<proyecto>-<aspecto>` or ask user to clarify project and aspect
2. Path: `context-<proyecto>-<aspecto>.md`

### `skill` → `skill-<nombre>.md`

1. slug = kebab-case of topic
2. Path: `skill-<slug>.md`

### `snippet` → `snippet-<tema>.md`

1. slug = kebab-case of topic
2. Path: `snippet-<slug>.md`

## Phase 5 — Draft

Compose the full note (frontmatter + content) and **show it to the user** before writing.

Use today's date (2026-03-20 or current date) for `created`.

### Frontmatter by type

**decision:**

```yaml
---
title: "<NNN>: <Topic Title>"
type: decision
domain: <domain>
description: "<One sentence summarizing the decision.>"
tags: [decisions, <domain>, <topic-keyword>]
created: YYYY-MM-DD
status: proposed
superseded_by: ""
---
```

**reference:**

```yaml
---
title: "<Tool>: <Topic> Reference"
type: reference
domain: <domain>
description: "<One-line description.>"
tags: [<domain>, reference, <keywords>]
created: YYYY-MM-DD
source: ""
---
```

**context:**

```yaml
---
title: "<Proyecto>: <Aspecto>"
type: context
domain: <proyecto>
description: "Estado actual de <aspecto> en <proyecto>."
tags: [context, <proyecto>, <aspecto>]
created: YYYY-MM-DD
updated: YYYY-MM-DD
---
```

**skill:**

```yaml
---
title: "<Skill Name>"
type: skill
domain: library
description: "<What this skill does.>"
tags: [library, skill, <keywords>]
created: YYYY-MM-DD
confidence: 0.8
source_project: ""
evolved_at: YYYY-MM-DD
---
```

**snippet:**

```yaml
---
title: "<Snippet Topic>"
type: snippet
domain: library
description: "<What this snippet is for.>"
tags: [library, snippet, <keywords>]
created: YYYY-MM-DD
source: ""
---
```

### Body sections by type

**decision:**

```markdown
## Context

[What problem or situation motivated this decision?]

## Decision

[What was decided? Be concrete.]

## Consequences

[What does this imply? Trade-offs, impact, next steps.]

## Status

`proposed`
```

**reference:**

```markdown
## Overview

[Brief description of what this documents.]

---

## [Section 1]

[Content]

---

## [Section N]

[Content]

---

## Quick Reference

[Table or summary of key points]
```

**context:**

```markdown
## Current State

[Concrete description: versions, paths, active configurations.]

## Active Work

[What is in progress? Who is working on what?]

## Key Constraints

[Freezes, external dependencies, blockers.]

## Last Updated

YYYY-MM-DD — [Summary of what changed]
```

**skill:**

```markdown
## Overview

[What this skill does and when to use it.]

## Usage

`/skill-name [args]`

## Rules

1. [Rule or step 1]
2. [Rule or step 2]

## Examples

[Concrete usage examples]
```

**snippet:**

````markdown
## Usage

[When to use this snippet]

```[lang]
[code or config]
```
````

## Notes

[Any caveats, variations, or related snippets]

```
Ask the user: "Does this look correct? (yes to write, or provide corrections)"

## Phase 6 — Write

Once confirmed:
```

write_note(path, content)

```
## Phase 7 — Verify

Immediately after writing:
```

read_note(path)

```
Check that:
- Frontmatter fields are present and correct
- Required fields for the type are not empty
- `type` field matches the intended type

If verification fails, report the discrepancy and offer to rewrite.

## Phase 8 — Report

Confirm to the user:
```

✓ Note written: <path>
Type: <type>
Title: <title>
Tags: <tags>

```
```
