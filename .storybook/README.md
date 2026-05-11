# Storybook scripts & manual stories

## Stories viết tay (không bị xóa)

- **Vị trí:** `stories/*.stories.ts` (file trực tiếp trong `stories/`, không nằm trong `stories/auto/`).
- **Ví dụ:** `DashboardThemePreviews.stories.ts`, `DashboardThemes.stories.ts`, theme Windster, v.v.

Các lệnh sau **không** xóa hay ghi đè stories viết tay:

| Lệnh | Mô tả |
|------|--------|
| `pnpm storybook:clean` | Chỉ xóa cache Storybook (`node_modules/.cache/storybook`). **Không** xóa file stories. |
| `pnpm storybook:fresh` | Clean cache rồi chạy Storybook. Stories viết tay giữ nguyên. |
| `pnpm storybook:gen` | Tạo stories auto vào `stories/auto/`; không ghi đè `stories/*.stories.ts`. |
| `pnpm storybook:clean:gen` | Chỉ xóa thư mục `stories/auto/` (stories auto-generate). **Giữ nguyên** `stories/*.stories.ts`. |

## Stories auto-generate

- **Vị trí:** `stories/auto/*.stories.js` (tạo bởi `pnpm storybook:gen`).
- Xóa riêng phần này: `pnpm storybook:clean:gen`.

## Config trong package.json

```json
"storybook": {
  "generatedDir": "stories/auto",
  "manualStoriesGlob": "stories/*.stories.ts",
  "preserveManual": true
}
```

Scripts và tooling chỉ xóa/ghi đè trong `generatedDir`; không xóa file khớp `manualStoriesGlob`.
