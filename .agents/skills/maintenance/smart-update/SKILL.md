---
description: Intelligently detects and updates stale documentation (README, CHANGELOG, AGENTS, etc.)
---

Perform a Smart Update of the project documentation by following these steps:

1. Research: Analyze the recent git history (last 20 commits) and check for changes in core files (mise.toml, pyproject.toml, src/locus/cli.py, etc.).
2. Detection:
   - If there are commits not in CHANGELOG.md, mark it for update.
   - If CLI commands, dependencies, or the project stack have changed since the last README.md edit, mark it for update.
   - If project conventions or agent-specific instructions in AGENTS.md are outdated, mark it for update.
3. Execution: For each document marked for update, activate the corresponding skill (update-changelog, update-readme, update-agents-md) and execute its procedure.
4. Finality: Provide a brief summary of what was updated and why.
