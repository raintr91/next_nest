---
name: unit
description: >-
  /unit command for Portal Vitest unit tests. Use for composables, services,
  stores, models, validations, utils, payload builders, response parsers, and
  edge cases that do not need browser E2E.
disable-model-invocation: true
---

# /unit — Portal Vitest

Shared extracts: `.cursor/extracts/agent-discipline.md`, `verify-gate.md`

## Scope

Logic tests only — not browser layout, a11y, or Playwright.

Good: validations, payload builders, parsers, composable state, store actions, pure helpers.

## Rules

1. Behavior over implementation details; public interface only.
2. Small fake data builders; mock `$apiFetch` at service boundaries.
3. Tests under `tests/unit/`.
4. Vertical slice: one behavior → one test → minimal fix → green → next.
5. Mock at system boundary only; no internal call-count mocks.
6. Refactor only after green.

## Done

Scoped Vitest pass or reported failure. Then `/grill-unit` for coverage audit.
