List active instincts for the current project with confidence scores by domain.

Run: `python3 ~/.claude/instinctv2/scripts/instinct-cli.py status`

Show the output and then provide a brief interpretation:

- Highlight any instincts with confidence ≥ 0.8 (ready to promote)
- Note if observation count is below the minimum threshold
- Suggest running `/instinct-evolve` if there are 5+ high-confidence instincts
