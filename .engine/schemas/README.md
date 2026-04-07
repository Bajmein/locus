# Pipeline Schemas

This directory contains YAML schemas that define the structure and validation rules for every artifact produced by the Locus pipeline. These schemas are the **single source of truth** for artifact format — the LLM reads them directly to understand what fields and sections are required.

## Schemas

| File                | Artifact                 | Description                                                                  |
| ------------------- | ------------------------ | ---------------------------------------------------------------------------- |
| `proposal.yaml`     | `proposal.md`            | Feature proposal: Why, What Changes, Capabilities, Impact                    |
| `spec.yaml`         | `specs/<domain>/spec.md` | Delta specification: ADDED / MODIFIED / REMOVED requirements with scenarios  |
| `design.yaml`       | `design.md`              | Technical design: Architecture, Data Model, Key Decisions, Project Structure |
| `tasks.yaml`        | `tasks.md`               | Task breakdown: phased implementation tasks derived from the design          |
| `hooks.schema.yaml` | `.engine/hooks.yaml`     | Declarative pre-phase hook configuration (CLI or MCP hooks)                  |

## Schema Format

Each schema (except `hooks.schema.yaml`) uses a common structure:

```yaml
id: <artifact-type>
description: >
  Human-readable description of the artifact and its purpose.

generates:
  path: <template path with placeholders>
  folder_pattern: <regex the folder name must match>

frontmatter:
  required:
    <field>: { type, description, enum, const, format, ... }
  optional:
    <field>: { type, description, ... }

sections:
  - heading: "## <Section Name>"
    required: true|false
    description: >
      What this section must contain.

instruction: >
  Validation rules for agents: what to check and how.
```

## How agents use schemas

1. **Before generating an artifact** — read the schema to know which frontmatter fields and sections are required.
2. **Before editing an artifact** — read the schema to understand the allowed values for `status`, `type`, etc.
3. **During validation** — follow the `instruction` field to verify the artifact is correct.

The `instruction` field in each schema contains the exact rules an agent must apply when checking whether an artifact is valid.
