#!/usr/bin/env python3
"""
distill.py — Analyzes observations.jsonl and writes instinct files.
Usage: python3 distill.py <project_dir> <project_name>
"""

import json
import re
import sys
from collections import Counter, defaultdict
from datetime import UTC, datetime
from pathlib import Path

TODAY = datetime.now(UTC).strftime("%Y-%m-%d")

CONFIDENCE_THRESHOLDS = [(11, 0.85), (6, 0.7), (3, 0.5), (1, 0.3)]


def compute_confidence(count: int) -> float:
    for threshold, value in CONFIDENCE_THRESHOLDS:
        if count >= threshold:
            return value
    return 0.3


def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[\s_]+", "-", text)
    return text[:60]


def load_observations(project_dir: Path) -> list[dict]:
    obs_file = project_dir / "observations.jsonl"
    if not obs_file.exists():
        return []
    obs = []
    with open(obs_file) as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            import contextlib

            with contextlib.suppress(json.JSONDecodeError):
                obs.append(json.loads(line))
    return obs


def detect_tool_preferences(observations: list[dict]) -> list[dict]:
    """Detect consistent tool usage patterns."""
    bash_cmds = []
    for o in observations:
        if o["tool"] == "Bash":
            cmd = o.get("input", {}).get("command", "")
            if cmd:
                bash_cmds.append(cmd)

    instincts = []

    # Detect mise run X vs direct tool invocations
    mise_run_cmds = [c for c in bash_cmds if c.strip().startswith("mise run")]
    if len(mise_run_cmds) >= 3:
        unique_tasks = Counter(
            re.search(r"mise run (\S+)", c).group(1)
            for c in mise_run_cmds
            if re.search(r"mise run (\S+)", c)
        )
        for task, count in unique_tasks.most_common():
            if count >= 2:
                conf = compute_confidence(count)
                instincts.append(
                    {
                        "id": f"mise-run-{task}",
                        "trigger": f"when running {task} tasks in this project",
                        "confidence": conf,
                        "domain": "tooling",
                        "evidence_count": count,
                        "action": f"Use `mise run {task}` instead of invoking the tool directly.",
                        "evidence": f"Observed `mise run {task}` used {count} times.",
                        "examples": [c[:80] for c in mise_run_cmds if task in c][:3],
                    }
                )

    # Detect uv vs pip preference
    uv_cmds = [c for c in bash_cmds if re.search(r"\buv\b", c)]
    pip_cmds = [c for c in bash_cmds if re.search(r"\bpip\b", c)]
    if len(uv_cmds) >= 3 and len(pip_cmds) == 0:
        instincts.append(
            {
                "id": "use-uv-not-pip",
                "trigger": "when adding or managing Python dependencies",
                "confidence": compute_confidence(len(uv_cmds)),
                "domain": "tooling",
                "evidence_count": len(uv_cmds),
                "action": "Use `uv add` / `uv sync` for Python package management, never `pip`.",
                "evidence": f"Observed `uv` used {len(uv_cmds)} times, `pip` never used.",
                "examples": uv_cmds[:3],
            }
        )

    return instincts


def detect_repeated_workflows(observations: list[dict]) -> list[dict]:
    """Detect sequences of tools used 3+ times."""
    tools_seq = [o["tool"] for o in observations]
    instincts = []

    # Look for common 2-tool sequences
    bigrams = Counter((tools_seq[i], tools_seq[i + 1]) for i in range(len(tools_seq) - 1))
    for (t1, t2), count in bigrams.most_common(10):
        if count >= 3 and t1 != t2:
            conf = compute_confidence(count)
            instincts.append(
                {
                    "id": f"workflow-{slugify(t1)}-then-{slugify(t2)}",
                    "trigger": f"after using {t1}",
                    "confidence": conf,
                    "domain": "workflow",
                    "evidence_count": count,
                    "action": f"Follow {t1} with {t2} — this sequence is typical in this project.",
                    "evidence": f"Sequence {t1} → {t2} observed {count} times.",
                    "examples": [f"{t1} → {t2}"],
                }
            )

    return instincts


def detect_user_corrections(observations: list[dict]) -> list[dict]:
    """Detect cases where tools were retried with different params."""
    instincts = []

    # Look for Edit/Write followed by another Edit/Write on the same file quickly
    edit_tools = {"Edit", "Write"}
    retry_pairs = []
    for i in range(len(observations) - 1):
        o1, o2 = observations[i], observations[i + 1]
        if o1["tool"] in edit_tools and o2["tool"] in edit_tools:
            f1 = o1.get("input", {}).get("file_path", "")
            f2 = o2.get("input", {}).get("file_path", "")
            if f1 and f1 == f2:
                retry_pairs.append(f1)

    if len(retry_pairs) >= 2:
        files = Counter(retry_pairs)
        for fname, count in files.most_common(3):
            instincts.append(
                {
                    "id": f"multi-edit-{slugify(Path(fname).name)}",
                    "trigger": f"when editing {Path(fname).name}",
                    "confidence": compute_confidence(count),
                    "domain": "coding",
                    "evidence_count": count,
                    "action": f"Read {Path(fname).name} carefully before editing — multiple sequential edits observed.",  # noqa: E501
                    "evidence": f"Multiple sequential edits to {Path(fname).name} observed {count} times.",  # noqa: E501
                    "examples": [f"Edit → Edit on {fname}"],
                }
            )

    return instincts


def detect_error_resolutions(observations: list[dict]) -> list[dict]:
    """Detect repeated error → fix sequences from Bash outputs."""
    instincts = []
    error_patterns = defaultdict(int)

    for o in observations:
        if o["tool"] == "Bash":
            output = str(o.get("output_truncated", ""))
            if "error" in output.lower() or "failed" in output.lower() or "Exit code" in output:
                # Extract error type
                if "ModuleNotFoundError" in output:
                    error_patterns["missing-module"] += 1
                elif "ruff" in output.lower() and (
                    "error" in output.lower() or "warning" in output.lower()
                ):
                    error_patterns["ruff-lint-error"] += 1
                elif "pytest" in output.lower() and "failed" in output.lower():
                    error_patterns["test-failure"] += 1
                elif "Exit code" in output:
                    error_patterns["bash-exit-error"] += 1

    for error_type, count in error_patterns.items():
        if count >= 2:
            instincts.append(
                {
                    "id": f"error-{error_type}",
                    "trigger": f"when encountering {error_type.replace('-', ' ')}",
                    "confidence": compute_confidence(count),
                    "domain": "debugging",
                    "evidence_count": count,
                    "action": f"Check for {error_type.replace('-', ' ')} — this error appears repeatedly in this project.",  # noqa: E501
                    "evidence": f"Error type '{error_type}' observed {count} times in Bash outputs.",  # noqa: E501
                    "examples": [f"Bash output containing {error_type}"],
                }
            )

    return instincts


def write_instinct(instincts_dir: Path, instinct: dict) -> None:
    path = instincts_dir / f"{instinct['id']}.md"
    examples_md = "\n".join(f"- {e}" for e in instinct.get("examples", []))
    content = f"""---
id: {instinct["id"]}
trigger: "{instinct["trigger"]}"
confidence: {instinct["confidence"]}
domain: {instinct["domain"]}
scope: project
last_updated: {TODAY}
evidence_count: {instinct["evidence_count"]}
---

## Action
{instinct["action"]}

## Evidence
{instinct["evidence"]}

## Examples
{examples_md}
"""
    path.write_text(content)


def main():
    if len(sys.argv) < 3:
        print("Usage: distill.py <project_dir> <project_name>", file=sys.stderr)
        sys.exit(1)

    project_dir = Path(sys.argv[1])
    project_name = sys.argv[2]
    instincts_dir = project_dir / "instincts" / "personal"
    instincts_dir.mkdir(parents=True, exist_ok=True)

    observations = load_observations(project_dir)
    if len(observations) < 20:
        print(f"Not enough observations yet ({len(observations)}/20 needed).")
        sys.exit(0)

    print(f"Analyzing {len(observations)} observations for project '{project_name}'...")

    all_instincts = []
    all_instincts.extend(detect_tool_preferences(observations))
    all_instincts.extend(detect_repeated_workflows(observations))
    all_instincts.extend(detect_user_corrections(observations))
    all_instincts.extend(detect_error_resolutions(observations))

    # Deduplicate by ID (keep highest confidence)
    seen: dict[str, dict] = {}
    for inst in all_instincts:
        iid = inst["id"]
        if iid not in seen or inst["confidence"] > seen[iid]["confidence"]:
            seen[iid] = inst

    written = 0
    for inst in seen.values():
        write_instinct(instincts_dir, inst)
        written += 1
        print(f"  [{inst['confidence']:.2f}] {inst['id']} ({inst['domain']})")

    # Update last-distilled timestamp
    ts_file = project_dir / ".last_distilled"
    ts_file.write_text(datetime.now(UTC).isoformat())

    print("\nInstinct observer complete.")
    print(f"New instincts: {written}")
    print(f"Written to: {instincts_dir}")


if __name__ == "__main__":
    main()
