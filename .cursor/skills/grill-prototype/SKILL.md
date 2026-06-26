---
name: grill-prototype
description: >-
  /grill-prototype command for stress-testing a Portal design prototype before
  running or demoing it. Use after /prototype has produced or changed prototype
  UI, before opening dev/demo, to verify spec fit, real actions, mocked API
  boundary, state coverage, test IDs, and legacy-to-SPA conversion.
disable-model-invocation: true
---

# /grill-prototype — Prototype Audit

Use after `/prototype`, before demo or handoff to `/wire` / `/test`.

Shared extracts: `.cursor/extracts/legacy-blade-to-api.md`, `common-ui-spec.md`, `verify-gate.md`

Detail checklist lives in `.cursor/skills/prototype/SKILL.md` — verify:

- Spec fit, happy path, validation messages, loading/empty/error states
- Mock pagination ≥2 pages when applicable; text/icon/layout positions
- Auth bypass on prototype routes; no real backend calls
- `DataListPage` reuse; composable interface depth; testId handoff
- Fix clear issues in scope; no full E2E/unit runs

Handoff (Vietnamese): route grilled, fixes applied, open issues, auth bypass list, smoke skeleton notes for `/test` or `/unit`.
