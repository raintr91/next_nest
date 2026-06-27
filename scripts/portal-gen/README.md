# Portal Gen

Generate 4-layer scaffold from feature `spec.yaml` (Handlebars templates).

## Usage

```bash
pnpm portal:gen --spec docs/features/admin/hotel/admin-hotel-list.spec.yaml
pnpm portal:gen:dry --spec docs/features/.../feature.spec.yaml
pnpm portal:gen --spec ... --force
```

## Spec requirements

Copy `docs/templates/spec.yaml`. Required:

- `codegen.profile` — `list` | `create`
- `codegen.entity`, `codegen.module`
- `ui.routes`, `ui.columns` (list), `ui.filters` (optional)
- `api.endpoints` with `action: list` or `create`
- `tags` — see `.cursor/extracts/portal-codegen-tags.md`

## Output

- App code under `models/`, `services/`, `composables/`, `pages/`, `mocks/`
- `docs/features/{feature}/generated/HANDOFF.md` — manual follow-up from hashtags
- `docs/features/{feature}/generated/codegen.manifest.json`

## Templates

```
scripts/portal-gen/templates/
  list/       — DataListPage list flow (auto-wires #needs-component → cell slots)
  create/     — form + useApiForm
  partials/   — component-stub.vue.hbs when Mo* molecule missing
```

Tag examples:

```yaml
tags:
  - "#needs-component: cell-status:MoStatusChip:label"
columns:
  - key: status
    render: custom
    # or: component: MoStatusChip
    #     componentProp: label
```

Stack: Node ESM + `yaml` + `handlebars` (same family as `scripts/docs/render-docs.mjs`).
