# Portal Base (Nuxt 4)

Portal hiện được tối giản theo hướng **auth-first**: giữ flow đăng nhập/đổi mật khẩu/quên mật khẩu/reset mật khẩu, và loại bỏ phần page nghiệp vụ cũ.

## Chạy dự án

### Chỉ Nuxt trên máy (không Docker)

```bash
pnpm install
pnpm dev
```

`nuxt.config`: `devServer` listen `0.0.0.0`; `vite.server.watch` bật polling (Docker/WSL). Gateway nginx gửi `Host` khi proxy tới cổng publish trên host.

### Docker (tách stack — nhiều project song song)

1. **Hạ tầng chung** (`docker/`): MySQL + gateway 80/443 — **tạo** network `base_shared_net` (bước này phải chạy trước `api/local`).

   ```bash
   cp docker/.env.example docker/.env   # MYSQL_* + TLS; gateway: docker/routes.txt
   bash docker/gen-gateway-sites.sh docker/.env   # sinh docker/gateway/sites/*.conf (trước khi up gateway)
   docker compose up -d                  # từ repo root (include docker/docker-compose.yml)
   ```

2. **API** (`api/local/`): PHP-FPM + nginx; dùng mạng `base_shared_net` đã có (external). Cấu hình DB trong `api/src/.env` (vd. `DB_HOST=base_mysql`).

   ```bash
   cd api/local && docker compose up -d
   ```

   Trong `api/src/.env` (Laravel) đặt `DB_HOST=base_mysql` và `DB_*` khớp `docker/.env`.

3. **Portal** (`portal/docker/`): Nuxt dev publish `PORTAL_DEV_PORT` → host. Trong `portal/docker/.env` đặt **`PORTAL_STACK_PREFIX`** cùng kiểu với **`API_STACK_PREFIX`** của clone đó (vd `base`, `p1`) để project Compose `portal-<prefix>` và container `<prefix>-portal-node` không đụng nhau.

   ```bash
   cp portal/docker/.env.example portal/docker/.env
   docker compose --env-file portal/docker/.env -f portal/docker/docker-compose.yml up -d
   ```

Compose **chỉ** cần `PORTAL_STACK_PREFIX` + `PORTAL_DEV_PORT` (cùng giá trị cho publish host và `NUXT_PORT` trong container). **`NUXT_PUBLIC_API_BASE`** đặt trong **`portal/.env`**. Cổng trong **`docker/routes.txt`** (đoạn portal `…:PORT`) phải **trùng `PORTAL_DEV_PORT`**, rồi `bash docker/gen-gateway-sites.sh` + restart gateway — nếu không sẽ **502** (nginx gọi nhầm cổng trên host).

Nhiều clone: thêm dòng `docker/routes.txt`; mỗi portal **một `PORTAL_DEV_PORT`** riêng trên host.

API client (`stores/useAuth.ts`, `$apiFetch`) dùng prefix **`/api/auth/*`** (login, me, logout, …). Cần map đúng trên API gateway / Laravel (trước đây có thể là `/api/admin/auth/*`).

---

## Storybook

Chạy UI catalog (theme preview, atoms/molecules). Script gọi `nuxt prepare` trước để alias Nuxt hoạt động.

```bash
pnpm install
pnpm storybook
```

- Mặc định mở **http://127.0.0.1:6006** (xem `package.json` nếu đổi port).
- **Build tĩnh** (CI / kiểm tra build): `pnpm storybook:build`
- **Cache lỗi / story cũ**: `pnpm storybook:fresh` (xóa cache rồi chạy lại dev server).
- **Sinh story tự động** (tùy dự án): `pnpm storybook:gen` hoặc `pnpm storybook:gen:force` — chi tiết trong `scripts/generate-stories.mjs`.

---

## Vitest (unit test)

```bash
pnpm install
# Một lần chạy hết (CI)
pnpm test:unit

# Watch khi dev
pnpm test:unit:watch

# UI Vitest
pnpm test:unit:ui

# Có coverage (V8)
pnpm test:unit:coverage
```

---

## Cypress (e2e)

**Cách khuyến nghị** — tự bật Nuxt dev trên port **3005** rồi chạy Cypress (dùng `start-server-and-test`):

```bash
pnpm install
pnpm test:e2e
```

**Chạy Cypress khi app đã chạy sẵn** (ví dụ `pnpm dev` ở port khác):

```bash
export CYPRESS_BASE_URL=http://127.0.0.1:3004
pnpm cypress:run
# hoặc mở UI tương tác
pnpm cypress:open
```

**Chỉ định host từ xa** (portal đã deploy, không dùng dev server local):

```bash
CYPRESS_BASE_URL=https://portal.example.com pnpm test:e2e:remote
```

Mặc định `test:e2e:remote` dùng `http://portal.base.com` nếu không set biến môi trường.

## Route hiện tại

- Public:
  - `/auth`
  - `/auth/login`
  - `/password/reset`
  - `/password/reset/:token`
  - `/404`
  - `/forbidden`
- Protected:
  - `/` (yêu cầu đăng nhập)

## Middleware

- `middleware/auth.global.ts`: guard toàn cục, chặn route protected khi chưa login
- `middleware/auth.ts`: guard auth cục bộ (dùng khi cần explicit middleware ở page)
- `middleware/guest.ts`: chặn người đã login vào trang guest
- `middleware/rbac.ts`: giữ lại cho phân quyền mở rộng sau này

## Cấu trúc chính

- `pages/`: chỉ giữ auth/reset + trang hệ thống (`/`, `404`, `forbidden`)
- `composables/auth/`: logic form/auth flow
- `useAuth` state module: trạng thái user/token
- `plugins/fetch.ts` + `utils/fetchUtils.ts`: API client + attach token + normalize lỗi
- `components/organisms/data/`: bộ component bảng/list dùng chung
- `composables/useCommonBreadcrumbs.ts`: state breadcrumb dùng chung

## Quy ước đặt tên mới

- Tránh đặt tên theo domain cũ theo nghiệp vụ legacy
- Ưu tiên tên trung tính:
  - `Data*` cho cụm list/table UI
  - `Common*` cho shared state/helper (ví dụ breadcrumb)

## Tình trạng legacy (cần dọn dần)

Một số theme demo cũ chưa được dùng trong flow auth tối giản:

- `layouts/themes/*`, `dataTheme/*`, `stories/*`, `components/organisms/layout/*`

Các mục này không chặn flow auth hiện tại, có thể clean-up theo đợt để giảm nhiễu codebase.

