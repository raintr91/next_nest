# Monorepo — một `node_modules`, packages chỉ code

Mục tiêu: dev nhẹ, release khả thi, module/package **chỉ chứa source** — dependency hoist ở root.

---

## Hiện trạng portal

| Thành phần | Vấn đề dev |
|------------|------------|
| `node_modules/` | Bình thường với Nuxt 4 + Storybook + Playwright/Vitest |
| `.pnpm-store/` 884MB **trong repo** | **Bất thường** — đã fix `.npmrc` store global |
| `components/ui/` (shadcn) | Source trong app — OK cho product, có thể tách package sau |

**Release:** `pnpm build` → `.output/` — server không cần full devDependencies.

---

## Hướng A — pnpm workspace (khuyến nghị FE)

### Cấu trúc mục tiêu

```
~/workspace/                    # hoặc repo `platform`
├── package.json
├── pnpm-workspace.yaml
├── pnpm-lock.yaml
├── node_modules/               # ← duy nhất
├── apps/
│   └── portal/                 # Nuxt app hiện tại (di chuyển)
└── packages/
    ├── ui/                     # shadcn primitives đã customize
    ├── models/                 # Zod schemas dùng chung
    ├── eslint-config-portal/
    └── tsconfig/
```

### `pnpm-workspace.yaml`

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

### `packages/models/package.json` (chỉ code)

```json
{
  "name": "@platform/models",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "exports": {
    "./*": "./src/*.ts"
  },
  "dependencies": {
    "zod": "^3.25.0"
  }
}
```

### `apps/portal/package.json`

```json
{
  "name": "portal",
  "dependencies": {
    "@platform/models": "workspace:*",
    "@platform/ui": "workspace:*",
    "nuxt": "^4.3.0"
  }
}
```

Chạy từ root:

```bash
pnpm install          # một lần — một node_modules
pnpm --filter portal dev
pnpm --filter portal build
```

### Lợi ích

- Một install, một lockfile
- Package mới = thư mục + `package.json` nhỏ, **không** copy `node_modules`
- CI: cache root `node_modules` / pnpm store
- Docker: mount workspace root, `pnpm --filter portal dev`

### Migration từng bước (không big-bang)

1. Tạo root `pnpm-workspace.yaml`, move `portal` → `apps/portal`
2. `pnpm install` tại root — xóa `apps/portal/node_modules` cũ
3. Tách `models/` → `packages/models` (import `@platform/models`)
4. (Sau) tách `components/ui` → `packages/ui` nếu nhiều app dùng chung

---

## Hướng B — Laravel API (đã đúng hướng)

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

## Production Docker (multi-stage) — portal

```dockerfile
# stage 1: build
FROM node:24 AS build
WORKDIR /app
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/portal apps/portal
COPY packages packages
RUN corepack pnpm install --frozen-lockfile
RUN pnpm --filter portal build

# stage 2: run
FROM node:24-alpine
WORKDIR /app
COPY --from=build /app/apps/portal/.output .output
ENV HOST=0.0.0.0 PORT=3000
CMD ["node", ".output/server/index.mjs"]
```

Image cuối **không** chứa Storybook, Playwright, Vitest, `.pnpm-store`.

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
| Release product khả thi? | **Có** — build artifact nhỏ, harness dev tách riêng |
| 1 node_modules FE? | **pnpm workspace** tại `workspace/` root |
| API modules chỉ code? | **Đã có** — giữ `vendor/` một chỗ, `Modules/*` thin |
| Dev nhẹ hơn ngay? | `up-gateway` + `up-mysql` + xóa `.pnpm-store` + một nơi chạy `pnpm dev` |

Migration workspace — làm PR riêng khi team sẵn sàng; không block release hiện tại.
