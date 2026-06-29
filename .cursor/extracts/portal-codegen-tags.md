# Portal Codegen Tags

Source: `pnpm portal:gen --spec docs/features/.../*.spec.yaml`  
Templates: `scripts/portal-gen/templates/`  
Handoff output: `{feature-dir}/generated/HANDOFF.md`

## Who adds what

| Phase | Adds to spec |
|-------|----------------|
| `/legacy-spec`, `/spec` | Design v1 only — **no** `codegen`, `ui.filters`, `ui.columns`, gen `tags` |
| `/grill-with-docs` | `codegen`, `ui.composition`, `ui.filters`, `ui.columns`, `ui.testIds`, `api.action`, `tags` — see `portal-codegen-readiness.md` |
| `/prototype` + `portal:gen` | Gen scaffold + `generated/HANDOFF.md` (*Prototype next* = slot inventory only); **implement Mo* in /prototype**; registry promote in prototype |
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

### Design registry (shadcn canonical)

Source: `shared/portal-design.registry.json` · Rule: `.cursor/rules/portal-design-vocabulary.mdc`

| Tag | Generator / grill |
|-----|-------------------|
| `#shell: DataListPage` | **List mặc định** — `DataListPage` + `list/page.vue.hbs` |
| `#shell: custom` | `list/page.custom.vue.hbs` khi override |
| `#shell: DataFormPage` | Create/edit shell (planned organism) |
| `#pattern: CRUD` | Flow list/create/edit/detail |
| `#ui: {Component}` | shadcn primitive — must exist in `components/ui/` |
| `#widget: {Name}` | Form field — `fieldWidgets` in registry |
| `#render: text\|chip\|badge` | Detail read-only |
| `#shape: array\|dynamic` | Repeater / dynamic fields |
| `#style: compact\|flat` | Density / flat design |
| `#needs-ui: {Name}` | Registry `planned` — **prototype** implements; HANDOFF lists only |

List grill default (nếu thiếu): `#shell: DataListPage`, `#pattern: CRUD`, `#style: shadcn/ui`, `#style: compact`, `#style: flat`.

Alias: `DataListTable`, `common list` → `#shell: DataListPage`.

### Codegen workflow

| Tag | Generator behavior |
|-----|-------------------|
| `#needs-component: MoXxx` | Spec inventory; **prototype** implements file; gen wires slot when file exists — **no stub emit** |
| `#needs-component: cell-{key}:MoXxx` | Wire `<template #cell-{key}>` when `Mo*` exists on disk |
| `#needs-component: cell-{key}:MoXxx:label` | Third segment = prop bound from slot `value` (e.g. `MoStatusChip :label`) |
| `#custom-slot: cell-{key}` | Page slot; pair with `#needs-component` for auto-wire |
| `#manual-composable: {name}` | Skip that function in composable; HANDOFF entry |
| `#skip-codegen: {layer}` | Same as `codegen.skip` for one layer |
| `#wire-only: {topic}` | HANDOFF — defer until `/wire` (auth, real API) |

`ui.columns[].render: custom` auto-adds `#custom-slot: cell-{key}` if not already tagged.

## Commands

```bash
pnpm portal:registry   # validate shared/portal-design.registry.json
pnpm portal:gen:dry --spec docs/features/admin/hotel/admin-hotel-list.spec.yaml  # gate after grill
pnpm portal:gen --spec docs/features/admin/hotel/admin-hotel-list.spec.yaml
pnpm portal:gen --spec ... --force   # overwrite existing generated targets
```

## `/prototype` session order

Prerequisite: `portal:gen:dry` passed in `/grill-with-docs`.

1. **Đọc spec `tags:`** — `#needs-component` / `#needs-ui` inventory (grill đã đặt tên `Mo*`).
2. **Implement `Mo*` thiếu** — trước khi wire slot; promote registry nếu common (`DESIGN-REGISTRY-PROMOTION.md`).
3. **`pnpm portal:gen --spec ...`** (`--force` nếu cần) — auto `docs:render`.
4. **Post-gen** — HANDOFF chỉ còn gap; auth bypass; lint.

## After generate

1. Read `{feature-dir}/generated/HANDOFF.md` — *Prototype next* lists slots; gen does not build `Mo*`
2. **/prototype:** implement missing components from spec tags **before** expecting wired slots
3. Registry promotion (common widgets only): `docs/operational/DESIGN-REGISTRY-PROMOTION.md` — **prototype phase**, not gen
4. Re-run `portal:gen --force` after components exist
5. `portal:gen` auto-runs `docs:render`; `/wire` for real API

## Rendered in spec.md (`pnpm docs:render`)

| Section | Nguồn YAML |
|---------|------------|
| **Hashtags (workflow)** | `tags:` + auto `#custom-slot` từ columns |
| **Codegen** | `codegen`, `ui.composition`, `ui.testIds` |
| Header Screen link | `pages/` probe + `DOCS_APP_BASE_URL` — not stored in YAML |

## `#tech-debt:{id}`

Open question deferred to `openQuestions.deferTo`. Re-asked at grill step 0. Removed when resolved — see `grill-tech-debt.md`.

## `#update:*`

Confirmed spec delta from `/update-spec`. Cleared **only** at `/wire`. See `spec-update-tags.md`.
