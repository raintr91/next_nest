# Kiến trúc — Portal monorepo (Next.js 15 + Nest API)

Tài liệu mô tả:

1. **Monorepo** — `apps/web` (Next.js) + `apps/api` + `packages/models`
2. **FE 4 tầng** — Hooks → Services → Stores → Models/Schema
3. **BE CQRS** — Controller → Handlers → Resource → TypeORM

> **Kết luận nhanh:** FE trong `apps/web/src` với **4 tầng đầy đủ**. Contracts Zod nằm `@portal/models` (`packages/models`). Nest API in-repo `apps/api` — codegen [BACKEND-CODEGEN](./BACKEND-CODEGEN.md).

---

## 0. Monorepo (2026)

```mermaid
flowchart TB
  subgraph Root["portal/ (pnpm workspace)"]
    subgraph FE["apps/web — Next.js 15"]
      APP["app/(dashboard)/"]
      HOOKS[hooks/]
      SV[services/]
      VA[validations/]
      CMP[components/]
    end

    subgraph PKG["packages/models"]
      ZOD["Zod SSOT\ncontract:gen"]
    end

    subgraph API["apps/api — Nest"]
      CTL[modules/*/controller]
      CQRS[CommandBus / QueryBus]
      COM[common/crud]
      DB[(MySQL TypeORM)]
    end
  end

  APP --> HOOKS
  HOOKS --> SV
  SV --> ZOD
  CTL --> CQRS --> COM --> DB
  CQRS --> ZOD
```

| Thành phần | Path | Doc |
|------------|------|-----|
| Next app | `apps/web/src` (`app/`, `hooks/`, `services/`, …) | Phần 1–5 bên dưới |
| Shared contracts | `packages/models` (`@portal/models`) | [CONTRACT-FIELD-REGISTRY](./CONTRACT-FIELD-REGISTRY.md) |
| Nest API | `apps/api` (`@portal/api`) | [NEST-API-STRUCTURE](./NEST-API-STRUCTURE.md) · [BACKEND-API-QUICKSTART](./BACKEND-API-QUICKSTART.md) |
| Codegen FE | `portal:gen` → `apps/web/src` | [PORTAL-CODEGEN](./PORTAL-CODEGEN.md) |
| Codegen BE | `contract:gen` · `nest:gen` | [BACKEND-CODEGEN](./BACKEND-CODEGEN.md) |
| Wire FE↔BE | `/wire` | [WIRE-PHASE-DIAGRAM](./WIRE-PHASE-DIAGRAM.md) |

Chi tiết workspace: [MONOREPO-STRATEGY](../dev-environment/MONOREPO-STRATEGY.md).

**Import FE:** `@/` → `apps/web/src` · models → `@portal/models`.

---

## 1. Chuẩn mục tiêu FE (4 tầng)

```mermaid
flowchart TB
  subgraph UI["UI Layer"]
    P["app/(dashboard)/"]
    C[components/]
  end

  subgraph L1["① Hooks"]
    HO[useXxxForm / useXxxList / useAuth]
  end

  subgraph L2["② Services"]
    SV[authService / entityService]
  end

  subgraph L3["③ Stores (Zustand)"]
    ST[useToastStore / useDialogStore]
  end

  subgraph L4["④ Models & Schema"]
    MO["@portal/models — Zod contract"]
    VA[validations/ — form rules]
  end

  subgraph Infra["Hạ tầng"]
    API_CLIENT[lib/api-client.ts]
    MW[middleware.ts]
  end

  P --> HO
  C --> HO
  HO --> ST
  HO --> SV
  SV --> API_CLIENT
  ST --> SV
  SV --> MO
  HO --> VA
  VA --> MO
  MW --> P
```

### Vai trò từng tầng

| Tầng | Thư mục | Trách nhiệm | Không làm |
|------|---------|-------------|-----------|
| **Hooks** | `apps/web/src/hooks/` | Orchestration UI: form, list state, auth | Gọi `apiFetch` trực tiếp |
| **Services** | `apps/web/src/services/` | HTTP: endpoint, parse response | Giữ Zustand state |
| **Stores** | `apps/web/src/stores/` | Toast, dialog, ephemeral UI state | Logic HTTP chi tiết |
| **Models** | `@portal/models` + `validations/` | API contract + form rules | Render UI |

### Quy tắc import

```
app/ + components/
  → hooks/
      → stores
      → services → @portal/models → apiFetch
  → validations/
```

**Cấm ngược chiều:** `@portal/models` không import stores/services/hooks.

---

## 2. Hiện trạng `apps/web`

```
apps/web/src/
├── app/(auth)/login/
├── app/(dashboard)/
├── hooks/                     # useAuth, useDataTable, portal:gen hooks
├── services/                  # auth.service, *.service
├── stores/                    # toast, dialog
├── validations/
├── components/ui|molecules|organisms/
├── lib/api-client.ts
└── middleware.ts              # cookie auth_token
```

**Auth:** `/login/` public · dashboard protected · `createAuthService()` + `parseSchemaOrThrow`.

---

## 3. Luồng mẫu: Login

```tsx
// LoginCard → useAuth().login()
// → createAuthService().login()
// → apiFetch('/auth/login')
// → parseSchemaOrThrow(LoginResponseSchema, res.data)
```

---

## 4. Thêm feature (codegen)

```bash
pnpm contract:gen --spec …/ir/spec.yaml
pnpm portal:gen --spec …/ir/spec.yaml
```

Output: `app/(dashboard)/{route}/page.tsx`, `hooks/`, `services/`, `mocks/`.

---

## 5. Lệnh & tài liệu

```bash
pnpm dev
pnpm --filter @portal/web build
pnpm test:unit
pnpm ui:add button
```

- [PORTAL-CODEGEN](./PORTAL-CODEGEN.md) · [E2E-TESTIDS](./E2E-TESTIDS.md) · [MONOREPO-STRATEGY](../dev-environment/MONOREPO-STRATEGY.md)
