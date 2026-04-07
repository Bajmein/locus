---
type: tasks
domain: web-infrastructure
status: done
author: gemini-cli
created_at: 2026-04-06
spec: specs/web-infrastructure/spec.md
design: design.md
tags:
  - area:portafolio
  - feature:scaffolding
  - tool:mkdocs
---

## Phase 1: Setup
- [x] T001 [AC1] Add `mkdocs-material` dependency under a new `docs` group in `[dependency-groups]` — pyproject.toml
- [x] T002 [P] [AC1] Ignore `site/` MkDocs build output directory to prevent artifacts from being committed — .gitignore

## Phase 2: Foundational
- [x] T003 [AC3] Define static site configuration and declarative navigation tree structure (`nav`) mapping to index files — mkdocs.yml
> **Checkpoint**: `pyproject.toml` is valid, `uv sync` resolves dependencies without error, and `mkdocs.yml` is syntactically correct.

## Phase 3: Base Directory Structure
**Goal**: Create the foundational directory layout and Markdown placeholders for "Vigilia", "Forge", and "Laboratorio" sections.
**Independent Test**: Execute `uv run mkdocs build --strict` to verify successful static site generation and navigate the site locally to verify placeholder visibility.
- [x] T004 [P] [AC2] Create the root home placeholder page — docs/index.md
- [x] T005 [P] [AC2] Create "Vigilia" section placeholder with "Work in Progress" warning — docs/vigilia/index.md
- [x] T006 [P] [AC2] Create "Forge" section placeholder with "Work in Progress" warning — docs/forge/index.md
- [x] T007 [P] [AC2] Create "Laboratorio" section placeholder with "Work in Progress" warning — docs/laboratorio/index.md
> **Checkpoint**: `uv run mkdocs build --strict` builds successfully without warnings. All configured routes lead to the corresponding Markdown files.

## Dependencies & Execution Order
```text
Phase 1 (Setup)
  │
  ├── T001 blocks T003
  ├── T002 parallel to T001
  │
Phase 2 (Foundational)
  │
  ├── T003 blocks Phase 3 testing
  │
Phase 3 (Base Directory Structure)
  │
  └── T004, T005, T006, T007 can be executed in parallel
```

## Implementation Strategy
- **MVP First path**: Create `mkdocs.yml` with basic configuration and just the `docs/index.md` file. Build it successfully once to guarantee the SSG engine works before creating the other placeholders.
- **Incremental approach**: Setup dependencies and the gitignore file, test that MkDocs recognizes the environment. Then define the full declarative route tree in `mkdocs.yml`, causing MkDocs build to fail due to missing files. Incrementally add the missing `docs/**/*.md` files resolving the build errors one by one until the build succeeds.