# Semantic Editing — Surgical Markdown Modifications

This directive governs how agents modify pipeline artifacts (`.md` files) without breaking their structure.

## Core Principle

**Never rewrite an entire file when only a section needs to change.** Always scope edits to the smallest unit that must change: a frontmatter field, a single section, or a specific line. Use the `Edit` tool with an exact `old_string` / `new_string` pair.

---

## 1. Editing frontmatter fields

Frontmatter is a YAML block delimited by `---` at the top of the file. Edit individual fields with a targeted string replacement:

```
# BAD — replaces the entire frontmatter block
old_string: "---\ntype: proposal\nstatus: draft\n..."

# GOOD — replaces only the field that changed
old_string: "status: draft"
new_string: "status: proposed"
```

**Rules:**

- Preserve exact indentation (spaces, not tabs).
- Do not add or remove fields unless the schema explicitly requires it.
- Never modify the closing `---` delimiter.
- If a field value contains special YAML characters (`:` `#` `[` `{`), use quotes in the replacement.

---

## 2. Editing a Markdown section

A section is bounded by its H2/H3 heading and the next heading of equal or higher level (or the end of file).

**To replace a section's body without touching adjacent sections:**

```
old_string: "## Why\n\nOld motivation text.\n"
new_string: "## Why\n\nUpdated motivation text.\n"
```

**Rules:**

- Include the heading line in both `old_string` and `new_string` to anchor the match.
- End both strings with a trailing newline so the next heading is not captured.
- If the section body is long, include only the first and last distinctive lines as anchors.

---

## 3. Editing a list item or task checkbox

```
# Mark a task done
old_string: "- [ ] T003"
new_string: "- [x] T003"

# Update a bullet point value
old_string: "- **priority**: low"
new_string: "- **priority**: high"
```

**Rules:**

- Match the complete list item text to avoid ambiguous replacements.
- Preserve leading whitespace (indentation level).

---

## 4. Editing YAML frontmatter arrays

```yaml
# Add a tag to an existing array
old_string: |
  tags:
    - area:cli
new_string: |
  tags:
    - area:cli
    - feature:semantic-edit
```

```yaml
# Append to a multi-item list (never overwrite existing entries)
old_string: |
  changes:
    - changes/001-migrate-pipeline-fsm/proposal.md
new_string: |
  changes:
    - changes/001-migrate-pipeline-fsm/proposal.md
    - changes/003-migrate-models-utils/proposal.md
```

**Rules:**

- Use a block scalar (`|`) for multiline values when the value contains newlines.
- **Never remove existing array entries** — always append.

---

## 5. Safety checklist before applying an edit

1. Verify `old_string` appears **exactly once** in the file (use Grep first if unsure).
2. Confirm the edit preserves YAML validity: no unclosed quotes, consistent indentation.
3. Confirm the edit preserves Markdown structure: headings remain at the correct level, no orphaned list items.
4. After the edit, re-read the frontmatter block to verify it parses correctly.

---

## 6. When to write the whole file

Only rewrite an entire file when:

- The file does not yet exist (initial creation).
- More than 60% of the content must change (e.g., a full section restructure).
- The file is short (< 30 lines) and targeted edits would be harder to verify.

In all other cases, prefer surgical `Edit` operations over full `Write` rewrites.
