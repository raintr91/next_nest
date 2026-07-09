# Feature artifact — flow index

> Hub diagram + lệnh script cho layout **yaml/md** mới.  
> Load policy: `.cursor/extracts/artifact-graph.md` · commands: [FEATURE-ARTIFACT-COMMANDS](./FEATURE-ARTIFACT-COMMANDS.md)

**Quy ước diagram:** mỗi file **một concern**, một Mermaid ngắn — không gộp toàn pipeline vào một diagram.

---

## Layout & IR

| Doc | Nội dung |
|-----|----------|
| [FEATURE-ARTIFACT-LAYOUT](./FEATURE-ARTIFACT-LAYOUT.md) | Cây thư mục `yaml/` · `md/` · `ir/` · `generated/` |
| [BACKEND-ARTIFACT-LAYOUT](../features/BACKEND-ARTIFACT-LAYOUT.md) | `backend/` · `contract:gen` · `nest:gen` |
| [FEATURE-ARTIFACT-BUNDLE-IR](./FEATURE-ARTIFACT-BUNDLE-IR.md) | SSOT bundle → split/merge · `spec` vs `gen` |

## Team commands (AI)

| Doc | Nội dung |
|-----|----------|
| [FEATURE-ARTIFACT-LEGACY-TRACE](./FEATURE-ARTIFACT-LEGACY-TRACE.md) | `/legacy-spec` → trace + bundle.legacy |
| [FEATURE-ARTIFACT-GRILL](./FEATURE-ARTIFACT-GRILL.md) | `/bqa-grill-docs` → `/dev-grill-docs` → [`/grill-with-docs`] |
| [DESIGN-PHASE-DIAGRAM](./DESIGN-PHASE-DIAGRAM.md) | Design lane đến `/prototype` |
| [FEATURE-ARTIFACT-COMMANDS](./FEATURE-ARTIFACT-COMMANDS.md) | Lệnh `pnpm portal:*`, `contract:gen`, `nest:gen`, `docs:render` |

## Pipeline tổng (các phase khác)

| Doc | Nội dung |
|-----|----------|
| [FULL-CYCLE-PIPELINE-DIAGRAM](./FULL-CYCLE-PIPELINE-DIAGRAM.md) | Design → Test · API → Wire → Ship |
| [TEST-PHASE-DIAGRAM](./TEST-PHASE-DIAGRAM.md) | E2E · `testcase:gen` |
| [UNIT-PHASE-DIAGRAM](./UNIT-PHASE-DIAGRAM.md) | Vitest · `portal:unit-gen` |
| [BACKEND-PHASE-DIAGRAM](./BACKEND-PHASE-DIAGRAM.md) | Nest API · contract → nest:gen |
| [NEST-UNIT-PHASE-DIAGRAM](./NEST-UNIT-PHASE-DIAGRAM.md) | Jest · `nest:unit-gen` |
| [BACKEND-CODEGEN](./BACKEND-CODEGEN.md) | Hub script backend |
| [TEAM-AI-BACKEND-WORKFLOW](./TEAM-AI-BACKEND-WORKFLOW.md) | Skills `/api-spec` … `/api-code` |
| [WIRE-PHASE-DIAGRAM](./WIRE-PHASE-DIAGRAM.md) | Integration FE ↔ Nest |
| [UPDATE-SPEC-FLOW](./UPDATE-SPEC-FLOW.md) | Gap loop |

---

## Lệnh thường dùng (copy nhanh)

```bash
# Authoring (1 lệnh phase)
pnpm phase:spec -- docs/features/yaml/admin/hotel/list/hotel-list.bundle.yaml

# Authoring toàn bộ (quét yaml/**, không cần file)
pnpm phase:spec
pnpm spec:split:all

# Common (shared) — tách riêng features
pnpm phase:common
pnpm spec:split:common
pnpm docs:render:common
# Common gen (cần codegen.profile trong mỗi spec)
pnpm portal:gen:dry:common

# Codegen (1 lệnh phase)
pnpm phase:gen -- --spec docs/features/yaml/admin/hotel/list/ir/spec.yaml

# Unit / E2E (1 lệnh phase)
pnpm phase:unit -- --spec docs/features/yaml/admin/hotel/list/ir/spec.yaml
pnpm phase:e2e -- admin/hotel

# Hạt nhân (giữ nguyên để review từng bước)
pnpm spec:split -- docs/features/yaml/admin/hotel/list/hotel-list.bundle.yaml
pnpm spec:split:check -- docs/features/yaml/admin/hotel/list/hotel-list.bundle.yaml
pnpm spec:normalize-gen -- docs/features/yaml/.../foo.bundle.yaml --write
pnpm portal:gen:dry --spec docs/features/yaml/admin/hotel/list/ir/spec.yaml
pnpm portal:gen --spec docs/features/yaml/admin/hotel/list/ir/spec.yaml
pnpm docs:render

# Validate infra
pnpm legacy-trace:validate -- docs/features/yaml/admin/hotel/_legacy.trace.yaml
pnpm extracts:validate
```

Chi tiết từng lệnh: [FEATURE-ARTIFACT-COMMANDS](./FEATURE-ARTIFACT-COMMANDS.md)
