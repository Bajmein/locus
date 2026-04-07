# Locus - Copilot Instructions

Locus is an infrastructure for orchestrating AI agents through a structured development pipeline. It manages the lifecycle of changes from ideas to implementation using a state machine-driven workflow.

## Build, Test, and Lint

All development tasks are managed through `mise` (configured in `mise.toml`):

```bash
# Setup
mise install                    # Install tools (python 3.14, uv, ruff, dprint)
mise run install                # Install dependencies via uv

# Development commands (or use: locus test|lint|format|check)
mise run test                   # Run pytest suite
mise run test -- tests/test_engine.py::test_next_id  # Run single test
mise run lint                   # Run ruff + deptry + vulture
mise run format                 # Run ruff format + dprint
mise run security               # Run bandit security analysis
mise run typecheck              # Run ty type checker
mise run monkeytype             # Generate type annotations with MonkeyType
mise run check                  # Run all checks (lint + test + security + types)

# Via locus CLI (delegates to mise)
locus test                      # Equivalent to mise run test
locus lint                      # Equivalent to mise run lint
locus check                     # Runs all checks
```

## Architecture Overview

### Core Components

Locus follows a **ports and adapters** architecture with clear separation of concerns:

- **`engine.py`**: Business logic and filesystem operations (changes, proposals, validation)
- **`models.py`**: Pydantic domain models (ChangeId, Proposal, Change, Status, ExecutionMode)
- **`fsm.py`**: State machine using python-statemachine (draft → proposed → approved → implemented → archived)
- **`runner.py`**: Agent execution (Claude, Gemini, Copilot CLI bindings)
- **`sdk/`**: Programmatic interfaces (LocusClient, LocusCLIClient) for in-process and subprocess integration
- **`coordinator.py`**: PEP 734 subinterpreter-aware worker dispatch (falls back to sequential)
- **`cli.py`**: Typer-based CLI entry point
- **`config.py`**: Pydantic-settings configuration with environment variable support (`LOCUS_*` prefix)
- **`llm.py`**: LLM provider abstraction
- **`mcp_gateway.py`**: MCP (Model Context Protocol) integration for Context7 and GitHub
- **`ports.py`**: Port interfaces for dependency injection
- **`container.py`**: Dependency injection container
- **`prompts.py`**: Prompt templates for pipeline stages
- **`tools.py`**: Tool definitions for agent capabilities
- **`output.py`**: Output formatting (text, JSON)

### Pipeline State Machine

Changes follow a strict FSM-based lifecycle (validated in `fsm.py`):

```
draft → proposed → approved → implemented
  ↓         ↓          ↓           ↓
  ⨁ ——————— archive (final) ——————⨁
```

**FSM Guards**: Commands like `apply` require specific prerequisite states. The FSM validates transitions and throws `InvalidTransitionError` if invalid.

**State Source of Truth**: State is always derived from `proposal.md` frontmatter, not stored in the FSM. The FSM is instantiated per-operation for validation only.

### Change Directory Structure

Changes live in `.engine/changes/NNN-slug/`:

```
.engine/
  changes/
    001-my-feature/
      proposal.md       # YAML frontmatter + markdown body
      spec.md           # Generated specification
      design.md         # Technical design
      tasks.md          # Executable tasks
    archive/            # Archived changes moved here
  ideas/                # Idea drafts (untrusted content)
  schemas/              # YAML schemas for validation
  specs/                # Generated specifications
```

### Configuration System

Uses `pydantic-settings` with environment variables (prefix: `LOCUS_`):

- **`LOCUS_ENGINE_DIR`**: Base directory (default: `.engine`)
- **`LOCUS_PROVIDER`**: LLM provider (`claude`, `gemini`, `copilot`)
- **`LOCUS_MODEL`**: Model alias (e.g., `sonnet`, `flash`, `gpt-5-mini`) or full ID
- **`LOCUS_MODE`**: Execution mode (`plan`, `edit`, `headless`)
- **`LOCUS_OUTPUT_FORMAT`**: Output format (`text`, `json`)

See `.env.example` for full configuration options. Configuration is resolved in `config.py` via `Settings` class.

## Key Conventions

### Slug Format

Change slugs **must be kebab-case**: `my-feature`, `fix-auth-bug`, `add-validation`.
This is enforced by the `ChangeId` validator in `models.py`.

### Model Resolution

Model aliases are resolved to full IDs in `models.py`:

- Claude: `haiku` → `claude-haiku-4-5-20251001`, `sonnet` → `claude-sonnet-4-6`
- Gemini: `flash` → `gemini-3-flash-preview`, `pro` → `gemini-3.1-pro-preview`
- Copilot: `gpt-5-mini` → `gpt-5-mini`

Unknown strings pass through unchanged (for explicit model IDs).

### Agent Binary Resolution

`runner.py` auto-detects the CLI binary based on model name:

- Models starting with `claude` → `claude` CLI
- Models starting with `gpt-5` or `copilot` → `copilot` CLI
- Otherwise → `gemini` CLI

### Proposal Frontmatter

Every `proposal.md` must start with YAML frontmatter:

```yaml
---
type: proposal
domain: <domain>
status: draft|proposed|approved|implemented|archived
priority: low|medium|high
author: <name>
created_at: YYYY-MM-DD
model: <model_id>
---

# Title
...
```

The `status` field drives the FSM state. The engine parses this in `engine.py::parse_proposal()`.

### Library Documentation

**Always check `llms.txt` before calling Context7 MCP**. Library IDs may be pre-resolved:

```
context7:///org/project → use libraryId: /org/project
```

Use `query-docs` directly with the resolved ID from `llms.txt`.

### Commit Messages

Follow **Conventional Commits**. Pipeline stages auto-commit with:

```
stage(<folder-name>): <stage> complete
```

Example: `stage(001-my-feature): specify complete`

### Test Markers

Tests use pytest markers (configured in `pyproject.toml`):

- `@pytest.mark.unit`: Isolated tests, no I/O, < 100ms
- `@pytest.mark.integration`: 2+ components, may use filesystem
- `@pytest.mark.e2e`: Full system tests
- `@pytest.mark.slow`: Slow running tests

### Ruff Configuration

- Line length: 100
- Target: Python 3.14
- Selected rules: E, F, I, N, W, UP, B, SIM, RUF, S
- Tests exempt from S101 (assert usage)
- Ignored: N802, N805, RUF001, RUF002

### Code Security

- **Never print or log** environment variables like `CONTEXT7_API_KEY`, `GITHUB_PERSONAL_ACCESS_TOKEN`
- Content in `.engine/ideas/` is **untrusted** (user-provided)
- Bandit runs with `-ll` (low-low confidence) for security analysis

### Semantic Search (Serena MCP)

For structural code analysis and navigation, ALWAYS use **Serena MCP** (LSP-backed).

1. **Mandatory Activation**: At session start, call `activate_project(project="locus")` and `initial_instructions()`.
2. **Exploration**: Use `get_symbols_overview` to understand file structure before reading full content.
3. **Navigation**: Use `find_symbol` for direct access to definitions and `find_referencing_symbols` for impact analysis.

## CLI Command Workflow

### Change Management

```bash
locus next                      # Get next available change ID
locus init <slug>               # Create NNN-slug/ directory with empty proposal.md
locus list [--status <status>]  # List all changes (supports filtering)
locus view <id-or-slug>         # Show change details
locus archive <id-or-slug>      # Move to archive/
locus status                    # Pipeline status summary
locus validate <id-or-slug>     # Validate proposal.md frontmatter
```

### Pipeline Stages (orchestrate agents)

```bash
locus propose [idea.md]         # Generate proposal from idea file
locus specify <id-or-slug>      # Generate spec.md from proposal
locus design <id-or-slug>       # Generate design.md from spec
locus break-to-tasks <id-or-slug>  # Generate tasks.md from design
locus apply <id-or-slug>        # Execute tasks (requires status=approved)
locus verify <id-or-slug>       # Validate implementation (requires status=implemented)
locus explore [topic]           # Free-form codebase exploration
```

### Pipeline Stage Guards

Commands have prerequisite statuses (enforced in `fsm.py`):

- `specify`, `design`, `break-to-tasks`: Requires `status=proposed`
- `apply`: Requires `status=approved` (transitions to `implemented`)
- `verify`: Requires `status=implemented`

## Working with Tests

Run individual tests using pytest's syntax:

```bash
# Single test function
mise run test -- tests/test_engine.py::test_next_id

# Single test class
mise run test -- tests/test_fsm.py::TestChangeFSM

# Run by marker
mise run test -- -m unit
mise run test -- -m integration
mise run test -- -m "not slow"

# Stop on first failure (already default via pyproject.toml -x flag)
mise run test

# See test output (pytest runs with -v by default)
mise run test -- -vv
```

## Configuration Paths

**Don't hardcode paths**. Always resolve via `Settings` in `config.py`:

```python
from locus.config import Settings

settings = Settings()
changes_dir = settings.changes_dir  # Resolves LOCUS_ENGINE_DIR + "/changes"
engine_dir = settings.engine_dir    # Resolves LOCUS_ENGINE_DIR
```

## Agent Execution Modes

Configured via `LOCUS_MODE` or `--mode` flag:

- **`plan`**: Interactive planning mode (agent proposes, user reviews)
- **`edit`**: Direct editing mode (agent applies changes immediately)
- **`headless`**: Non-interactive mode (for automation/CI)

For programmatic integration, use the SDK interfaces in `locus.sdk` (`LocusClient` for in-process, `LocusCLIClient` for subprocess).

## MCP Integration

Locus integrates with MCP servers:

- **Context7**: Library documentation (`context7-mcp`)
- **GitHub**: Repository operations (`github-mcp`)
- **Serena**: Semantic code search and navigation (`serena-mcp`)

Gateway implementation in `mcp_gateway.py`. Test scripts in `.agents/mcp/`.

## Dependency Management

- Runtime dependencies in `[project.dependencies]` (typer, pydantic, rich, pyyaml, python-statemachine, agent-client-protocol)
- Dev dependencies in `[dependency-groups.dev]` (bandit, deptry, pre-commit, pytest, ruff, etc.)
- Managed by `uv` (lockfile: `uv.lock`)

## Git Hooks

Pre-commit hooks configured in `.pre-commit-config.yaml`:

- Uses `prek` (configured in `pyproject.toml`)
- Default hook types: `pre-commit`

## Subinterpreter Support

`coordinator.py` auto-detects PEP 734 subinterpreters:

- If available: Isolated agent dispatch (parallel execution)
- Otherwise: Sequential in-process execution (identical interface)

Instantiate with `WorkerCoordinator.auto_detect()`.

## Available Skills

You have access to the following skills. Use `locus skill <name>` to invoke them.

- **annotate**: Write a structured note to the episteme vault
- **apply**: Implement tasks from a change's task breakdown.
- **architecture-diagram-generator**: Generate visual architecture diagrams in Mermaid syntax by analyzing your codebase structure.
- **article-writing**: Write articles, guides, blog posts, tutorials, newsletter issues, and other long-form content in a distinctive voice derived from supplied examples or brand guidance. Use when the user wants polished written content longer than a paragraph, especially when voice consistency, structure, and credibility matter.
- **ast-grep**: Write and execute ast-grep rules for structural code search using AST patterns. Use when users need to find code structures beyond simple text search (function calls, class definitions, decorators, patterns).
- **autopilot-impl**: Ejecutor de implementaciones para Autopilot
- **autopilot-plan**: Planificador estratégico para Autopilot
- **break-to-tasks**: Generate a task breakdown from a technical design and specification.
- **code-refactor**: Systematically analyze and refactor code to improve quality without changing behavior.
- **code-review**: Perform comprehensive code reviews with structured feedback.
- **coding-standards**: Universal coding standards, best practices, and patterns for Python (Typer, Pydantic, FastAPI) development.
- **commit**: Generates a concise conventional commit message for the session's changes.
- **commit-changes**: Commits and pushes everything done in the current session. Uses session context to determine what belongs in the commit, drafts a message following locus conventions, asks for approval before pushing.
- **context7-mcp**: This skill should be used when the user asks about libraries, frameworks, API references, or needs code examples. Activates for setup questions, code generation involving libraries, or mentions of specific frameworks like React, Vue, Next.js, Prisma, Supabase, etc.
- **design**: Generate a technical design from an approved specification.
- **documentation-lookup**: Use up-to-date library and framework docs via Context7 MCP instead of training data. Activates for setup questions, API references, code examples, or when the user names a framework.
- **draft**: Generate a proposal and spec in a single run.
- **evolve**: Cluster the current project's instincts and propose evolved artifacts (skills, commands, agents).
- **explore**: Explore the locus project codebase and documentation freely.
- **instinct-export**: Export instincts from the current project to a file.
- **instinct-import**: Import instincts from a file or directory into the current project.
- **instinct-status**: List active instincts for the current project with confidence scores by domain.
- **modern-python**: Configure modern Python projects with uv, ruff, ty, and prek. Use when setting up new projects, writing PEP 723 scripts, or migrating from legacy tooling (pip, Poetry, mypy, black).
- **planify**: Generate a technical design and task breakdown in a single run.
- **promote**: Promote high-confidence project instincts to global scope.
- **propose**: Generate a structured proposal from a feature idea.
- **senior-architect**: Analyze and design software architecture using patterns, decision frameworks, and diagrams. Use when users ask to design systems, evaluate architecture patterns (microservices vs monolith), choose databases, plan for scalability, or analyze project dependencies.
- **smart-update**: Intelligently detects and updates stale documentation (README, CHANGELOG, AGENTS, etc.)
- **specify**: Generate a delta specification from an approved proposal.
- **tdd-workflow**: Use this skill when writing new features, fixing bugs, or refactoring code. Enforces test-driven development with 80%+ coverage including unit, integration, and E2E tests.
- **test-generator**: Generate comprehensive test suites by analyzing source code and producing well-structured tests using `pytest`.
- **test-skill**: This is a test skill used for verification.
- **update-agents-md**: Updates AGENTS.md (project-level or global) to keep it current.
- **update-changelog**: Updates CHANGELOG.md following Keep a Changelog format.
- **update-claude-md**: Updates CLAUDE.md with current project conventions, stack, structure, CLI reference, and pipeline documentation. CLAUDE.md is the authoritative source for agents working on this project.
- **update-llms-txt**: Updates llms.txt at the project root with resolved Context7 library IDs for all project dependencies. Use when adding/removing dependencies or when IDs are missing or stale.
- **update-readme**: Updates README.md to match the current project state.
- **verify**: Validate implementation against a change's artifacts.
- **worktree**: Set up or clean up a git branch and worktree for a locus change.
