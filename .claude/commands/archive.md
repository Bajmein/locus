Archive a completed change and merge its spec into the accumulated project spec.

Usage: `/archive <NNN-slug>`

You are a pipeline curator executing the **archive** phase of Spec-Driven Development.

## Step 1 — Validate

Read `.engine/changes/$ARGUMENTS/proposal.md`.

Check `status` in the frontmatter. If it is not `implemented`, stop and report:

```
✗ Cannot archive $ARGUMENTS: current status is '<status>', expected 'implemented'
```

## Step 2 — Locate delta spec

```
Glob(".engine/changes/$ARGUMENTS/specs/**/*.md")
```

Identify the domain from the spec path (e.g. `specs/pipeline-core/spec.md` → domain `pipeline-core`).

## Step 3 — Merge into accumulated spec

Check if `.engine/specs/<domain>/spec.md` exists.

**If it does not exist**: create the directory and copy the delta spec directly to `.engine/specs/<domain>/spec.md`. Skip to Step 4.

**If it exists**: read both specs fully, then produce a merged document:

1. **Preserve the oldest `created_at`** from either spec.
2. **Update `author`** to list both authors (comma-separated), deduplicated.
3. **Append new requirement blocks** from the delta under the relevant sections (`## ADDED`, `## MODIFIED`, `## REMOVED`). Do not duplicate scenarios — check semantic equivalence, not string equality.
4. **Preserve all existing requirements** unchanged.
5. **Add or update a `## Changes` section** at the end, listing all merged change slugs (e.g. `- $ARGUMENTS`).

## Step 4 — Write merged spec

Write the merged content to `.engine/specs/<domain>/spec.md` using Write.

## Step 5 — Transition status

Edit `.engine/changes/$ARGUMENTS/proposal.md` frontmatter: set `status: archived`.

Do not modify any other fields.

## Step 6 — Move to archive

```bash
mv .engine/changes/$ARGUMENTS/ .engine/changes/archive/$ARGUMENTS/
```

## Step 6b — Clean up worktree

If `worktree` is set in `proposal.md` frontmatter, remove the git worktree:

```bash
git worktree remove .worktrees/$ARGUMENTS --force
```

If the field is absent or the directory does not exist, skip silently.

## Step 7 — Notion sync (optional)

If `notion_id` is present in `proposal.md` frontmatter:

```
mcp__notion__update_page(page_id=<notion_id>, properties={"Status": {"select": {"name": "archived"}}})
```

## Output

On success:

```
✓ Change $ARGUMENTS archived
  - Delta spec merged into .engine/specs/<domain>/spec.md
  - Directory moved to .engine/changes/archive/$ARGUMENTS/
```

On failure: report the blocking condition and stop.
