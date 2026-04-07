---
name: update-claude-md
description: Updates CLAUDE.md with current project conventions, stack, structure, CLI reference, and pipeline documentation. CLAUDE.md is the authoritative source for agents working on this project.
---

Update `CLAUDE.md` to reflect the current state of the project.

## What CLAUDE.md is

The primary instruction file for AI agents working on this project. It must be:

- **Accurate**: reflects the actual code, not aspirational state.
- **Complete**: covers stack, structure, CLI, conventions, and pipeline.
- **Non-redundant**: does not duplicate what's in README.md or code comments.

## Procedure

1. Read the current `CLAUDE.md`.
2. Read `pyproject.toml` / `mise.toml` for current stack and tasks.
3. Read `src/locus/cli.py` (or equivalent) for current CLI commands and flags.
4. Read `src/locus/models.py` for current models and their fields.
5. Identify stale sections: removed commands, changed model fields, new tasks, updated stack.
6. Update stale content. Add missing sections. Remove obsolete ones.
7. Do not change the overall structure unless it no longer fits.

## Sections CLAUDE.md must have

- **Stack**: languages, runtime versions, key libraries with their roles.
- **Project structure**: directory tree with one-line descriptions.
- **CLI reference**: every top-level command with its arguments and purpose.
- **Models**: key Pydantic models, their fields, and validation rules.
- **Development environment**: how to set up and run tasks (`mise run ...`).
- **Pipeline**: the agent pipeline stages and what each does.
- **Conventions**: naming rules, where things go, what goes where.

## Guidelines

- Use fenced code blocks for shell commands and directory trees.
- Keep model documentation in sync with `models.py` — field names, types, and constraints.
- If a command was removed, remove it from CLAUDE.md immediately.
- `Justfile` is archived — do not reference it.
- Task runner is `mise` — all dev commands are `mise run <task>`.
