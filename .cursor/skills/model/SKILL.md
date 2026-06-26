---
name: model
description: >-
  /model command for Portal entity models only. Use for Zod API contract schemas,
  TypeScript entity/request/response types, enums, and model helpers under
  models/. Do not edit UI, services, composables, stores, validations, or tests.
disable-model-invocation: true
---

# /model — Portal Models Only

Shared extract: `.cursor/extracts/legacy-config.md`

## Scope

Only edit `models/`.

## Rules

1. Use Zod for API contract schemas.
2. Export TypeScript types with `z.infer`.
3. Keep contract keys aligned with API/backend/database names.
4. Keep UI-only validation in `validations/`, not `models/`.
5. Do not call `$apiFetch`.
6. Do not edit pages, components, services, composables, stores, validations, or tests.

## Done

- Schemas compile.
- Types are exported.
- No upper-layer imports.
- No files outside `models/` changed.

