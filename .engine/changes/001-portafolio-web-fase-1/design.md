---
type: design
domain: web-infrastructure
status: draft
author: gemini-cli
created_at: 2026-04-06
spec: specs/web-infrastructure/spec.md
tags:
  - area:portafolio
  - feature:scaffolding
  - tool:mkdocs
---

## Summary
The technical approach involves scaffolding a static site generator utilizing MkDocs with the Material for MkDocs theme. A declarative routing structure will be established through the `mkdocs.yml` configuration file, creating a foundational layout without manual CSS or JS. The initial structure will include placeholder Markdown files for key sections ("Vigilia", "Forge", "Laboratorio") to represent "Work in Progress".

## Technical Context

| Field | Value |
|---|---|
| Language/Version | Python 3.14+ (for generating), Markdown |
| Primary Dependencies | `mkdocs-material` |
| Storage | N/A (Static files) |
| Testing | Build checks (`mkdocs build --strict`) |
| Target Platform | Static Web Host (e.g., GitHub Pages) |
| Project Type | Documentation / Static Site |
| Performance Goals | Fast static HTML delivery |
| Constraints | No custom CSS/JS for Fase 1. |
| Scale/Scope | Fase 1 is limited to scaffolding and routing. |

## Architecture
The architecture is based on a standard MkDocs static site generation pattern. The core locus logic will not be coupled with the MkDocs structure. The `mkdocs` command-line tool will parse the `docs/` folder containing Markdown files and render static HTML output based on the declarative tree provided in `mkdocs.yml`. Integration with the existing repository is minimal, functioning primarily as an additional toolchain layer.

## Data Model
- **Configuration**: `mkdocs.yml` defines the `site_name` and the `nav` structure mapping logical paths to physical Markdown files.
- **Content**: Standard Markdown files representing individual pages. No custom Pydantic models or complex schemas are needed for the static site itself.

## Key Decisions

- **Decision**: Use MkDocs with Material Theme.
  - **Alternatives considered**: Hugo, Docusaurus, Sphinx.
  - **Rationale**: Material for MkDocs provides an excellent default UX, is declarative, native to Python environments, and avoids complex JavaScript build steps, fulfilling the zero custom CSS/JS constraint.
  
- **Decision**: Define routing explicitly in `mkdocs.yml`.
  - **Alternatives considered**: Auto-generated navigation based on folder structure.
  - **Rationale**: Explicit declaration ensures the desired navigational hierarchy is strictly enforced regardless of the underlying physical file layout.

- **Decision**: Manage dependencies via `pyproject.toml` and `uv`.
  - **Alternatives considered**: Standalone `requirements.txt`.
  - **Rationale**: The project already utilizes modern Python environments with `uv`. Centralizing dependencies under a new `docs` dependency group in `pyproject.toml` is deterministically faster and maintains alignment with existing standards in the workspace.

- **Decision**: Ignore the MkDocs build output directory.
  - **Alternatives considered**: Committing static build artifacts.
  - **Rationale**: Committing the `site/` directory pollutes the Git history and causes unnecessary merge conflicts. The build will be delegated to a CI/CD pipeline (e.g., GitHub Actions).

## Project Structure

```text
/home/kenno/BenjaLabs/locus/
├── (modified) pyproject.toml
├── (modified) .gitignore
├── (new) mkdocs.yml
└── docs/
    ├── (new) index.md
    ├── (new) vigilia/
    │   └── (new) index.md
    ├── (new) forge/
    │   └── (new) index.md
    └── (new) laboratorio/
        └── (new) index.md
```

## Open Questions
*(None)*
