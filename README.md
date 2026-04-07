# Locus

**Structured Development Pipeline and Change Management Framework.**

Locus is a framework designed to manage the development lifecycle through standardized artifacts (Markdown + YAML) and schema-driven validation. It provides a formal structure to transition from an idea to a fully verified implementation.

## Key Concepts

- **Schema-Driven Artifacts**: All project documents (proposals, specs, designs, tasks) are validated against YAML schemas.
- **Structured Pipeline**: A rigorous lifecycle ensuring consistency: `Propose` → `Specify` → `Design` → `Execute` → `Verify`.
- **Reproducibility**: Integrated with `mise` and `uv` for consistent development environments.

## Getting Started

### Prerequisites

- [Python 3.14+](https://www.python.org/)
- [mise](https://mise.jdx.dev/) (development orchestration)
- [uv](https://github.com/astral-sh/uv) (package management)

### Installation

1. Clone the repository.
2. Setup the development environment:
   ```bash
   mise install && mise run install
   ```

## Development Workflow

Locus orchestrates changes through specific stages, each represented by an artifact in the `.engine/changes/` directory.

### Lifecycle Stages

1. **Propose**: Define the core idea and objective in a `proposal.md`.
2. **Specify**: Document functional and technical requirements in `spec.md`.
3. **Design**: Outline the technical architecture and implementation strategy in `design.md`.
4. **Execute**: Deconstruct the design into actionable and atomic `tasks.md`.
5. **Verify**: Validate the implementation through testing and strict schema enforcement.

## Project Structure

```text
.engine/
  changes/         # Active development directories (NNN-slug/)
    archive/       # Completed and consolidated changes
  schemas/         # YAML Schemas — Source of truth for artifact validation
  specs/           # Accumulated project specifications
src/locus/
  __init__.py      # Framework logic (core skeleton)
tests/             # Schema validation and artifact consistency tests
```

## Local Development (mise)

Use the provided tasks for environment checks and quality assurance:

```bash
mise run check      # Run all quality checks (test, lint, typecheck, security)
mise run test       # Run tests with pytest
mise run format     # Format code with ruff and dprint
```

## Tech Stack

- **Architecture**: Artifact-based pipeline (Markdown + YAML)
- **Validation**: YAML-based schema enforcement
- **Tooling**: Python 3.14+, mise, uv, ruff, dprint, pytest
