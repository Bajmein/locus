Reference for composing conventional commit messages in the locus project.

---

## Format

```
<type>(<scope>): <subject>

<body>

Co-Authored-By: <agent-signature>
```

## Types

| Type       | When                                                       |
| ---------- | ---------------------------------------------------------- |
| `feat`     | New feature or capability                                  |
| `fix`      | Bug fix                                                    |
| `docs`     | Documentation only                                         |
| `refactor` | Code change with no behavior change                        |
| `test`     | Tests only                                                 |
| `chore`    | Build, deps, tooling, config, skills, rules                |
| `stage`    | Pipeline stage completion (propose, specify, design, etc.) |

## Scope

Use the most specific relevant scope:

- `cli` — CLI commands and flags
- `engine` — core engine logic
- `models` — Pydantic models
- `runner` — agent runner / subprocess execution
- `pipeline` — pipeline orchestration
- `agents` — skills, rules, AGENTS.md, CLAUDE.md, llms.txt
- `<NNN>` or `<NNN-slug>` — when the commit belongs to a specific change
- Omit scope only for truly cross-cutting changes

## Subject line rules

- Imperative mood: "add", "fix", "remove" — not "added", "fixes"
- No period at the end
- Max 72 characters
- Lowercase after the colon

## Body rules

- Summarize **what changed** and **why**, not implementation details
- If the session produced files outside the repo (skills, rules), mention them
- Wrap at 72 characters
- Reference issues/PRs if relevant: `Closes #123`, `Refs #456`

## Co-authorship

Always append the agent signature:

- Claude: `Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>`
- Gemini: `Co-Authored-By: Gemini <noreply@google.com>`

## Examples

```
chore(agents): reorganize skills into category subdirectories

Moves skills from flat .agents/skills/ into automation/,
development/, maintenance/, pipeline/, instinct/, shared/,
and utility/ categories. Migrates draft and planify to
.claude/commands/ as fast-draft and fast-plan.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
```

```
feat(cli): add --provider flag and model alias resolution

Adds Provider enum (claude/gemini), per-provider alias maps,
and resolve_model() to models.py.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
```

```
stage(003-sota): design approved — write design.md

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
```

## Abort conditions

- Never commit if `git status` is clean
- Never commit `.env` or credential files — warn the user explicitly
- If pre-commit hooks fail: fix the issue, re-stage, create a NEW commit (never `--amend`)
