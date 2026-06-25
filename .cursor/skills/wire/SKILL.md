---
name: wire
description: >-
  /wire command for Portal API integration. Use when replacing mocked API
  responses with real backend services/composables and aligning models,
  validations, pages, and E2E with the real API.
disable-model-invocation: true
---

# /wire — Portal API Integration

## Inputs

- approved `spec.yaml`
- backend endpoint contract or staging API response
- existing prototype and testcase YAML

## Order

1. Align `models/` schemas/types with real API.
2. Add/update `services/*` using `$apiFetch`.
3. Update composables to call services.
4. Update validations when form API errors require it.
5. Bind pages/components to composables.
6. Remove production mock imports.
7. Run scoped E2E.

## Rules

- Preserve Portal 4-layer architecture.
- Do not rename contract fields just for FE convenience.
- Keep mocks only for tests or local fallback when explicitly needed.
- Do not edit backend unless the task explicitly includes the backend project.

## Done

- Real create/list/update/delete flow works for the scoped entity.
- Mock production path is removed.
- Lint/typecheck/scoped E2E status is reported.

