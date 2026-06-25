---
name: test
description: >-
  /test command for Portal Playwright E2E. Use when refining testcase YAML,
  writing E2E specs, converting Rapi recordings, or validating UI behavior from
  data-testid based tests.
disable-model-invocation: true
---

# /test — Portal E2E

## Inputs

- `docs/features/{slug}/spec.yaml`
- `docs/features/{slug}/testcases/*.yaml`
- working prototype or wired UI with `data-testid`

## Rules

1. Testcases YAML is the source of truth.
2. Use Playwright only under `tests/e2e/`.
3. Use `page.getByTestId()` only for selectors.
4. Add missing testId before writing the spec.
5. Use Page Objects and focused specs.
6. Mock network only when testing prototype UI behavior before `/wire`.

## Minimum Scenarios

- List load and empty state.
- Create success.
- Validation errors.
- Edit/delete when design includes them.
- Permission denied when guards exist.

## Done

- Scoped Playwright run passes or failure is reported with root cause.
- Testcase YAML links to the implemented spec.

