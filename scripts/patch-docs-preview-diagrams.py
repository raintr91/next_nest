#!/usr/bin/env python3
"""Add Diagrams & flows to VitePress sidebar for docs:preview."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parent.parent
VP = ROOT / "docs/.vitepress"

DIAGRAMS = """
      {
        text: 'Diagrams & flows',
        collapsed: false,
        items: [
          { text: 'Full cycle pipeline', link: '/operational/FULL-CYCLE-PIPELINE-DIAGRAM' },
          { text: 'Design phase', link: '/operational/DESIGN-PHASE-DIAGRAM' },
          { text: 'Test phase', link: '/operational/TEST-PHASE-DIAGRAM' },
          { text: 'Wire phase', link: '/operational/WIRE-PHASE-DIAGRAM' },
          { text: 'Update spec flow', link: '/operational/UPDATE-SPEC-FLOW' },
          { text: 'Tech debt flow', link: '/operational/TECH-DEBT-FLOW' },
          { text: 'Needs component flow', link: '/operational/NEEDS-COMPONENT-FLOW' },
        ],
      },"""

def patch_config(path: Path) -> bool:
    text = path.read_text(encoding="utf-8")
    if "FULL-CYCLE-PIPELINE-DIAGRAM" in text:
        print(f"already patched: {path}")
        return True

    # After Feature artifact (index) entry (common in portal sidebar)
    m = re.search(
        r"(\{ text: 'Feature artifact flows', link: '/operational/FEATURE-ARTIFACT-FLOWS' \},)\n",
        text,
    )
    if m:
        text = text[: m.end()] + DIAGRAMS + "\n" + text[m.end() :]
        path.write_text(text, encoding="utf-8")
        print(f"patched after Feature artifact flows: {path}")
        return True

    # After text: 'Operational' items: [
    m = re.search(
        r"(text:\s*['\"]Operational['\"][^\n]*\n\s*collapsed:[^\n]*\n\s*items:\s*\[)",
        text,
    )
    if m:
        text = text[: m.end()] + DIAGRAMS + text[m.end() :]
        path.write_text(text, encoding="utf-8")
        print(f"patched Operational group: {path}")
        return True

    return False

def main():
    configs = sorted(VP.glob("config.*"))
    if not configs:
        print("ERROR: docs/.vitepress/config.* not found")
        return
    for cfg in configs:
        if patch_config(cfg):
            print("Restart docs:preview if running (Ctrl+C then pnpm docs:preview)")
            return
    print("Auto-patch failed. Snippet saved → docs/.vitepress/sidebar-diagrams-snippet.ts")
    (VP / "sidebar-diagrams-snippet.ts").write_text(
        "export const diagramSidebarItems = " + DIAGRAMS.strip() + "\n",
        encoding="utf-8",
    )
    print("Paste snippet into themeConfig.sidebar operational items manually.")

if __name__ == "__main__":
    main()
