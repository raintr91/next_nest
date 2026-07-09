# Wire phase — FE ↔ Nest integration

> **Phase 3 Wire** — [FULL-CYCLE-PIPELINE-DIAGRAM](./FULL-CYCLE-PIPELINE-DIAGRAM).  
> Prerequisite API: [BACKEND-PHASE-DIAGRAM](./BACKEND-PHASE-DIAGRAM.md) · API unit green: [NEST-UNIT-PHASE-DIAGRAM](./NEST-UNIT-PHASE-DIAGRAM.md).  
> Prerequisite FE: [PORTAL-CODEGEN](./PORTAL-CODEGEN.md) · E2E mock lane: [TEST-PHASE-DIAGRAM](./TEST-PHASE-DIAGRAM.md)

Wire = chuyển feature từ **mock API / MSW** sang **Nest thật** (`apps/api`), đồng bộ contract `@portal/models`, bật auth lifecycle `wire`.

---

## Wire cycle (flow chính)

```mermaid
flowchart TD
  PRE_FE["portal:gen + prototype\ntestIds on UI"]
  PRE_API["nest:gen + nest:unit-gen\nJest green"]
  PRE_E2E["testcase:gen\nE2E mock green"]
  W["/wire"]
  SVC["apps/web/src/services/*.ts\n→ apiFetch Nest URL"]
  MOCK["mocks/ off hoặc\nNEXT_PUBLIC_API_URL"]
  PU["portal:unit-gen --phase wire"]
  E2E["test:e2e scoped"]
  GW["/grill-api\nintegration audit"]
  LIFE["pnpm portal:lifecycle set {route} wire"]
  DONE["wire done · auth on"]

  PRE_FE --> W
  PRE_API --> W
  PRE_E2E --> W
  W --> SVC
  W --> MOCK
  SVC --> PU
  MOCK --> PU
  PU --> E2E
  E2E --> GW
  GW --> LIFE
  LIFE --> DONE

  GW -.->|gap| W
```

| Bước | Ai | Việc |
|------|-----|------|
| Prerequisites | dev | FE scaffold + API module + E2E mock pass |
| **`/wire`** | dev + AI | Map `api.endpoints` → `services/` gọi `/api/...` Nest |
| **Env** | dev | `NEXT_PUBLIC_API_URL` hoặc proxy → `:4000` ([BACKEND-API-QUICKSTART](./BACKEND-API-QUICKSTART.md)) |
| **`portal:unit-gen --phase wire`** | script | Service tests mock real response shape |
| **`pnpm test:e2e`** | dev | Playwright against integrated stack |
| **`/grill-api`** | dev + AI | Contract keys FE↔BE, error envelope, pagination |
| **Lifecycle `wire`** | dev | `pnpm portal:lifecycle set /route wire` — auth bật ([PAGE-LIFECYCLE](./PAGE-LIFECYCLE.md)) |

---

## Kiến trúc runtime (wire)

```mermaid
flowchart LR
  subgraph FE["apps/web — Next.js"]
    P["app/(dashboard)/"]
    HO[hooks/]
    SV[services/]
    MO["@portal/models"]
  end

  subgraph API["apps/api Nest"]
    CTL[Controller]
    CQRS[QueryBus / CommandBus]
    ORM[TypeORM → MySQL]
  end

  P --> HO --> SV
  SV -->|"HTTP /api/*"| CTL
  CTL --> CQRS --> ORM
  SV --> MO
  CQRS --> MO
```

Chi tiết 4 tầng FE + monorepo: [ARCHITECTURE](./ARCHITECTURE.md).

---

## Contract alignment (không rename keys)

```mermaid
flowchart TB
  IR["ir/spec.yaml\nentities.fields"]
  CG["contract:gen"]
  ZOD["@portal/models Zod"]
  BE["01-backend-spec.yaml"]
  NG["nest:gen Resource"]
  FE["portal:gen service\nparseApiData + schema"]

  IR --> CG --> ZOD
  IR --> BE --> NG
  ZOD --> FE
  ZOD --> NG
```

Quy tắc: cùng key nested shape FE↔BE — [CONTRACT-FIELD-REGISTRY](./CONTRACT-FIELD-REGISTRY.md) · rule `portal-contract-naming`.

---

## E2E modes (prototype / test / wire)

```mermaid
flowchart LR
  PROTO["lifecycle: prototype\ntest"]
  WIRE["lifecycle: wire"]
  MOCK["MSW / mock service"]
  REAL["Nest :4000"]

  PROTO --> MOCK
  WIRE --> REAL
```

Spec `#wire-only` trong testcase → giữ mock hoặc skip đến khi lifecycle `wire` — [TEST-PHASE-DIAGRAM](./TEST-PHASE-DIAGRAM.md).

---

## Lệnh mẫu

```bash
# API running
pnpm dev:api

# Next (proxy or public API base)
pnpm dev

# Re-gen service unit tests after wire
pnpm portal:unit-gen --spec docs/features/yaml/.../ir/spec.yaml --phase wire --force

# E2E integrated
pnpm test:e2e tests/e2e/.../

# Promote lifecycle
pnpm portal:lifecycle set /hotels wire
```

---

## Gap loop

Sai contract hoặc endpoint → [UPDATE-SPEC-FLOW](./UPDATE-SPEC-FLOW.md) · `deferTo: wire` → [TECH-DEBT-FLOW](./TECH-DEBT-FLOW.md).

Portal-only delta → `/update-spec` · Backend delta → `/api-update-spec` → `/grill-api-spec`.

---

## Liên kết

| Doc | Nội dung |
|-----|----------|
| [BACKEND-PHASE-DIAGRAM](./BACKEND-PHASE-DIAGRAM.md) | API track trước wire |
| [NEST-UNIT-PHASE-DIAGRAM](./NEST-UNIT-PHASE-DIAGRAM.md) | Jest trước wire |
| [UNIT-PHASE-DIAGRAM](./UNIT-PHASE-DIAGRAM.md) | Vitest `--phase wire` |
| [TEST-PHASE-DIAGRAM](./TEST-PHASE-DIAGRAM.md) | E2E sau wire |
| [PAGE-LIFECYCLE](./PAGE-LIFECYCLE.md) | Stage `wire` + auth |
| [BACKEND-API-QUICKSTART](./BACKEND-API-QUICKSTART.md) | MySQL + `dev:api` |
