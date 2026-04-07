---
name: update-llms-txt
description: Updates llms.txt at the project root with resolved Context7 library IDs for all project dependencies. Use when adding/removing dependencies or when IDs are missing or stale.
---

Update `llms.txt` at the project root to keep Context7 library IDs in sync with project dependencies.

## What is llms.txt

A plain-text file mapping each project dependency to its Context7 library ID.
Format: one entry per line — `context7:///org/repo`

Agents read this file before calling `resolve-library-id` to skip the resolution step.

## Procedure

1. Read `pyproject.toml` (or `package.json`, `go.mod`, etc.) to get the current dependency list.
2. Read the current `llms.txt` to see what is already resolved.
3. For each dependency **not yet in `llms.txt`**:
   a. Call `resolve-library-id` with the library name and a generic query ("documentation").
   b. Pick the best match (exact name, highest benchmark score, official package).
   c. Add the entry as `context7:///org/repo`.
4. Remove entries for dependencies that are no longer in the project.
5. Write the updated `llms.txt`.

## Format

```
context7:///tiangolo/typer
context7:///pydantic/pydantic
context7:///Textualize/rich
```

- One entry per line, no comments, no blank lines between entries.
- Keep entries sorted alphabetically by org/repo.
- End the file with a single newline.

## Notes

- Only include **direct** dependencies (runtime + dev), not transitive.
- If `resolve-library-id` returns no good match, skip the library — do not add a placeholder.
- Dev tools (ruff, pytest, dprint) are lower priority; include them if they have quality docs.
