# Storybook

Storybook giữ lại để review component shadcn/molecule/organism.

Các story theme layout vendor đã bị gỡ cùng với theme layout tương ứng. Generator hiện tại chỉ sinh story từ component còn tồn tại trong `components/`.

| Command | Mục đích |
| --- | --- |
| `pnpm storybook` | `nuxt prepare` → sinh `stories/auto` nếu trống → mở Storybook. |
| `pnpm storybook:build` | Build Storybook static. |
| `pnpm storybook:gen` | Sinh story auto nếu file chưa tồn tại. |
| `pnpm storybook:gen:force` | Ghi đè story auto. |
| `pnpm storybook:clean:gen` | Xóa `stories/auto`. |
