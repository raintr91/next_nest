---
name: design
description: >-
  Deprecated — use /spec for specs or /prototype for UI. Kept only as alias
  pointer for older prompts and docs.
disable-model-invocation: true
---

# /design — Deprecated

Split into two commands:

| Intent | Command | Skill |
|--------|---------|-------|
| Spec + testcase round 1 + docs | `/spec` | `.cursor/skills/spec/SKILL.md` |
| UI prototype (mock API boundary) | `/prototype` | `.cursor/skills/prototype/SKILL.md` |

Supporting commands: `/legacy-spec`, `/grill-with-docs`, `/grill-prototype`.

Do not load this file for new work — use the command that matches the task.
