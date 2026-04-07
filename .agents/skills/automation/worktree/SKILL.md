Set up or clean up a git branch and worktree for a locus change.

Usage:

- `/worktree <change-id>` — create worktree for a change
- `/worktree cleanup <change-id>` — remove worktree and branch after archiving
- `/worktree cleanup --all` — remove all worktrees whose changes are archived

You are managing isolated git worktrees for locus changes. Each change lives in a sibling
directory (`../locus-NNN-slug`) on its own branch (`change/NNN-slug`).

---

## Mode detection

- If `$ARGUMENTS` starts with `cleanup`, enter **Cleanup mode** (Phase 4).
- Otherwise, enter **Setup mode** (Phases 1–3).

---

## Setup mode

### Phase 1 — Identify change

1. If `$ARGUMENTS` is provided, use it as the change ID (e.g., `003` or `003-sota-architecture-integration`).
2. Otherwise, run `Glob(pattern=".engine/changes/**")` and list existing changes. Ask the user which one.
3. Resolve the full slug: e.g., `003-sota-architecture-integration`. The worktree branch will be `change/003-sota-architecture-integration`.

### Phase 2 — Check state

1. Run `git status` to confirm the repo is clean.
2. Run `git branch -a` to check if the branch already exists locally or remotely.
3. If the branch already exists, offer to reuse it or abort.

### Phase 3 — Create branch and worktree

1. Get the current HEAD SHA:
   ```bash
   git rev-parse HEAD
   ```
2. Create the remote branch via GitHub API:
   ```bash
   gh api repos/{owner}/{repo}/git/refs \
     -f ref="refs/heads/change/NNN-slug" \
     -f sha="<HEAD_SHA>"
   ```
   Get owner/repo from: `gh repo view --json nameWithOwner -q .nameWithOwner`

3. Add the worktree at `../locus-NNN-slug` (sibling of current repo):
   ```bash
   git worktree add ../locus-NNN-slug change/NNN-slug
   ```

4. Confirm to the user:
   ```
   Worktree created at: ../locus-NNN-slug
   Branch: change/NNN-slug
   Run: cd ../locus-NNN-slug to start working
   ```

---

## Cleanup mode

Removes the worktree directory and deletes the local branch. Safe to run from main.

### Phase 4 — Identify targets

**Single change** (`cleanup <change-id>`):

1. Resolve change from the provided ID or slug.
2. Derive worktree path: `../locus-NNN-slug` (or scan `git worktree list` to find the actual path).
3. Derive branch name from `git worktree list` output for that path.

**All archived** (`cleanup --all`):

1. Run `git worktree list --porcelain` to get all registered worktrees and their branches.
2. For each worktree that is NOT the main repo (not the path containing `.git/`):
   - Extract the branch name.
   - Check if the corresponding change exists in `.engine/changes/archive/` — if yes, it is archived.
3. Collect all archived worktrees as cleanup targets.

### Phase 5 — Confirm and remove

1. Show the user the list of worktrees + branches to be removed. Ask for confirmation before proceeding.
2. For each target:
   a. Remove the worktree:
   ```bash
   git worktree remove --force <path>
   ```
   b. Delete the local branch:
   ```bash
   git branch -d <branch>
   # If -d fails (not fully merged), use -D only after confirming with user
   ```
   c. Print: `✓ Removed worktree <path> and branch <branch>`

3. Prune stale worktree refs:
   ```bash
   git worktree prune
   ```

### Notes on cleanup

- Always run from the **main repo** (`locus/`), never from inside a worktree.
- Remote branches are NOT deleted automatically — leave that to the user (PR lifecycle).
- If `git branch -d` fails (unmerged changes), warn the user and skip that branch unless they confirm `-D`.

---

## General notes

- Worktree path convention: `../locus-NNN-slug` (full slug, not just NNN)
- Branch naming: `change/NNN-slug` (never just `NNN` or the slug alone)
- Do NOT push the branch during setup — it was created via API, pushing happens when work is ready
- Use `EnterWorktree` / `ExitWorktree` (resolve via ToolSearch first) if switching context within Claude Code
