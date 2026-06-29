#!/usr/bin/env python3
"""Rewrite diagram .md — overview gọn + detail per phase."""
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OP = ROOT / "docs/operational"
F = "```"

def md(title: str, mermaid: str, extra: str = "") -> str:
    body = f"# {title}\n\n{F}mermaid\n{mermaid.strip()}\n{F}\n"
    if extra:
        body += "\n" + extra.strip() + "\n"
    return body

# Only regenerate stub/phase files — FULL/DESIGN/BACKEND maintained by hand.
STUBS = {
    "TEST-PHASE-DIAGRAM.md": md(
        "Test phase",
        """
flowchart LR
  TC["testcase:gen"] --> T["/test"] --> GT["/grill-test"]
""",
        """> Detail cycle TBD. Overview: [FULL-CYCLE-PIPELINE-DIAGRAM](./FULL-CYCLE-PIPELINE-DIAGRAM).
""",
    ),
    "WIRE-PHASE-DIAGRAM.md": md(
        "Wire phase",
        """
flowchart LR
  API["api-code done"] --> W["/wire"] --> GA["/grill-api"]
""",
        """> Detail cycle TBD. Overview: [FULL-CYCLE-PIPELINE-DIAGRAM](./FULL-CYCLE-PIPELINE-DIAGRAM).
""",
    ),
}

def verify(path: Path) -> None:
    t = path.read_text(encoding="utf-8")
    if "\\`\\`\\`" in t:
        print(f"WARN escaped fences: {path.name}")
    else:
        print(f"OK {path.name}")

def main():
    for name, content in STUBS.items():
        p = OP / name
        print(f"skip hand-maintained: {name} (use repo version)")
    print("Overview + Design + Backend: edit docs/operational/*-DIAGRAM.md directly")

if __name__ == "__main__":
    main()
