# Archive Skill (Spec-Merge)

You are a pipeline curator responsible for archiving a completed change and merging its delta specification into the accumulated project specification.

## Role & Objective

Your task is to:

1. Semantically merge the change's delta `spec.md` into the project's accumulated spec.
2. Transition the change status to `archived`.
3. Move the change directory to `.engine/changes/archive/`.

## Instructions

### Step 1 — Validate preconditions

```bash
grep 'status:' .engine/changes/NNN-slug/proposal.md
```

The `status` MUST be `implemented`. Reject any other status.

### Step 2 — Locate specs

- **Delta spec**: `.engine/changes/NNN-slug/specs/**/*.md` (the change's own spec)
- **Accumulated spec**: `.engine/specs/<domain>/spec.md` (the project-level spec for the same domain)

If no accumulated spec exists yet, create it by copying the delta spec.

### Step 3 — Semantic merge

Read both specs fully, then produce a merged document following these rules:

1. **Preserve the oldest `created_at`** from either spec.
2. **Update `author`** to list both authors (comma-separated).
3. **Append new GIVEN/WHEN/THEN blocks** from the delta to the relevant sections (ADDED, MODIFIED, REMOVED).
4. **Do not duplicate** existing scenarios — check for semantic equivalence, not just string equality.
5. **Preserve all existing requirements** from the accumulated spec unchanged.
6. **Add a `## Changes` section** at the end if not present, listing the merged change IDs.

### Step 4 — Write the merged spec

Write the merged content back to `.engine/specs/<domain>/spec.md`.

### Step 5 — Transition status

Edit `proposal.md` frontmatter: set `status: archived`.

### Step 6 — Move to archive

```bash
git mv .engine/changes/NNN-slug/ .engine/changes/archive/NNN-slug/
```

### Step 7 — Sync to Notion (optional)

If `notion_id` is present in `proposal.md`:

```
mcp:notion:update_page(page_id=<notion_id>, properties={"Status": {"select": {"name": "archived"}}})
```

## Spec Merge — Example

**Delta spec** adds:

```markdown
### Requirement: Direct MCP Invocation

GIVEN a proposal has been approved
WHEN the agent executes the transition
THEN the agent MUST call mcp:notion:update_page directly
```

**Accumulated spec** already has a `## ADDED Requirements` section.

**Merged output**: append the new requirement block under `## ADDED Requirements`, preserving all existing content above and below.

### Step 8 — Commit changes

Stage the merged spec (`git mv` from Step 6 already staged the directory move):

```bash
git add .engine/specs/<domain>/spec.md
git commit -m "archive(NNN-slug): merge spec and move to archive"
```

### Step 9 — Create GitHub Pull Request

Create a new branch, push changes, and open a PR to consolidate the change into the main codebase.

```bash
# 1. Create a descriptive branch
git checkout -b archive/NNN-slug

# 2. Push to origin
git push origin archive/NNN-slug

# 3. Create PR using gh CLI
gh pr create --title "archive: NNN-slug" --body "Consolidates change NNN-slug into main history and merges domain specifications."
```

## Output

On success:

```
✓ Change NNN-slug archived
  - Delta spec merged into .engine/specs/<domain>/spec.md
  - Directory moved to .engine/changes/archive/NNN-slug/
  - Pull Request created at <PR_URL>
```

On failure:

```
✗ Cannot archive change NNN-slug: current status is '<status>', expected 'implemented'
```
