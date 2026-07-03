---
name: grill-prototype
description: >-
  /grill-prototype command for auditing a Portal prototype before demo or
  handoff to /test or /wire. Verifies spec fit, mock API boundary, testIds, and
  E2E handoff — without running Playwright.
disable-model-invocation: true
---

# /grill-prototype — Prototype audit

Use after `/prototype`, before demo, `/test`, or `/wire`.

Shared extracts: `.cursor/extracts/common-ui-spec.md`, `.cursor/extracts/portal-test-readiness.md`, `verify-gate.md`

Detail checklist in `.cursor/skills/prototype/SKILL.md` — verify:

- Spec fit: happy path, validation messages, loading/empty/error when in spec
- Mock pagination ≥2 pages when list spec applies
- Auth bypass on prototype routes (`PAGE-LIFECYCLE.md`); no real backend calls
- `DataListPage` / registry shell fit; composable mock boundary
- **testId:** `spec.ui.testIds.required` (+ `patterns`) declared; after `/prototype` gen, every id visible on UI

**Do not** run full Playwright or Vitest in this command.

## E2E handoff checklist (for `/test`)

Copy into handoff notes (Vietnamese):

1. **Route:** `{path}` · lifecycle stage · auth bypass yes/no
2. **Spec files:** list `docs/features/.../*.spec.yaml` for this route
3. **Testcase files:** list `testcases/*.yaml` (E2E only — one per function split)
4. **testIds.required:** from `spec.ui.testIds` — table ok / missing (fix spec or prototype before `/test`)
5. **testIds.patterns:** dynamic templates documented — sample id visible when mock data has row (e.g. manager pill)
6. **Session:** `setup.session` values — helper exists in `session.ts` yes/no
7. **Mocks:** `setup.mocks` vs spec `api.endpoints` — aligned yes/no
8. **#wire-only** tags — list scenarios deferred to `/wire`
9. **Open issues** — blockers for `/test`

## Out of scope

- Legacy code comparison (design lane only if ever needed)
- Writing Playwright specs (`/test`)
- Unit tests (dev-owned; no testcase YAML)

## Handoff targets

- Clear fixes → apply in prototype scope
- Ready for E2E → `/test` (read `portal-test-readiness.md`)
- API contract gaps → `/api` in backend repo, then `/wire`
