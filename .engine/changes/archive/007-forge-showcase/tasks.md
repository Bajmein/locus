---
type: tasks
domain: content
status: draft
author: claude-sonnet-4-6
created_at: 2026-04-07
spec: specs/content/spec.md
design: design.md
---

## Phase 1: Setup

**Goal:** Create the standalone showcase repository on disk with a clean git history.

- [x] T001 Create showcase directory — `~/BenjaLabs/showcase/forge-showcase/`
- [x] T002 Initialize git repo and set main branch — `~/BenjaLabs/showcase/forge-showcase/`

> **Checkpoint:** `git status` shows clean empty repo on `main` branch inside `~/BenjaLabs/showcase/forge-showcase/`.

---

## Phase 2: Foundational

**Goal:** Confirm that locus prerequisites are satisfied before any file is touched.

- [x] T003 Verify `attr_list` is listed under `markdown_extensions` in `mkdocs.yml` (already expected — confirm, do not add) — `mkdocs.yml`
- [x] T004 Confirm insertion point: `## Más sobre Forge` is at line 114 of `docs/forge/index.md` (read file, do not modify yet) — `docs/forge/index.md`

> **Checkpoint:** Both prerequisites confirmed. No files modified. Safe to proceed.

---

## Phase 3: README Técnico con Banner y Mermaid SDD

**Goal:** Deliver the `README.md` artifact satisfying AC1 (banner, Mermaid SDD diagram, slash CLI table, stack table).

**Red step:** `grep "\[!IMPORTANT\]" ~/BenjaLabs/showcase/forge-showcase/README.md` → exits non-zero (file does not exist yet).
**Green step:** `grep "\[!IMPORTANT\]" README.md` exits 0 and file contains `mermaid` block with 5 nodes.

- [x] T005 [T] [AC1] Write validation checklist: confirm README contains `[!IMPORTANT]` banner, `mermaid` fenced block with 5 node labels (Usuario, Especificación, Motor, Agente IA, Output), slash CLI table with ≥ 8 commands, and stack table with exactly 5 rows — `~/BenjaLabs/showcase/forge-showcase/README.md` (validation: `grep` + visual inspect)
- [x] T006 [AC1] Create `README.md` with: (1) `[!IMPORTANT]` banner identifying repo as exhibición sin código fuente referencing `github.com/Bajmein`; (2) `# Forge` title + tagline; (3) `## Spec-Driven Development (SDD)` with `flowchart LR` Mermaid block — five nodes: Usuario, Especificación, Motor, Agente IA, Output, with feedback loop `Output → Spec acumulado`; (4) `## Arquitectura de Conocimiento` table (Notion, Obsidian, Filesystem); (5) `## Flujo de Comandos (Slash CLI)` with 8 pipeline commands + 2 shortcut commands; (6) `## Stack` table with 5 rows (Artefactos, Desarrollo, Validación, MCP Servers, Clientes IA); (7) `## Estado` with version `v0.1.0`; (8) `## Licencia` with note about code unavailability — `~/BenjaLabs/showcase/forge-showcase/README.md`
- [x] T007 [T] [AC1] Validate Mermaid syntax: count node definitions (expect 5) and verify feedback loop arrow `Spec acumulado` is present; confirm slash CLI table contains `/propose`, `/specify`, `/design`, `/break-to-tasks`, `/approve`, `/apply`, `/verify`, `/archive`, `/fast-draft`, `/fast-plan` — `README.md` (validation: `grep -c` checks)

> **Checkpoint:** `README.md` exists, contains `[!IMPORTANT]`, 5 Mermaid nodes with feedback loop, slash CLI table with 10 commands, and stack table with 5 rows.

---

## Phase 4: tree_structure.txt con Topología Anotada

**Goal:** Deliver `tree_structure.txt` satisfying AC2 (all key directories present and annotated, `src/forge/` marked private).

**Red step:** `cat ~/BenjaLabs/showcase/forge-showcase/tree_structure.txt` → exits non-zero (file does not exist yet).
**Green step:** File exists and contains `.agents/`, `.engine/`, `src/forge/` with private annotation.

- [x] T008 [T] [AC2] Write validation checklist: confirm `tree_structure.txt` contains first-level entries `.agents/`, `.engine/`, `docs/`, `src/`, `tests/` each with `#` comment; `.agents/skills/` shows `pipeline/`, `shared/`, `utility/` subdirs; `.engine/` shows `changes/`, `changes/archive/`, `ideas/`, `schemas/`, `specs/`; `src/forge/` line includes explicit private annotation — `tree_structure.txt` (validation: `grep` checks)
- [x] T009 [AC2] Create `tree_structure.txt` with: `forge/` as root; `.agents/` with `skills/pipeline/`, `skills/shared/`, `skills/utility/` annotated; `.engine/` with `changes/`, `changes/archive/`, `ideas/`, `schemas/`, `specs/` annotated; `docs/` with full list of documentation files; `src/forge/` marked `# Código fuente (privado — no incluido en showcase)`; `tests/` marked `# Tests de validación (privado — no incluido en showcase)`; root-level config files (`AGENTS.md`, `CHANGELOG.md`, `CLAUDE.md`, `dprint.json`, `llms.txt`, `mise.toml`, `pyproject.toml`, `README.md`) — `~/BenjaLabs/showcase/forge-showcase/tree_structure.txt`
- [x] T010 [T] [AC2] Validate that `src/forge/` annotation contains the word `privado` and that no real source file names (`.py` files) appear below the `src/` entry — `tree_structure.txt` (validation: `grep`)

> **Checkpoint:** `tree_structure.txt` exists. All key directories present and annotated. `src/forge/` and `tests/` explicitly marked private.

---

## Phase 5: mise.toml Saneado

**Goal:** Deliver `mise.toml` satisfying AC3 (tools section, 7+ tasks, no private vars, sanitization comment).

**Red step:** `cat ~/BenjaLabs/showcase/forge-showcase/mise.toml` → exits non-zero (file does not exist yet).
**Green step:** File exists and `grep "vars"` returns non-zero (no `[vars]` section).

- [x] T011 [T] [AC3] Write validation checklist: confirm `mise.toml` has `[tools]` section with `python = "3.14"`, `uv`, `ruff`, `dprint`; tasks `install`, `lint`, `format`, `test`, `security`, `typecheck`, `check` all present; `check` task has `depends` field; no `[vars]` section; no `_.python.venv` directive; no `_.file` directive; sanitization comment present in first 5 lines — `mise.toml` (validation: `grep` checks)
- [x] T012 [AC3] Create `mise.toml` with: sanitization comment header (reference version, private vars removed); `[tools]` with `python = "3.14"`, `uv = "latest"`, `ruff = "latest"`, `dprint = "latest"`; `[tasks.default]` running `mise tasks`; `[tasks.install]` running `uv sync --all-groups`; `[tasks.lint]` running `ruff check` + `deptry` + `vulture`; `[tasks.format]` running `ruff format` + `dprint fmt`; `[tasks.test]` running `uv run pytest`; `[tasks.security]` running `bandit -r src -ll`; `[tasks.typecheck]` running `ty check src`; `[tasks.check]` with `depends = ["lint", "test", "security", "typecheck"]` — `~/BenjaLabs/showcase/forge-showcase/mise.toml`
- [x] T013 [T] [AC3] Verify absence of private config: `grep -n "\[vars\]\|_.python.venv\|_.file" mise.toml` → exits non-zero (no matches); confirm sanitization comment is present on line 1, 2, or 3 — `mise.toml` (validation: `grep`)

> **Checkpoint:** `mise.toml` exists. 8 tasks defined. `grep "[vars]"` returns no matches. Sanitization comment visible.

---

## Phase 6: Zero Trust Audit

**Goal:** Verify all three showcase artifacts satisfy AC5 (no source code, no private paths, no private repo references).

- [x] T014 [T] [AC5] Audit `README.md` for absence of Python source code blocks: `grep -n '\`\`\`python\|\`\`\`py'` must return non-zero — confirm only `mermaid`, text, and TOML/plaintext blocks appear — `README.md`
- [x] T015 [T] [AC5] Audit all three artifacts for absence of: (1) references to private repo (grep for `BenjaLabs/forge` or `BenjaLabs/locus`); (2) local private paths (grep for `/home/` or `~/BenjaLabs/`); (3) any string that could identify the private production environment — `README.md`, `tree_structure.txt`, `mise.toml`

> **Checkpoint:** Zero Python source fragments, zero private paths, zero private repo references across all three artifacts.

---

## Phase 7: GitHub Repository Publication

**Goal:** Create the public GitHub repo `Bajmein/forge-showcase` with correct metadata (AC6).

**Red step:** `gh repo view Bajmein/forge-showcase` → 404 (repo does not exist yet).
**Green step:** `gh repo view Bajmein/forge-showcase` returns repo metadata with `visibility: public`.

- [x] T016 [AC6] Stage and commit the three artifacts, then publish via `gh repo create`: `git add README.md tree_structure.txt mise.toml && git commit -m "feat: initial forge showcase — architecture docs and dev environment reference" && gh repo create Bajmein/forge-showcase --public --description "Forge — SDD pipeline showcase. Source code is private. Architecture docs and dev tooling reference." --homepage "https://bajmein.github.io/locus/forge/" --source . --remote origin --push` — `~/BenjaLabs/showcase/forge-showcase/`
- [x] T017 [T] [AC6] Verify repo metadata via `gh repo view Bajmein/forge-showcase --json visibility,description,homepageUrl` — confirm `visibility: PUBLIC`, description contains "SDD pipeline showcase", homepage is `https://bajmein.github.io/locus/forge/` — remote

> **Checkpoint:** `gh repo view` returns public repo. `README.md`, `tree_structure.txt`, `mise.toml` all present on `main` branch.

---

## Phase 8: Locus Page Section

**Goal:** Insert `## Repositorio Vitrina` in `docs/forge/index.md` before `## Más sobre Forge`, satisfying AC4 and preserving AC7 invariants.

**Red step:** `uv run pytest tests/unit/test_pages_content.py::test_forge_links_to_showcase -v` → FAILED (test does not exist yet, then fails after writing test).
**Green step:** `mise run test` fully green.

- [x] T018 [T][I] [AC4] Write failing test `test_forge_links_to_showcase` in Phase 9 cross-links group (after `test_forge_links_to_laboratorio`): asserts `"forge-showcase" in body` using existing `forge_page` fixture — `tests/unit/test_pages_content.py`
- [x] T019 [AC4] Insert `## Repositorio Vitrina` section block immediately before the line containing `## Más sobre Forge` (line 114): include a `---` separator before the heading, description paragraph, `{ .md-button }` link to `https://github.com/Bajmein/forge-showcase`, and closing `---` separator — `docs/forge/index.md`
- [x] T020 [T] [AC7] Run `mise run test` and confirm: (1) `test_forge_links_to_showcase` passes; (2) all pre-existing SEO/metadata tests for `forge/index.md` still pass; (3) `title` and `description` frontmatter fields unchanged — `docs/forge/index.md`, `tests/unit/test_pages_content.py`
- [x] T021 [AC4] Run `uv run mkdocs build --strict` and confirm exit code 0 with no warnings or errors related to the Forge page — `docs/forge/index.md`

> **Checkpoint:** `mise run test` green. `uv run mkdocs build --strict` exits 0. `## Repositorio Vitrina` appears immediately before `## Más sobre Forge` in the rendered nav.

---

## Dependencies & Execution Order

```
Phase 1 (Setup)
    └── Phase 2 (Foundational)
            ├── Phase 3 (README)          [P] ─┐
            ├── Phase 4 (tree_structure)  [P] ─┤── must complete before Phase 6
            └── Phase 5 (mise.toml)       [P] ─┘
                    └── Phase 6 (Zero Trust Audit)
                            └── Phase 7 (GitHub Publication)
Phase 2 (Foundational)
    └── Phase 8 (Locus Page)  ← independent of showcase phases, can run in parallel with Phases 3–7
```

**Blocking dependencies:**

| Phase | Blocked by | Reason |
|---|---|---|
| Phase 2 | Phase 1 | Needs repo directory initialized |
| Phase 3 | Phase 2 | Needs showcase directory to exist |
| Phase 4 | Phase 2 | Needs showcase directory to exist |
| Phase 5 | Phase 2 | Needs showcase directory to exist |
| Phase 6 | Phases 3, 4, 5 | Audits all three artifacts |
| Phase 7 | Phase 6 | Publishes only after Zero Trust cleared |
| Phase 8 | Phase 2 | Needs insertion point confirmed |

**Parallelizable:** Phases 3, 4, 5 can be executed concurrently after Phase 2. Phase 8 can be executed concurrently with Phases 3–7 after Phase 2.

---

## Implementation Strategy

### MVP First

Execute all showcase phases (1–7) before touching locus. This lets you validate the GitHub repo URL is live before inserting the button that links to it. Order: Phase 1 → 2 → 3+4+5 (parallel) → 6 → 7 → 8.

### Incremental

Execute locus changes first (Phase 2 → 8) to get `mise run test` green, then build the showcase repo (Phases 1–7) and push. This keeps locus in a deployable state throughout, even if the external URL is temporarily unreachable. Acceptable because `mkdocs build --strict` does not validate external link reachability.
