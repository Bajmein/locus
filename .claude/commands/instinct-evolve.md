Cluster the current project's instincts and propose evolved artifacts (skills, commands, agents).

Run: `python3 ~/.claude/instinctv2/scripts/instinct-cli.py evolve`

After the CLI output, do the following:

1. For each suggested skill, ask whether to copy it to episteme vault as `skill-<name>.md`
2. For each suggested command, ask whether to create a slash command in `~/.claude/commands/`
3. For each suggested agent, ask whether to save it to episteme vault as `skill-<name>.agent.md`

If the user confirms, perform the copy/creation with appropriate edits to fill in the TODO sections based on the source instincts.
