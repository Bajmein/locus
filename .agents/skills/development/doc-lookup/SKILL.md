---
name: documentation-lookup
description: Use up-to-date library and framework docs via Context7 MCP instead of training data. Activates for setup questions, API references, code examples, or when the user names a framework.
origin: ECC
---

# Documentation Lookup (Context7)

When the user asks about libraries, frameworks, or APIs, fetch current documentation via the Context7 MCP (tools `resolve-library-id` and `query-docs`) instead of relying on training data.

## Core Concepts

- **Context7**: MCP server that exposes live documentation; use it instead of training data for libraries and APIs.
- **llms.txt**: A file in the project root that maps libraries to their Context7 IDs. **ALWAYS check this first.**
- **resolve-library-id**: Returns Context7-compatible library IDs (e.g. `/tiangolo/fastapi`) from a library name and query.
- **query-docs**: Fetches documentation and code snippets for a given library ID and question. Always call resolve-library-id first to get a valid library ID (unless found in `llms.txt`).

## When to use

Activate when the user:

- Asks setup or configuration questions (e.g. "How do I configure Typer CLI?")
- Requests code that depends on a library ("Write a Pydantic model for...")
- Needs API or reference information ("What are the methods in Python's pathlib?")
- Mentions specific frameworks or libraries (Typer, Pydantic, FastAPI, SQLAlchemy, Pytest, etc.)

Use this skill whenever the request depends on accurate, up-to-date behavior of a library, framework, or API.

## How it works

### Step 1: Check `llms.txt`

Check if the library is listed in the `llms.txt` file in the project root. If found, use the ID specified there (e.g., `context7:///tiangolo/fastapi` -> `/tiangolo/fastapi`).

### Step 2: Resolve the Library ID (if not in `llms.txt`)

Call the **resolve-library-id** MCP tool with:

- **libraryName**: The library or product name taken from the user's question (e.g. `Typer`, `Pydantic`).
- **query**: The user's full question. This improves relevance ranking of results.

You must obtain a Context7-compatible library ID (format `/org/project` or `/org/project/version`) before querying docs.

### Step 3: Select the Best Match

From the resolution results, choose one result using:

- **Name match**: Prefer exact or closest match to what the user asked for.
- **Benchmark score**: Higher scores indicate better documentation quality.
- **Source reputation**: Prefer High or Medium reputation when available.
- **Version**: If the user specified a version, prefer a version-specific library ID if listed.

### Step 4: Fetch the Documentation

Call the **query-docs** MCP tool with:

- **libraryId**: The selected Context7 library ID.
- **query**: The user's specific question or task. Be specific to get relevant snippets.

Limit: do not call query-docs (or resolve-library-id) more than 3 times per question.

### Step 5: Use the Documentation

- Answer the user's question using the fetched, current information.
- Include relevant code examples from the docs when helpful.
- Cite the library or version when it matters.

## Examples

### Example: Typer CLI

1. Check `llms.txt` for `Typer`.
2. If not found, call **resolve-library-id** with `libraryName: "Typer"`, `query: "How do I create a CLI with arguments?"`.
3. Select `/tiangolo/typer`.
4. Call **query-docs** with `libraryId: "/tiangolo/typer"`, `query: "How do I create a CLI with arguments?"`.
5. Use returned snippets to show `@app.command()` usage.

### Example: Pydantic Validation

1. Check `llms.txt`.
2. If not found, resolve `Pydantic`.
3. Select `/pydantic/pydantic`.
4. Query docs for "custom validators".
5. Return code snippet using `@field_validator`.

### Example: Pytest Fixtures

1. Check `llms.txt`.
2. If not found, resolve `pytest`.
3. Select `/pytest-dev/pytest`.
4. Query docs for "fixture scope".
5. Explain `scope="session"` vs `scope="function"`.

## Best Practices

- **Be specific**: Use the user's full question as the query where possible for better relevance.
- **Version awareness**: When users mention versions, use version-specific library IDs.
- **Prefer official sources**: When multiple matches exist, prefer official or primary packages.
- **No sensitive data**: Redact API keys, passwords, tokens, and other secrets from any query sent to Context7.
