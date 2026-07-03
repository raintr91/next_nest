---
name: test
description: >-
  /test command for Portal Playwright E2E. Use when implementing Playwright from
  testcase YAML, Page Objects. Testcase YAML is
  E2E only — not unit tests.
disable-model-invocation: true
---

# /test — Portal E2E

Shared extracts: `.cursor/extracts/portal-test-readiness.md`, `agent-discipline.md`, `verify-gate.md`, `spec-split-by-function.md`

**Inputs only:** `spec.yaml`, `testcases/*.yaml`, prototype/wired UI — **no legacy** analysis in this phase.

## Prerequisites

- `/prototype` complete for the route
- Readiness gate: `.cursor/extracts/portal-test-readiness.md`

## Rules

1. **Testcase YAML = E2E source of truth** — one file per child function (spec split).
2. Playwright under `tests/e2e/` only; locators via **Page Object** → `page.getByTestId()` only (no css/xpath in specs).
3. Missing `testId` on UI → add on shared components first, then PO/spec.
4. **Vertical slice:** one testcase → PO slice + spec → scoped run → next.
5. Test **observable UI** — not composable/store internals (that is `/unit`, dev-owned).
6. After `goto`: `assertLayoutIntegrity` when testcase uses semantic smoke / list pages.

## Layout

```text
tests/e2e/pages/{module}/{Function}Page.ts
tests/e2e/{module}/{function}.spec.ts
tests/e2e/helpers/session.ts    # setup.session names from testcase
tests/e2e/fixtures/{module}.ts  # optional mock bundles
```

## Network modes

| When | E2E network |
|------|-------------|
| Before `/wire` (lifecycle ≠ wire) | Mock per `testcase.setup.mocks` |
| After `/wire` | Real API for wired endpoints; drop obsolete route mocks |

Honor spec `tags: #wire-only` — mock or skip until integration.

## Session helpers

`testcase.setup.session` must match a function in `tests/e2e/helpers/session.ts` (e.g. `mockAuthenticatedSession`). Implement helper before spec if grill noted `#needs-session-helper`.

## Minimum scenarios

Derive from spec `codegen.profile` and split testcases — list smoke, create success, validation visible, row actions, forbidden when spec requires. See readiness doc table.

## Verify

```bash
pnpm test:e2e tests/e2e/{module}/{function}.spec.ts
```

Report exit code (`verify-gate.md`).

## Done

Scoped Playwright pass or failure with root cause → `/grill-test` → optional `pnpm portal:lifecycle set {route} test`.
