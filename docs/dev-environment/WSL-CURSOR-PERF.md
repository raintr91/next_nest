# WSL / Cursor — tránh treo khi mở project

## Nguyên nhân thường gặp (đã audit)

| Vấn đề | Quy mô | Fix |
|--------|--------|-----|
| `.pnpm-store/` trong repo | ~61k files, ~884MB | Xóa + `.npmrc` store global |
| `node_modules/` không ignore Cursor | ~54k files | `.cursorignore` |
| `usePolling` khi mount chậm | CPU cao trên WSL ext4 | Tắt mặc định; Docker bind mount: `CHOKIDAR_USEPOLLING=1` |
| Mở folder `~/workspace` (cha) | index cả mairy-*, saas-* | Chỉ mở `portal/` |

## Một lần — dọn store local

```bash
cd ~/workspace/portal
rm -rf .pnpm-store    # ~884MB, an toàn nếu đã có node_modules
```

`.npmrc` đã trỏ `store-dir=~/.local/share/pnpm/store` — lần `pnpm install` sau không tạo lại store trong repo.

## Mở Cursor

1. **File → Open Folder** → `~/workspace/portal` (không mở `~/workspace`)
2. Sau khi sửa `.cursorignore`: **Reload Window** (Ctrl+Shift+P → "Developer: Reload Window")
3. Nếu vẫn chậm: tắt extension nặng (Storybook, duplicate ESLint)

## Dev server

```bash
# WSL bình thường (inotify — nhẹ)
pnpm dev

# Docker / code trên /mnt/c
CHOKIDAR_USEPOLLING=1 pnpm dev
```

## Cursor settings (đã thêm `.vscode/settings.json`)

- `files.watcherExclude` — node_modules, .pnpm-store, `.next`, …
- `cursor.general.enableShadowWorkspace: false` — giảm RAM agent

## AI context (token, không phải crash)

- Rules `alwaysApply`: `portal-invariants` + `portal-contract-naming` (~35 dòng)
- Skill lớn (`portal-base`): opt-in — gõ `@portal-base` khi cần
