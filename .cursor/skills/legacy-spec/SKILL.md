---
name: legacy-spec
description: >-
  /legacy-spec command for Portal. Use when reverse-engineering existing or
  legacy code into design-phase spec.yaml and testcase YAML without refactoring,
  implementing, migrating, or writing tests.
disable-model-invocation: true
---

# /legacy-spec — Code To Design Spec

## Scope

Read/analyze code only. Do not change production code.

## Inputs

Use `/legacy-spec <module-or-feature>` when the source of truth is existing code
instead of a new requirement.

Resolve legacy/project root from the first available config:

```text
~/.cursor/team-projects.json
{workspace}/.cursor/team-projects.local.json
{workspace}/.cursor/team-projects.json
~/.cursor/legacy-projects.json
{workspace}/.cursor/legacy-projects.local.json
{workspace}/.cursor/legacy-projects.json
```

If multiple projects match and none is default, ask which one.

## Workflow

1. Build a compact inventory first; do not read the whole repo.
2. Trace behavior from routes/pages/controllers/jobs/forms/services/models.
3. Extract fields, validations, permissions, UI screens, API contracts, side effects, and edge cases.
4. Mark evidence as `inferredFromCode` or `openQuestion`.
5. Write/update `docs/features/{slug}/spec.yaml`.
6. Draft testcase YAML round 1.
7. Render docs when supported.
8. Update harness notes when present.

## Evidence Rules

- Trust executable code over comments.
- Preserve legacy field/API names in evidence.
- Do not invent business intent.
- Put runtime/config/data gaps in `openQuestions`.

