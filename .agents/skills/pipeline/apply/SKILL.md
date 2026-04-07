# Apply Skill

You are an expert software engineer responsible for the execution phase of the Spec-Driven Development (SDD) pipeline.

## Role & Objective

Your task is to implement the exact steps defined in `tasks.md` following a **Test-Driven Development (TDD)** cycle. Tests are written before production code. A phase is complete only when all its tests are green.

## Before You Begin

1. Read `tasks.md` in the active change directory — required. Abort if missing.
2. Read `design.md` for architectural guidance.
3. Identify pending tasks (`- [ ]`) vs completed (`- [x]`). Resume from the first unchecked task.
4. Detect the project language to select the correct test command:
   - **Python** → `mise run test` (pytest)
   - **Rust** → `cargo test` (run from the crate root)
   - **TypeScript/JS** → `npm test` or `mise run test`

## TDD Execution Loop

For each phase in `tasks.md`, apply the **Red → Green → Refactor** cycle:

### 🔴 RED — Write failing tests first

For every `[T]` task in the phase:

1. Implement the test as described (unit test inside the module OR integration test in `tests/`).
2. Run the test suite — **confirm the new test fails** (or fails to compile).
3. Mark the `[T]` task done in `tasks.md`.

```bash
# Python
mise run test

# Rust (from crate root)
cargo test
```

If no `[T]` task exists for a phase, write at least one test that expresses the acceptance criterion before implementing any production code.

### 🟢 GREEN — Implement until tests pass

For every implementation task in the phase:

1. Write the minimal production code to make the failing tests pass.
2. Run the test suite after **each** implementation task — fix failures before moving on.
3. Mark each implementation task done in `tasks.md`.

### 🔵 REFACTOR — Clean up while keeping green

After all tests in the phase pass:

1. Remove duplication, improve naming, apply project conventions.
2. Run the test suite again — must stay green.
3. Run the full quality gate and proceed to the next phase.

## Phase Checkpoints

At each `> **Checkpoint**` marker in `tasks.md`, run the full quality gate:

```bash
# Python
mise run lint && mise run typecheck && mise run test

# Rust (from crate root)
cargo clippy -- -D warnings && cargo test
```

Fix all failures before starting the next phase.

## Final Quality Gate

After all phases are complete, run the full quality gate one last time. If it passes:

1. Set `status: implemented` in `proposal.md`.
2. Commit from within the worktree:

```bash
cd .worktrees/NNN-slug
git add .
git commit -m "feat(NNN-slug): implement change"
```

## Rules

- Never write production code before writing a test for it.
- Never mark an implementation task done if its tests are failing.
- Do not deviate from `design.md`. When a task is ambiguous, read the design first.
- **Unit tests** (`[T][U]`) go inside the module (`#[cfg(test)]` in Rust, inner class in Python).
- **Integration tests** (`[T][I]`) go in `tests/` and test the public API.

## Allowed Semantic Tools

- **Symbol lookup**: `mcp__serena__get_symbols_overview`, `mcp__serena__find_symbol`, `mcp__serena__find_referencing_symbols`
- **Text search**: `Grep`
- **File discovery**: `Glob`
- **Structural search**: `ast-grep` via Bash
- **CLI** (via Bash): `rg`, `ast-grep`, `eza`, `lsd`, `mise`, `cargo`, `just`, `ty`, `git`
