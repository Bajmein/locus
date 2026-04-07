Roll back an applied change to its pre-apply state.

Usage: `/rollback <NNN-slug>`

You are a recovery agent. Use this command when `/verify` has failed and the implementation
must be discarded so the change can be re-applied from a clean state.

## Before You Begin

1. Resolve the change directory: `.engine/changes/$ARGUMENTS/`.
2. Read `proposal.md`. Extract: `status`, `branch`, `worktree`, `domain`, `github_issue`.
3. Confirm pre-conditions:
   - `status` must be `implemented` or `approved` (for partial rollbacks when worktree exists).
   - If `status` is `archived`, stop and report:
     ```
     ✗ Cannot rollback $ARGUMENTS: change is already archived. Archive is permanent.
     ```
   - If `status` is `proposed` and no `worktree` field is present, stop and report:
     ```
     ✗ Nothing to roll back: $ARGUMENTS has not been applied (status: proposed).
     ```

4. Confirm with the user before proceeding (destructive operation):

   ```
   ⚠️  Rolling back $ARGUMENTS will:
     - Remove worktree: <worktree path>
     - Delete local branch: <branch>
     - Reset proposal.md status to: approved
     - Reset tasks.md, design.md, spec.md statuses to pre-apply values

   Proceed? (yes/no)
   ```

   Wait for explicit confirmation (`yes`). If the user types anything else, abort.

## Execute

### Step 1 — Close any open PR

If `github_issue` is present and a PR for this branch exists, check its state:

```bash
gh pr view "change/$ARGUMENTS" --json state --jq '.state' 2>/dev/null || echo "not_found"
```

- If `OPEN`: close it without merging:
  ```bash
  gh pr close "change/$ARGUMENTS" --comment "Rolling back: implementation discarded, will re-apply."
  ```
- If `MERGED`: stop and report:
  ```
  ✗ Cannot rollback $ARGUMENTS: PR has already been merged into main.
    Use /archive instead if the change is complete, or open a new corrective change.
  ```
- If `CLOSED` or not found: proceed.

### Step 2 — Remove the worktree

If `worktree` field is set in `proposal.md`:

```bash
git worktree remove <worktree_path> --force
```

If the directory does not exist, skip silently.

### Step 3 — Delete the local branch

```bash
git branch -D change/$ARGUMENTS 2>/dev/null || echo "branch not found, skipping"
```

To also remove the remote branch (safe if PR is closed):

```bash
git push origin --delete "change/$ARGUMENTS" 2>/dev/null || true
```

### Step 4 — Reset artifact statuses

Edit the following files in the **main repo** (not the deleted worktree):

**`proposal.md`**: set `status: approved`; remove `branch` and `worktree` fields.

**`tasks.md`** (if exists):

- Set `status: draft`.
- Reset all task checkboxes in the body to unchecked (`- [ ]`) so `/apply` re-runs work.
  - Replace `- [x]` / `- [X]` with `- [ ]`.

**`design.md`** (if exists): set `status: draft`.

**All `specs/**/*.md`** files (if exist): set `status: draft`.

Use targeted frontmatter edits. For `tasks.md`, checkbox reset is the only allowed body edit.

### Step 5 — Commit the rollback

```bash
git add .engine/changes/$ARGUMENTS/
git commit -m "chore($ARGUMENTS): rollback to approved — re-apply pending"
```

## Output

On success:

```
✓ Change $ARGUMENTS rolled back to status: approved
  - Worktree removed: <worktree_path>
  - Branch deleted: change/$ARGUMENTS
  - Artifacts reset: proposal.md, tasks.md, design.md, spec.md

Next steps:
  1. Fix the issues identified in /verify output.
  2. Run /apply $ARGUMENTS to re-implement.
  3. Run /verify $ARGUMENTS to validate again.
```

On failure: report the blocking condition and stop without making any changes.

## Tools

- **File discovery**: Glob
- **Read**: proposal.md, tasks.md, design.md, specs
- **Edit**: frontmatter fields in artifact files
- **CLI**: `git worktree remove`, `git branch -D`, `git push --delete`, `git add`, `git commit`, `gh pr view`, `gh pr close` via Bash
