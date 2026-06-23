# Portal Base (Nuxt 4)

Portal hiện được tối giản theo hướng **auth-first**: giữ flow đăng nhập/đổi mật khẩu/quên mật khẩu/reset mật khẩu, và loại bỏ phần page nghiệp vụ cũ.

## Chạy dự án

### Chỉ Nuxt trên máy (không Docker)

```bash
pnpm install
pnpm dev
```

`nuxt.config`: `devServer` listen `0.0.0.0`; watch polling **tắt mặc định** trên WSL ext4 — bật `NUXT_WATCH_POLLING=1` khi Docker hoặc project trên `/mnt/c`.

**Cursor/WSL treo:** xem [`docs/WSL-CURSOR-PERF.md`](docs/WSL-CURSOR-PERF.md) — xóa `.pnpm-store` local (~884MB), mở folder `portal/` không mở `workspace/`.

### Docker (tách stack — nhiều project song song)

1. **Hạ tầng chung** (`docker/`): MySQL + gateway 80/443 — **tạo** network `base_shared_net` (bước này phải chạy trước `api/docker`).

   ```bash
   cp docker/.env.example docker/.env   # MYSQL_* + TLS; gateway: docker/routes.txt
   bash docker/gen-gateway-sites.sh docker/.env   # sinh docker/gateway/sites/*.conf (trước khi up gateway)
   docker compose up -d                  # từ repo root (include docker/docker-compose.yml)
   ```

2. **API** (`api/docker/`): PHP-FPM + nginx; dùng mạng `base_shared_net` đã có (external). Cấu hình DB trong `api/src/.env` (vd. `DB_HOST=base_mysql`).

   ```bash
   cd api/docker && docker compose --env-file .env up -d
   ```

   Trong `api/src/.env` (Laravel) đặt `DB_HOST=base_mysql` và `DB_*` khớp `docker/.env`.

3. **Portal** (`portal/docker/`): Nuxt dev trong container, join `base_shared_net`. Trong `portal/docker/.env` đặt **`PORTAL_STACK_PREFIX`** khớp `stack` trong `docker/routes.json`.

   ```bash
   cp portal/docker/.env.example portal/docker/.env
   docker compose --env-file portal/docker/.env -f portal/docker/docker-compose.yml up -d
   ```

Trong **`portal/docker/.env`** đặt **`HOST_UID`** / **`HOST_GID`** trùng `id -u` và `id -g` trên máy host (mặc định `1000`). **Volume `node_modules`** lúc tạo thường là `root:root`; entrypoint chạy **root** một nhịp để `chown` volume rồi **`setpriv`** xuống UID đó — `pnpm`/`nuxt` ghi bind mount (vd. **`.nuxt`**) vẫn đúng user host, không còn file kiểu `root:root`. Compose gọi **`corepack pnpm`** (không `corepack enable` + `pnpm`) vì user đó không được tạo symlink trong `/usr/local/bin`.

**`node_modules` tách biệt:** trong Docker, `node_modules` nằm trên **volume** có tên dạng `portal_<prefix>_nodemodules` (repo `portal_1`: `portal1_<prefix>_nodemodules`), không ghi đè thư mục `portal/node_modules` trên máy (với `portal_1` là `portal_1/node_modules`). Bạn có thể trên host: `rm -rf node_modules && pnpm install`, chạy `pnpm storybook` / script khác — không đụng bản cài trong container. Sau khi đổi dependency trong `package.json` / lockfile, chạy lại `pnpm install` **trong container** (restart stack hoặc `docker compose exec frontend-node …`) hoặc xóa volume rồi `up` lại: `docker compose … down -v` (chỉ khi muốn cài sạch volume).

Nếu trước đó đã có file root trong repo: `sudo chown -R "$(id -un):$(id -gn)" portal/.nuxt` (và thư mục tương tự).

Compose cần **`PORTAL_STACK_PREFIX`** trùng **TÊN** đầu dòng trong `docker/routes.txt` (vd `base` → container `base-portal-node` mà gateway gọi khi `PORTAL_PROXY_TARGET=container` trong `docker/.env`). **`BASE_SHARED_NETWORK_NAME`** trong `portal/docker/.env` khớp `docker/.env` (cùng mạng với gateway). **`NUXT_PUBLIC_API_BASE`** đặt trong **`portal/.env`**. Cổng trong **`docker/routes.txt`** (đoạn portal `…:PORT`) phải **trùng `PORTAL_DEV_PORT`**, rồi `bash docker/gen-gateway-sites.sh` + **restart gateway** — nếu không sẽ **502**.

Nhiều clone: thêm dòng `docker/routes.txt`; mỗi portal **một `PORTAL_DEV_PORT`** riêng trên host.

API client (`stores/useAuth.ts`, `$apiFetch`) dùng prefix **`/api/auth/*`** (login, me, logout, …). Cần map đúng trên API gateway / Laravel (trước đây có thể là `/api/admin/auth/*`).

---

## Storybook

Chạy UI catalog (theme preview, atoms/molecules). Script gọi `nuxt prepare` trước để alias Nuxt hoạt động; nếu thư mục **`stories/auto/`** (story sinh từ component) trống — thường sau clone vì thư mục đó **gitignored** — sẽ tự chạy `generate-stories.mjs` một lần rồi mới mở Storybook.

```bash
pnpm install
pnpm storybook
```

- Mặc định mở **http://127.0.0.1:6006** (xem `package.json` nếu đổi port).
- **Chỉ thấy vài story (vd. layout):** chạy tay `pnpm storybook:gen` (hoặc `pnpm storybook:gen:force` để ghi đè mọi file auto).
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

## Playwright (e2e)

**Quy ước selector:** mọi page/module phải gắn `data-testid` theo [docs/E2E-TESTIDS.md](docs/E2E-TESTIDS.md) **trước** khi viết spec. Prop Vue `testId` → HTML `data-testid`.

```bash
pnpm install
pnpm test:e2e              # Nuxt E2E port 3005 + Playwright headless
pnpm test:e2e:ui           # UI tương tác
pnpm test:e2e:report       # mở HTML report
```

**App đã chạy sẵn / remote:**

```bash
PLAYWRIGHT_SKIP_WEBSERVER=1 PLAYWRIGHT_BASE_URL=http://127.0.0.1:3004 pnpm exec playwright test
PLAYWRIGHT_SKIP_WEBSERVER=1 PLAYWRIGHT_BASE_URL=https://portal.example.com pnpm test:e2e:remote
```

E2E dùng build dir `.nuxt-e2e` + `NUXT_E2E_PORT` (mặc định `3005`) — tách khỏi `pnpm dev` / `NUXT_PORT`.

Trong spec: `page.getByTestId()`, sau `goto` gọi `assertLayoutIntegrity(page)` — xem [docs/E2E-TESTIDS.md](docs/E2E-TESTIDS.md).

### Bước 1 — Chuẩn hóa FE trước E2E

1. Gắn `testId` trên shared components; page truyền id theo module scope.
2. Bao phủ không chỉ form: alert, dialog/modal, toast, breadcrumb, menu, page title, label.
3. Không selector bằng `id` HTML / class CSS — xem bảng naming đầy đủ trong [docs/E2E-TESTIDS.md](docs/E2E-TESTIDS.md).

## Route hiện tại

- Public:
  - `/auth`
  - `/auth/login`
  - `/auth/register`
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

### Kiến trúc 4 tầng (Composables / Services / Stores / Models)

Xem chi tiết đối chiếu chuẩn vs hiện trạng: **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)**

Tóm tắt: 4 tầng `composables` → `services` → `stores` → `models/validations`; auth + data table đã theo chuẩn.

## Quy ước đặt tên mới

- Tránh đặt tên theo domain cũ theo nghiệp vụ legacy
- Ưu tiên tên trung tính:
  - `Data*` cho cụm list/table UI
  - `Common*` cho shared state/helper (ví dụ breadcrumb)

## Tình trạng legacy (cần dọn dần)

Một số theme demo cũ chưa được dùng trong flow auth tối giản:

- `layouts/themes/*`, `dataTheme/*`, `stories/*`, `components/organisms/layout/*`

Các mục này không chặn flow auth hiện tại, có thể clean-up theo đợt để giảm nhiễu codebase.

## Team AI workflow (4 phase)

Hướng dẫn harness + rules/skills local: [`docs/TEAM-AI-WORKFLOW.md`](docs/TEAM-AI-WORKFLOW.md)

Cài vendor (superpowers, karpathy, harness, matt pocock) — sync WSL + Windows:

```bash
bash scripts/install-ai-harness-vendor.sh
```

