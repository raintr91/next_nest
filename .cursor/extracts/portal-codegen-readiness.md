# Portal Codegen Readiness (post–grill-with-docs)

**Who adds:** `/grill-with-docs` only — not `/legacy-spec`, `/spec`, or `portal:gen`.

After grill, `spec.yaml` must pass:

```bash
pnpm portal:gen:dry --spec docs/features/.../<slug>.spec.yaml
```

## Pipeline

| Phase | Spec shape |
|-------|------------|
| `/legacy-spec`, `/spec` | Design v1 — `ui.screens`, `api` query/response, `entities`, no `codegen` |
| `/grill-with-docs` | Portal-gen-ready — add blocks below + `tags:` |
| `/prototype` | `portal:gen` reads YAML; **do not** edit business fields in spec |
| After gen | `docs:render` only — Screen `# /path` → dev URL in **generated `.md`**, not in YAML |

Template v1: `docs/templates/design-spec.yaml`  
Template post-grill: `docs/templates/spec.yaml`

## Enrich from design v1

| Target | Source (priority) |
|--------|-------------------|
| `codegen.profile` | Suffix of `id`: `*-list` → `list`, `*-create` → `create`, `*-edit` → `edit`, `*-detail` → `detail` |
| `codegen.entity` | Segment before function suffix: `hotel-list` → `hotel`, `admin-chain-create` → `chain` |
| `codegen.module` | `entities[].table` or pluralize(`entity`) |
| `codegen.skip` | Page already hand-built → `[page]`; else `[]` |
| `ui.composition.pattern` | List + search + table → `DataListPage`; else `custom` + reason |
| `ui.composition.overrideCommonPattern` | `true` only when `DataListPage` cannot match; note in `notes` |
| `ui.filters[]` | `api.endpoints[].query` keys + labels from `ui.screens` search copy |
| `ui.columns[]` | `api.endpoints[].response.data[0]` keys + `entities[].importantFields`; nested objects → flat key or `render: custom` |
| `ui.testIds.module` | Prefix shared by `ui.screens[].actions[].testId` / `testIdPattern` |
| `api.endpoints[].action` | `list` \| `create` \| `show` \| `update` \| `delete` matching profile |
| `tags:` | See `portal-codegen-tags.md` |

### Filter type heuristic

| Query / field hint | `type` |
|--------------------|--------|
| `*_at`, `date` | `date` |
| `status`, `activate_status`, enum | `select` |
| number / `per_page` (not in filters) | skip filter row |
| default | `text_field` |

### Column `render: custom`

Status chips, nested `chain.name`, manager pills, icon-only action columns → `render: custom` + `#needs-component: cell-{key}:MoXxx:prop` in `tags:`.

Common list shell: reference `docs/features/common/common-list-page.spec.yaml` in `notes` — no extra tag if using `DataListPage`.

## Hashtags (grill assigns)

| Tag | When |
|-----|------|
| `#needs-component: cell-{key}:MoXxx:prop` | Custom column cell; component not in repo yet |
| `#wire-only: {topic}` | Real API, auth, phase-2 |
| `#skip-codegen: {layer}` | Keep hand-written layer (`page`, …) |
| `#manual-composable: {fn}` | Bulk export, complex toolbar logic |
| `#phase-api` | Unresolved `openQuestions` for API phase |
| `#legacy-global-ui-violation` | Legacy UI differs from common; already in notes |

## Grill exit checklist

1. Interview done — contradictions resolved or in `openQuestions` + tag.
2. `codegen` + structured `ui.filters` / `ui.columns` / `ui.composition` / `ui.testIds` present.
3. `api.endpoints[].action` set for gen profile.
4. `tags:` for deferred work and missing `Mo*`.
5. Testcase YAML aligned with acceptance.
6. `pnpm portal:gen:dry --spec <file>` exits 0.
7. `pnpm docs:render`.

Handoff → `/prototype` (not before step 6 passes).
