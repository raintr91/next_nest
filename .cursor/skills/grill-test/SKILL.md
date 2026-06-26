---
name: grill-test
description: >-
  /grill-test command for checking Playwright E2E completeness after /test. Use
  to verify scenario coverage, page actions, row actions, validation/error/empty
  states, data-testid usage, and scoped run status before release handoff.
disable-model-invocation: true
---

# /grill-test — E2E Flow Check

After `/test`. Shared extract: `.cursor/extracts/verify-gate.md`

Cross-check spec/testcase YAML vs Playwright specs and Page Objects:

- Happy path, list/filter/pagination (≥2 pages when applicable), CRUD/actions per spec
- Validation, empty/error/forbidden states when required
- `getByTestId()` via Page Object; scoped Playwright pass or root cause
- Does not replace `/test`; no backend work here
