#!/usr/bin/env python3
"""instinct-cli.py — instinctv2 CLI for managing project instincts."""

import argparse
import contextlib
import json
import os
import re
import sys
from datetime import UTC, datetime
from pathlib import Path

# ── Constants ─────────────────────────────────────────────────────────────────
HOMUNCULUS_DIR = Path.home() / ".claude" / "homunculus"
PROJECTS_DIR = HOMUNCULUS_DIR / "projects"
GLOBAL_INSTINCTS_DIR = HOMUNCULUS_DIR / "instincts" / "personal"
# instinctv2 dir: prefer env var, fallback to path relative to this script
_LOCUS_CLAUDE_DIR = os.environ.get("LOCUS_CLAUDE_DIR")
_INSTINCTV2_DIR = (
    Path(_LOCUS_CLAUDE_DIR) / "instinctv2" if _LOCUS_CLAUDE_DIR else Path(__file__).parent.parent
)
CONFIG_FILE = _INSTINCTV2_DIR / "config.json"

# Blocked path prefixes (path traversal protection)
BLOCKED_PREFIXES = ["/etc", "/usr", "/bin", "/sbin", "/boot", "/sys", "/proc"]

# Valid instinct ID pattern
VALID_ID_RE = re.compile(r"^[a-z0-9-]+$")


# ── Helpers ───────────────────────────────────────────────────────────────────
def load_config() -> dict:
    if CONFIG_FILE.exists():
        return json.loads(CONFIG_FILE.read_text())
    return {}


def safe_path(p: Path) -> Path:
    """Raise ValueError if path is in a blocked prefix."""
    resolved = str(p.resolve())
    for blocked in BLOCKED_PREFIXES:
        if resolved.startswith(blocked):
            raise ValueError(f"Blocked path: {resolved}")
    return p


def parse_instinct(path: Path) -> dict | None:
    """Parse a markdown instinct file with YAML frontmatter."""
    try:
        content = path.read_text()
        if not content.startswith("---"):
            return None
        parts = content.split("---", 2)
        if len(parts) < 3:
            return None
        frontmatter_str = parts[1].strip()
        body = parts[2].strip()

        fm = {}
        for line in frontmatter_str.splitlines():
            if ":" in line:
                k, _, v = line.partition(":")
                fm[k.strip()] = v.strip().strip('"')

        fm["_body"] = body
        fm["_path"] = str(path)
        return fm
    except Exception:
        return None


def list_instincts(directory: Path) -> list[dict]:
    """Return parsed instincts from a directory."""
    if not directory.exists():
        return []
    result = []
    for f in sorted(directory.glob("*.md")):
        inst = parse_instinct(f)
        if inst:
            result.append(inst)
    return result


def get_current_project() -> dict | None:
    """Detect current project via git or PWD."""
    import subprocess

    try:
        root = subprocess.check_output(
            ["git", "rev-parse", "--show-toplevel"],  # noqa: S607
            stderr=subprocess.DEVNULL,
            text=True,
        ).strip()
        name = Path(root).name
        try:
            remote = subprocess.check_output(  # noqa: S603
                ["git", "-C", root, "remote", "get-url", "origin"],  # noqa: S607
                stderr=subprocess.DEVNULL,
                text=True,
            ).strip()
            hash_input = remote
        except subprocess.CalledProcessError:
            hash_input = f"local:{root}"
        import hashlib

        project_id = hashlib.sha256(hash_input.encode()).hexdigest()[:12]
        return {"id": project_id, "name": name, "root": root}
    except subprocess.CalledProcessError:
        pass

    # Non-git: use PWD
    cwd = os.getcwd()
    name = Path(cwd).name
    import hashlib

    project_id = hashlib.sha256(f"dir:{cwd}".encode()).hexdigest()[:12]
    return {"id": project_id, "name": name, "root": cwd}


# ── Commands ──────────────────────────────────────────────────────────────────
def cmd_status(args):
    """List active instincts with confidence by domain."""
    project = get_current_project()
    if not project:
        print("Could not detect current project.")
        sys.exit(1)

    project_dir = PROJECTS_DIR / project["id"]
    local_dir = project_dir / "instincts" / "personal"
    local_instincts = list_instincts(local_dir)
    global_instincts = list_instincts(GLOBAL_INSTINCTS_DIR)

    print(f"Project: {project['name']} ({project['id']})")
    print(f"Root:    {project['root']}")
    print()

    # Observation count
    obs_file = project_dir / "observations.jsonl"
    obs_count = 0
    if obs_file.exists():
        obs_count = sum(1 for _ in obs_file.open())
    print(f"Observations: {obs_count}")
    config = load_config()
    min_obs = config.get("min_observations", 20)
    if obs_count < min_obs:
        print(f"  (need {min_obs}+ to trigger observer)")
    print()

    def print_instincts(instincts: list[dict], label: str):
        if not instincts:
            print(f"{label}: (none)")
            return
        by_domain: dict[str, list] = {}
        for inst in instincts:
            domain = inst.get("domain", "other")
            by_domain.setdefault(domain, []).append(inst)
        print(f"{label}: {len(instincts)} instinct(s)")
        for domain, items in sorted(by_domain.items()):
            print(f"  [{domain}]")
            for inst in sorted(items, key=lambda x: float(x.get("confidence", 0)), reverse=True):
                conf = float(inst.get("confidence", 0))
                iid = inst.get("id", Path(inst["_path"]).stem)
                trigger = inst.get("trigger", "")
                bar = "█" * int(conf * 10) + "░" * (10 - int(conf * 10))
                print(f"    {bar} {conf:.2f}  {iid}")
                if trigger:
                    print(f"           → {trigger}")

    print_instincts(local_instincts, "Project instincts")
    print()
    print_instincts(global_instincts, "Global instincts")


def cmd_import(args):
    """Import instincts from a file with deduplication."""
    src = Path(args.source)
    safe_path(src)

    if not src.exists():
        print(f"File not found: {src}")
        sys.exit(1)

    project = get_current_project()
    if not project:
        print("Could not detect current project.")
        sys.exit(1)
    dest_dir = PROJECTS_DIR / project["id"] / "instincts" / "personal"
    dest_dir.mkdir(parents=True, exist_ok=True)

    if src.is_file() and src.suffix == ".md":
        sources = [src]
    elif src.is_dir():
        sources = list(src.glob("*.md"))
    else:
        print(f"Expected .md file or directory, got: {src}")
        sys.exit(1)

    imported = 0
    skipped = 0
    for f in sources:
        inst = parse_instinct(f)
        if not inst:
            continue
        iid = inst.get("id", f.stem)
        if not VALID_ID_RE.match(iid):
            print(f"  Skipping invalid ID: {iid}")
            skipped += 1
            continue
        dest = dest_dir / f"{iid}.md"
        if dest.exists():
            existing = parse_instinct(dest)
            existing_conf = float(existing.get("confidence", 0)) if existing else 0
            new_conf = float(inst.get("confidence", 0))
            if new_conf <= existing_conf:
                print(f"  Skip (existing has higher confidence): {iid}")
                skipped += 1
                continue
        import shutil

        shutil.copy2(f, dest)
        print(f"  Imported: {iid}")
        imported += 1

    print(f"\nDone: {imported} imported, {skipped} skipped.")


def cmd_export(args):
    """Export instincts to a file."""
    project = get_current_project()
    if not project:
        print("Could not detect current project.")
        sys.exit(1)
    local_dir = PROJECTS_DIR / project["id"] / "instincts" / "personal"
    instincts = list_instincts(local_dir)

    if args.domain:
        instincts = [i for i in instincts if i.get("domain") == args.domain]
    if args.scope:
        instincts = [i for i in instincts if i.get("scope") == args.scope]

    if not instincts:
        print("No instincts match the filter.")
        return

    out_path = (
        Path(args.output)
        if args.output
        else Path(f"instincts-export-{datetime.now().strftime('%Y%m%d')}.md")
    )
    safe_path(out_path)

    with out_path.open("w") as f:
        f.write(f"# Instincts Export — {project['name']}\n")
        f.write(f"Generated: {datetime.now(UTC).isoformat()}\n\n")
        for inst in instincts:
            inst_path = Path(inst["_path"])
            f.write(inst_path.read_text())
            f.write("\n\n---\n\n")

    print(f"Exported {len(instincts)} instincts to: {out_path}")


def cmd_evolve(args):
    """Cluster instincts and suggest skills/commands."""
    project = get_current_project()
    if not project:
        print("Could not detect current project.")
        sys.exit(1)
    local_dir = PROJECTS_DIR / project["id"] / "instincts" / "personal"
    instincts = list_instincts(local_dir)

    if not instincts:
        print("No instincts to evolve.")
        return

    # Cluster by domain
    by_domain: dict[str, list] = {}
    for inst in instincts:
        domain = inst.get("domain", "other")
        by_domain.setdefault(domain, []).append(inst)

    print(f"Analyzing {len(instincts)} instincts across {len(by_domain)} domains...\n")

    suggestions = []
    for domain, items in sorted(by_domain.items()):
        high_conf = [i for i in items if float(i.get("confidence", 0)) >= 0.6]
        if len(high_conf) >= 2:
            ids = [i.get("id", "unknown") for i in high_conf]
            suggestions.append(
                {
                    "type": "skill",
                    "domain": domain,
                    "instinct_ids": ids,
                    "suggested_name": f"{domain}-workflow",
                    "confidence": sum(float(i.get("confidence", 0)) for i in high_conf)
                    / len(high_conf),
                }
            )
        # Suggest command for repeated workflows
        workflow_items = [
            i for i in items if i.get("domain") == "workflow" or "workflow" in i.get("trigger", "")
        ]
        if workflow_items:
            suggestions.append(
                {
                    "type": "command",
                    "domain": domain,
                    "instinct_ids": [i.get("id") for i in workflow_items],
                    "suggested_name": f"{domain}-command",
                    "confidence": sum(float(i.get("confidence", 0)) for i in workflow_items)
                    / len(workflow_items),
                }
            )

    if not suggestions:
        print("Not enough high-confidence instincts to suggest evolution yet.")
        print("(Need 2+ instincts with confidence ≥0.6 in the same domain)")
        return

    evolved_dir = PROJECTS_DIR / project["id"] / "evolved"
    vault_skills_dir = Path("/home/kenno/BenjaLabs/knowledge/library/skills")

    print("Suggested evolutions:")
    for s in suggestions:
        print(f"\n  [{s['type'].upper()}] {s['suggested_name']}")
        print(f"    Domain:     {s['domain']}")
        print(f"    Confidence: {s['confidence']:.2f}")
        print(f"    Based on:   {', '.join(s['instinct_ids'])}")

        # Write evolved artifact
        out_dir = evolved_dir / (s["type"] + "s")
        out_dir.mkdir(parents=True, exist_ok=True)
        artifact_path = out_dir / f"{s['suggested_name']}.md"

        artifact_content = f"""---
name: {s["suggested_name"]}
type: {s["type"]}
domain: {s["domain"]}
confidence: {s["confidence"]:.2f}
source_instincts: {json.dumps(s["instinct_ids"])}
evolved_at: {datetime.now(UTC).isoformat()}
---

# {s["suggested_name"]}

Generated from instincts: {", ".join(s["instinct_ids"])}

## Usage
TODO: Define the {s["type"]} behavior here based on the source instincts.

## Source Instincts
"""
        for iid in s["instinct_ids"]:
            inst_path = local_dir / f"{iid}.md"
            if inst_path.exists():
                artifact_content += f"\n### {iid}\n"
                artifact_content += inst_path.read_text()
                artifact_content += "\n"

        artifact_path.write_text(artifact_content)
        print(f"    Written to: {artifact_path}")

        # Suggest vault location
        if vault_skills_dir.exists():
            vault_path = vault_skills_dir / f"{s['suggested_name']}.md"
            print(f"    Vault path: {vault_path}")
            print(f"    (copy manually with: cp {artifact_path} {vault_path})")

    print(f"\nEvolved {len(suggestions)} artifact(s) to {evolved_dir}/")


def cmd_promote(args):
    """Promote project instinct to global (requires ≥0.8 confidence)."""
    project = get_current_project()
    if not project:
        print("Could not detect current project.")
        sys.exit(1)
    local_dir = PROJECTS_DIR / project["id"] / "instincts" / "personal"
    instincts = list_instincts(local_dir)

    config = load_config()
    min_conf = config.get("promote_requirements", {}).get("min_confidence", 0.8)

    promotable = [i for i in instincts if float(i.get("confidence", 0)) >= min_conf]

    if not promotable:
        print(f"No instincts meet promotion threshold (confidence ≥ {min_conf})")
        print("Current instincts:")
        for inst in sorted(instincts, key=lambda x: float(x.get("confidence", 0)), reverse=True):
            print(f"  {inst.get('id', '?')}: {inst.get('confidence', 0)}")
        return

    GLOBAL_INSTINCTS_DIR.mkdir(parents=True, exist_ok=True)

    if args.id:
        promotable = [i for i in promotable if i.get("id") == args.id]
        if not promotable:
            print(f"Instinct '{args.id}' not found or doesn't meet threshold.")
            sys.exit(1)

    promoted = 0
    for inst in promotable:
        iid = inst.get("id", Path(inst["_path"]).stem)
        src = Path(inst["_path"])
        dest = GLOBAL_INSTINCTS_DIR / f"{iid}.md"

        if dest.exists() and not args.force:
            print(f"  Skip (already global): {iid} (use --force to overwrite)")
            continue

        # Update scope to global before promoting
        content = src.read_text()
        content = re.sub(r"scope:\s*project", "scope: global", content)
        dest.write_text(content)
        print(f"  Promoted: {iid} → {dest}")
        promoted += 1

    print(f"\nPromoted {promoted} instinct(s) to global.")


def cmd_projects(args):
    """List known projects with stats."""
    if not PROJECTS_DIR.exists():
        print("No projects tracked yet.")
        return

    projects = []
    for p in sorted(PROJECTS_DIR.iterdir()):
        if not p.is_dir():
            continue
        meta_file = p / "project.json"
        meta = {}
        if meta_file.exists():
            with contextlib.suppress(Exception):
                meta = json.loads(meta_file.read_text())

        obs_file = p / "observations.jsonl"
        obs_count = 0
        if obs_file.exists():
            obs_count = sum(1 for _ in obs_file.open())

        instincts = list_instincts(p / "instincts" / "personal")

        projects.append(
            {
                "id": meta.get("id", p.name),
                "name": meta.get("name", p.name),
                "root": meta.get("root", ""),
                "created": meta.get("created", ""),
                "observations": obs_count,
                "instincts": len(instincts),
            }
        )

    if not projects:
        print("No projects found.")
        return

    print(f"{'Project':<25} {'ID':<14} {'Obs':>5} {'Instincts':>9}  Root")
    print("-" * 80)
    for p in projects:
        root_short = p["root"][-35:] if len(p["root"]) > 35 else p["root"]
        print(
            f"{p['name']:<25} {p['id']:<14} {p['observations']:>5}"
            f" {p['instincts']:>9}  {root_short}"
        )


# ── Main ──────────────────────────────────────────────────────────────────────
def main():
    parser = argparse.ArgumentParser(
        prog="instinct-cli",
        description="instinctv2 — Continuous Learning CLI",
    )
    sub = parser.add_subparsers(dest="command", required=True)

    # status
    sub.add_parser("status", help="List active instincts with confidence")

    # import
    p_import = sub.add_parser("import", help="Import instincts from file or directory")
    p_import.add_argument("source", help="Path to .md file or directory")

    # export
    p_export = sub.add_parser("export", help="Export instincts to file")
    p_export.add_argument("--domain", help="Filter by domain")
    p_export.add_argument("--scope", help="Filter by scope")
    p_export.add_argument("--output", "-o", help="Output file path")

    # evolve
    sub.add_parser("evolve", help="Cluster instincts and suggest skills/commands")

    # promote
    p_promote = sub.add_parser("promote", help="Promote project instinct to global")
    p_promote.add_argument("--id", help="Specific instinct ID to promote")
    p_promote.add_argument(
        "--force", action="store_true", help="Overwrite existing global instinct"
    )

    # projects
    sub.add_parser("projects", help="List known projects with stats")

    args = parser.parse_args()

    commands = {
        "status": cmd_status,
        "import": cmd_import,
        "export": cmd_export,
        "evolve": cmd_evolve,
        "promote": cmd_promote,
        "projects": cmd_projects,
    }
    commands[args.command](args)


if __name__ == "__main__":
    main()
