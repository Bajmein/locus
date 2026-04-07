Validate a pipeline artifact against its YAML schema.

Usage: `/validate <NNN-slug> [proposal|spec|design|tasks]`

You are a validation agent. This command does NOT modify any files. It reads an artifact,
applies the rules from the corresponding schema in `.engine/schemas/`, and reports pass/fail.

## Before You Begin

1. Parse `$ARGUMENTS`:
   - First token: change slug (`NNN-slug`) only.
   - Second token (optional): artifact type — one of `proposal`, `spec`, `design`, `tasks`.
     If omitted, validate **all four** artifacts that exist for the change.
2. Resolve the change directory: `.engine/changes/$SLUG/`.
3. Read the relevant schema file(s) from `.engine/schemas/`:
   - `proposal.yaml` for `proposal.md`
   - `spec.yaml` for `specs/**/*.md`
   - `design.yaml` for `design.md`
   - `tasks.yaml` for `tasks.md`

## Execute

For each artifact to validate:

### Step 0 — Folder name vs schema pattern

Read `generates.folder_pattern` from the loaded schema and assert that the folder name
`$SLUG` matches the pattern.
If it does not match:

- `✗ Folder name '$SLUG' does not match generates.folder_pattern: '<pattern>'`

### Step 1 — Parse frontmatter

Extract and parse the YAML block between the opening and closing `---` delimiters.
If the file does not start with `---`, report: `✗ Missing frontmatter`.

### Step 2 — Required fields check

Cross-reference with `frontmatter.required` in the schema. For each required field:

- If absent → `✗ Missing required field: <field>`
- If present but wrong type → `✗ Wrong type for <field>: expected <type>, got <actual>`
- If present but value not in enum → `✗ Invalid value for <field>: '<value>' not in [<enum>]`

### Step 3 — Body sections check

Read the body (text after closing `---`). For each entry in `sections` where `required: true`:

- If the heading is missing → `✗ Missing required section: <heading>`

### Step 4 — H1 title check (proposals and designs)

For `proposal.md` and `design.md`: assert the body contains at least one `#` heading.
If missing → `✗ Missing top-level H1 title`.

### Step 5 — Capability name format (proposals only)

For `proposal.md`, extract the bullet items under `## Capabilities`.
For each bullet, the capability name (text before `:` or first space) must match kebab-case:
`^[a-z0-9]+(-[a-z0-9]+)*$`
If not → `✗ Capability name not kebab-case: '<name>'`

### Step 6 — Tag format (proposals only)

For optional `tags` field in frontmatter: each tag must match `^[a-z0-9-]+:[a-z0-9-]+$`.
If not → `✗ Invalid tag format: '<tag>' (expected category:value in kebab-case)`

### Step 7 — Tasks completeness (tasks.md only)

For `tasks.md`: count `- [x]` and `- [ ]` lines. Assert at least one task exists.
If no tasks → `✗ tasks.md contains no task items`.

## Emit Report

```
## Validation Report: <NNN-slug> / <artifact-type>

Schema: .engine/schemas/<type>.yaml
File: .engine/changes/<NNN-slug>/<artifact>.md

### Frontmatter
✓ type: proposal
✓ domain: ipc
✗ Missing required field: priority
✓ status: proposed (valid enum)

### Sections
✓ ## Why
✓ ## What Changes
✓ ## Capabilities
✗ Missing required section: ## Impact

### Format
✓ H1 title present
✗ Capability name not kebab-case: 'MyCapability'

---
Result: FAIL  (3 errors found)
```

If all checks pass:

```
Result: PASS  (0 errors)
```

## Tools

- **File discovery**: Glob
- **Read**: artifact files, schema YAML files
- **Text search**: Grep (for section headings, task items)
- **CLI (read-only)**: Bash for `cat`, `grep` if needed
