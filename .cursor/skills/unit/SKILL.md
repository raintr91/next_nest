---
name: unit
description: >-
  /unit command for Portal Vitest unit tests. Use for composables, services,
  stores, models, validations, utils, payload builders, response parsers, and
  edge cases that do not need browser E2E.
disable-model-invocation: true
---

# /unit — Portal Vitest

## Scope

Write unit tests for logic, not browser behavior.

Good targets:

- validation schemas
- payload builders and mappers
- service response parsing
- composable state transitions
- store actions
- pure helpers and edge cases

Not targets:

- Playwright flows
- layout/visual/a11y checks
- full page rendering

## Rules

1. Test behavior, not implementation details.
2. Use small fake data builders.
3. Mock `$apiFetch` at service boundaries.
4. Extract pure helpers when logic is hard to test.
5. Keep tests under `tests/unit/`.

## Done

- Scoped Vitest run passes or failure is reported.
- No broad snapshots or unrelated mocks.

