---
name: test
description: >-
  /test command for Portal Playwright E2E. Use when refining testcase YAML,
  writing E2E specs, converting Rapi recordings, or validating UI behavior from
  data-testid based tests.
disable-model-invocation: true
---

# /test — Portal E2E

Shared extracts: `.cursor/extracts/legacy-config.md`, `agent-discipline.md`, `verify-gate.md`

## Inputs

- `docs/features/{slug}/spec.yaml`
- `docs/features/{slug}/testcases/*.yaml`
- Prototype or wired UI with `data-testid`

## Rules

1. Testcases YAML is source of truth.
2. Playwright only under `tests/e2e/`; `page.getByTestId()` only.
3. Add missing testId before writing specs; Page Objects + focused specs.
4. Mock network only for prototype UI before `/wire`.
5. Vertical slice: one scenario → minimal spec/PO → scoped run → next scenario.
6. Test observable UI behavior, not composable/store internals.
7. Reuse `/prototype` smoke skeleton as draft; this phase completes assertions and runs Playwright.

## Minimum Scenarios

List/empty, create success, validation errors, edit/delete when in design, permission denied when guarded.

## Done

Scoped Playwright pass or failure with root cause. Then `/grill-test` for coverage audit.
