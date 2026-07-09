# Monorepo — một `node_modules`, packages chỉ code

Mục tiêu: dev nhẹ, release khả thi, module/package **chỉ chứa source** — dependency hoist ở root.

---

## Hiện trạng portal (2026)

| Thành phần | Vị trí |
|------------|--------|
| Nuxt 4 | **Root** repo (chưa move `apps/portal`) |
| Nest API | `apps/api` (`@portal/api`) |
| Zod contracts | `packages/models` (`@portal/models`) |
| `pnpm-workspace` | `.`, `packages/*`, `apps/*` |

**Local Docker:** `docker/docker-compose.yml` — `frontend-node` + `api-node`  
**Prod:** Nest image từ `docker/api/Dockerfile` · Nuxt build static → S3/CloudFront (member chọn SPA/SSG)

---

## Hướng A — pnpm workspace (đang áp dụng)

### Cấu trúc

```
portal/
├── package.json              # Nuxt + orchestration scripts
├── pnpm-workspace.yaml
├── pages/, services/, …      # Nuxt at root
├── apps/api/                 # NestJS + CQRS
├── packages/models/          # @portal/models — contract:gen
└── docker/
```

Chạy từ root:

```bash
pnpm install
pnpm dev                      # Nuxt
pnpm dev:api                  # Nest :4000
pnpm --filter @portal/api build
```

Codegen & phase diagrams: [BACKEND-CODEGEN](../operational/BACKEND-CODEGEN.md) · [BACKEND-PHASE-DIAGRAM](../operational/BACKEND-PHASE-DIAGRAM.md) · [ARCHITECTURE](../operational/ARCHITECTURE.md).

### Migration tiếp theo (optional)

1. ~~Tách `models/` → `packages/models`~~ — bắt đầu; root `models/` giữ tạm cho app cũ
2. Move Nuxt → `apps/portal` khi cần Docker/CI tách hẳn
3. Tách `components/ui` → `packages/ui` nếu nhiều app

---

## Hướng B — Laravel API (legacy reference)

```
api/
  src/
    vendor/              # ← duy nhất (Composer)
    Modules/
      Hotel/             # chỉ PHP — không vendor riêng
```

Module = code + `composer.json` optional (path repo). **Không** nhân `vendor/` per module.

Multi-tenant products (saas-admin, saas-store): có thể **cùng một** `api/src` + module, khác `.env` / `API_STACK_PREFIX` — không cần clone cả api.

---

## Hướng C — Turborepo (khi nhiều app FE)

Nếu sau này có `portal`, `admin-chain`, `admin-store`:

```json
// turbo.json
{
  "tasks": {
    "build": { "dependsOn": ["^build"] },
    "dev": { "cache": false, "persistent": true }
  }
}
```

```bash
turbo dev --filter=portal
```

Vẫn **một** `node_modules` ở root (pnpm + turbo).

---

## Production Docker

| App | Image |
|-----|--------|
| Nest API | `docker/api/Dockerfile` multi-stage |
| Nuxt | CI build artifact → S3 (không runtime Docker) |

```dockerfile
# docker/api/Dockerfile — chỉ api + models
COPY packages/models packages/models
COPY apps/api apps/api
RUN pnpm --filter @portal/api build
```

---

## Hướng C — Turborepo (khi nhiều app FE)

Nếu sau này có nhiều app FE — thêm `turbo.json` trên workspace hiện tại.

---

## Không nên

| Anti-pattern | Lý do |
|--------------|-------|
| Mỗi module copy full `package.json` + `pnpm install` | N× node_modules |
| `.pnpm-store` trong từng app | 60k+ files × N |
| Dev host + dev Docker cùng app | 2× RAM + watcher |
| `make up-all` khi chỉ làm portal base | LocalStack + 2 MySQL không cần thiết |

---

## Quyết định nhanh

| Câu hỏi | Trả lời |
|---------|---------|
| Nuxt ở đâu? | **Root** (tạm) — `apps/portal` sau |
| Nest API? | `apps/api` — prod Docker riêng |
| Zod SSOT? | `packages/models` — `contract:gen` |
| Prod Nuxt? | S3 + CloudFront — SPA/SSG do member chọn |
