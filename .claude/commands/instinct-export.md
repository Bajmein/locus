Export instincts from the current project to a file.

Usage: `/instinct-export [--domain <domain>] [--scope <scope>] [-o <output>]`

Parse any arguments provided in `$ARGUMENTS`, then run:
`python3 ~/.claude/instinctv2/scripts/instinct-cli.py export $ARGUMENTS`

Available domains: workflow, tooling, coding, testing, git, debugging
Available scopes: project, global

Example: `/instinct-export --domain workflow -o my-instincts.md`
