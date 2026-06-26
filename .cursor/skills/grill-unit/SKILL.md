---
name: grill-unit
description: >-
  /grill-unit command for checking unit test completeness after /unit. Use to
  verify scoped Vitest behavior coverage, coverage target status, public
  interface testing, boundary mocks, and missing edge cases before handoff.
disable-model-invocation: true
---

# /grill-unit — Unit Coverage Check

After `/unit`. Align with `.cursor/skills/unit/SKILL.md` Done criteria.

- Important behaviors tested via public interface; boundary mocks only
- Scoped coverage gaps named (file/branch) if team targets 100%
- No Playwright; no fake coverage via skip/ignore
- Does not replace `/unit`
