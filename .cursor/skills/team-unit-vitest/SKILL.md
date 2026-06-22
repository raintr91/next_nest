---
name: team-unit-vitest
description: >-
  /unit command for adding or improving Vitest unit tests in Portal. Use for
  composables, services, stores, models, validations, utils, payload builders,
  response parsers, and logic edge cases that should not require browser E2E.
disable-model-invocation: true
---

# /unit — Vitest Unit Tests (Portal)

## Input

- Code under test: `composables/`, `services/`, `stores/`, `models/`, `validations/`, `utils/`.
- Feature source if relevant: `docs/features/{slug}/spec.yaml`.
- Testcase source if relevant: `docs/features/{slug}/testcases/*.yaml`.

## Scope

Write unit tests for logic, not browser behavior.

Good targets:

- Validation schemas.
- Payload builders and mappers.
- Service response parsing.
- Composable state transitions.
- Store actions.
- Error handling branches.
- Pure helpers extracted from long handlers.

Not targets:

- Layout, overlap, text overflow.
- Accessibility scans.
- Playwright flows.
- Visual assertions.

## File Placement

Preferred:

```text
tests/unit/
  composables/
  services/
  validations/
  models/
  stores/
  utils/
```

Use clear names:

```text
tests/unit/validations/blog.schema.spec.ts
tests/unit/services/blog.service.spec.ts
tests/unit/composables/useBlogForm.spec.ts
```

## Rules

1. Test behavior, not implementation details.
2. Keep each testcase focused.
3. Use small fake data builders.
4. Mock `$apiFetch` at service boundary.
5. Do not import pages/components unless this is truly a component unit test.
6. If logic is hard to test, extract pure helper first.
7. Cover edge cases from `spec.yaml` and refined testcase YAML when relevant.

## Commands

```bash
pnpm test:unit
pnpm exec vitest run tests/unit/path/to/file.spec.ts
```

## Done

- Unit tests pass.
- No unrelated snapshots or broad mocks.
- Important edge case from the bug/spec is covered.
