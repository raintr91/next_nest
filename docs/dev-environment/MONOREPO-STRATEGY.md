# Monorepo — một `node_modules`, packages chỉ code

Mục tiêu: dev nhẹ, release khả thi, module/package **chỉ chứa source** — dependency hoist ở root.

---

## Hiện trạng portal (2026)

| Thành phần | Vị trí |
|------------|--------|
| Next.js 15 FE | `apps/web` (`@portal/web`) |
| Nest API | `apps/api` (`@portal/api`) |
| Zod contracts | `packages/models` (`@portal/models`) |
| `pnpm-workspace` | `.`, `packages/*`, `apps/*` |

**Local Docker:** `docker/docker-compose.yml` — `frontend-node` + `api-node`  
**Prod:** Nest image từ `docker/api/Dockerfile` · Next build (`apps/web`) → Node standalone hoặc static host (member chọn)

---

## Hướng A — pnpm workspace (đang áp dụng)

### Cấu trúc

```
portal/
├── package.json              # orchestration scripts
├── pnpm-workspace.yaml
├── apps/web/                 # Next.js — app/, hooks/, services/, components/
├── apps/api/                 # NestJS + CQRS
├── packages/models/          # @portal/models — contract:gen
└── docker/
```

Chạy từ root:

```bash
pnpm install
pnpm dev                      # Next @ apps/web
pnpm dev:api                  # Nest :4000
pnpm --filter @portal/web build
pnpm --filter @portal/api build
```

Codegen & phase diagrams: [BACKEND-CODEGEN](../operational/BACKEND-CODEGEN.md) · [BACKEND-PHASE-DIAGRAM](../operational/BACKEND-PHASE-DIAGRAM.md) · [ARCHITECTURE](../operational/ARCHITECTURE.md).

### Migration tiếp theo (optional)

1. ~~Tách `models/` → `packages/models`~~ — done (`@portal/models`)
2. ~~Move FE → `apps/web`~~ — done
3. Tách shared UI package chỉ khi có app FE thứ hai

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

---

## Production Docker

| App | Image |
|-----|--------|
| Nest API | `docker/api/Dockerfile` multi-stage |
| Next FE | CI build `apps/web` → Node image hoặc static host |

```dockerfile
# docker/api/Dockerfile — chỉ api + models
COPY packages/models packages/models
COPY apps/api apps/api
RUN pnpm --filter @portal/api build
```

---

## Không nên

| Anti-pattern | Lý do |
|--------------|-------|
| Mỗi module copy full `package.json` + `pnpm install` | N× node_modules |
| `.pnpm-store` trong từng app | 60k+ files × N |
| Dev host + dev Docker cùng app | 2× RAM + watcher |

---

## Quyết định nhanh

| Câu hỏi | Trả lời |
|---------|---------|
| Next FE ở đâu? | `apps/web` (`@portal/web`) |
| Nest API? | `apps/api` — prod Docker riêng |
| Zod SSOT? | `packages/models` — `contract:gen` |
| Prod FE? | Next build artifact — runtime do member chọn |
