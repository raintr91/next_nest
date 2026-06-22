---
name: team-model
description: >-
  /model command for creating or updating Portal entity models only. Use for
  Zod API contract schemas, TypeScript entity/request/response types, enum types,
  and model helpers under models/. Do not edit UI, services, composables, stores,
  validations, or tests.
disable-model-invocation: true
---

# /model — Entity Models (Portal)

## Purpose

Create or refine the `models/` layer during `/design` or before `/wire`.

This command is for API contract and entity type shape only.

## Input

- `docs/features/{slug}/spec.yaml`
- Entity/field bullet descriptions from user
- API response/request examples if available

## Output

Only files under:

```text
models/
```

Recommended examples:

```text
models/blog/schemas.ts
models/blog/types.ts
models/blog/index.ts
```

## Rules

1. Scope only `models/`.
2. Use Zod for API contract schemas.
3. Export TypeScript types via `z.infer`.
4. Keep API schemas aligned with backend payloads.
5. Keep UI-specific constraints in `validations/`, not `models/`.
6. Do not import from services, stores, composables, pages, or components.
7. Do not call `$apiFetch`.
8. Do not edit UI/test files in this command.

## Pattern

```ts
import { z } from 'zod'

export const blogSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  status: z.enum(['draft', 'published']),
})

export type Blog = z.infer<typeof blogSchema>

export const createBlogRequestSchema = z.object({
  title: z.string(),
  slug: z.string(),
  content: z.string().optional(),
  status: z.enum(['draft', 'published']).optional(),
})

export type CreateBlogRequest = z.infer<typeof createBlogRequestSchema>
```

## Done

- Model schemas compile.
- Types are exported.
- No imports from upper layers.
- No files outside `models/` changed.
