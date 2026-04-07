Approve a proposal by updating its status to `approved`.

Usage: `/approve <NNN-slug>`

## Execute

1. Read `.engine/changes/$ARGUMENTS/proposal.md`.
2. Check the `status` field in the frontmatter. If it is already `approved`, report that and stop.
3. Use Edit to change the `status` field to `approved`.
4. Confirm: "Proposal `.engine/changes/$ARGUMENTS/proposal.md` approved. Status updated to `approved`."

Do not modify any other fields or content in the file.
