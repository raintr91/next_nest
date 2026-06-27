# Portal Codegen Tags

Source: `pnpm portal:gen --spec docs/features/.../*.spec.yaml`  
Templates: `scripts/portal-gen/templates/`  
Handoff output: `{feature-dir}/generated/HANDOFF.md`

## Who adds what

| Phase | Adds to spec |
|-------|----------------|
| `/legacy-spec`, `/spec` | Design v1 only — **no** `codegen`, `ui.filters`, `ui.columns`, gen `tags` |
| `/grill-with-docs` | `codegen`, `ui.composition`, `ui.filters`, `ui.columns`, `ui.testIds`, `api.action`, `tags` — see `portal-codegen-readiness.md` |
| `/prototype` + `portal:gen` | Code files + `generated/HANDOFF.md`; **no** spec YAML edits |
| After gen | `docs:render` — Screen `# /path` → dev URL in **generated `.md`** only |

## Spec blocks for codegen

| Block | Purpose |
|-------|---------|
| `codegen.profile` | `list` \| `create` \| `edit` \| `detail` |
| `codegen.entity` | Singular snake/camel base (`hotel`) |
| `codegen.module` | Plural module id + mock id (`hotels`) |
| `codegen.skip` | Skip layers: `models`, `service`, `composable`, `page`, `mock`, `validation`, `component` |
| `ui.filters` | Maps to `SearchFilterConfig[]` |
| `ui.columns` | Maps to `DataTableColumn[]`; `render: custom` → slot stub |
| `ui.composition.pattern` | `DataListPage` (default) or `custom` |
| `ui.composition.overrideCommonPattern` | `true` → HANDOFF, no DataListPage shell |
| `api.endpoints[].action` | `list`, `create`, … — picks endpoint for service |

## Hashtags (`tags:`)

| Tag | Generator behavior |
|-----|-------------------|
| `#needs-component: MoXxx` | Stub at `components/molecules/custom/` if missing; wire slot when paired |
| `#needs-component: cell-{key}:MoXxx` | Wire `<template #cell-{key}>` → `<MoXxx />` (Nuxt auto-import) |
| `#needs-component: cell-{key}:MoXxx:label` | Third segment = prop bound from slot `value` (e.g. `MoStatusChip :label`) |
| `#custom-slot: cell-{key}` | Page slot; pair with `#needs-component` for auto-wire |
| `#manual-composable: {name}` | Skip that function in composable; HANDOFF entry |
| `#skip-codegen: {layer}` | Same as `codegen.skip` for one layer |
| `#wire-only: {topic}` | HANDOFF — defer until `/wire` (auth, real API) |

`ui.columns[].render: custom` auto-adds `#custom-slot: cell-{key}` if not already tagged.

## Commands

```bash
pnpm portal:gen:dry --spec docs/features/admin/hotel/admin-hotel-list.spec.yaml  # gate after grill
pnpm portal:gen --spec docs/features/admin/hotel/admin-hotel-list.spec.yaml
pnpm portal:gen --spec ... --force   # overwrite existing generated targets
```

## `/prototype` session order

Prerequisite: `portal:gen:dry` passed in `/grill-with-docs`.

1. **Quét `#needs-component`** — tags + columns `render: custom`; không scaffold tay.
2. **Component nhỏ** — chỉ `Mo*` thiếu.
3. **`pnpm portal:gen --spec ...`** — auto `docs:render`.
4. **Post-gen** — HANDOFF, auth bypass, lint.

## After generate

1. Read `{feature-dir}/generated/HANDOFF.md`
2. Wire slots to components from step 2; finish remaining HANDOFF items
3. `portal:gen` auto-runs `docs:render` → Screen link in spec `.md`; nếu fail: `pnpm docs:render`
4. `/grill-prototype` before demo; `/wire` for real API

## Rendered in spec.md (`pnpm docs:render`)

| Section | Nguồn YAML |
|---------|------------|
| **Hashtags (workflow)** | `tags:` + auto `#custom-slot` từ columns |
| **Codegen** | `codegen`, `ui.composition`, `ui.testIds` |
| Header Screen link | `pages/` probe + `DOCS_APP_BASE_URL` — not stored in YAML |
