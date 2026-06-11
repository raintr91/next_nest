import type { Meta, StoryObj } from '@storybook/vue3'

const meta: Meta = {
  title: 'Documentation/Introduction',
  parameters: {
    docs: {
      description: {
        component: `
# Component Library — Documentation

Chào team. Đây là **Storybook** dùng để xem và test toàn bộ UI components của dự án.

## Cấu trúc (Atomic Design)

| Cấp | Thư mục | Prefix | Mô tả |
|-----|---------|--------|--------|
| **Atoms** | \`components/atoms\` | \`Ui\` | Thành phần cơ bản (Button, Input, Card, Dialog, …). |
| **Molecules** | \`components/molecules\` | \`Molecule\` | Kết hợp nhiều atoms. |
| **Organisms** | \`components/organisms\` | \`Organism\` | Khối lớn (header, sidebar). |

## Scripts

- \`pnpm run storybook\` — Chạy Storybook (port 6006)
- \`pnpm run storybook:gen\` — Tạo stories từ ui/molecules/organisms
        `.trim()
      }
    }
  }
}

export default meta

type Story = StoryObj

export const ReadMe: Story = {
  render: () => ({
    template: `
      <div class="sb-doc-padding">
        <h1>Component Library — Documentation</h1>
        <p>Chào team. Đây là <strong>Storybook</strong> dùng để xem và test toàn bộ UI components của dự án.</p>
        <h2>Cấu trúc (Atomic Design)</h2>
        <table style="border-collapse: collapse; margin: 1em 0;">
          <thead><tr style="background: #f0f0f0;"><th style="padding: 8px; border: 1px solid #ddd;">Cấp</th><th style="padding: 8px; border: 1px solid #ddd;">Thư mục</th><th style="padding: 8px; border: 1px solid #ddd;">Prefix</th><th style="padding: 8px; border: 1px solid #ddd;">Mô tả</th></tr></thead>
          <tbody>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Atoms</strong></td><td style="padding: 8px; border: 1px solid #ddd;"><code>components/atoms</code></td><td style="padding: 8px; border: 1px solid #ddd;"><code>Ui</code></td><td style="padding: 8px; border: 1px solid #ddd;">Button, Input, Card, Dialog, …</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Molecules</strong></td><td style="padding: 8px; border: 1px solid #ddd;"><code>components/molecules</code></td><td style="padding: 8px; border: 1px solid #ddd;"><code>Molecule</code></td><td style="padding: 8px; border: 1px solid #ddd;">Kết hợp nhiều atoms.</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Organisms</strong></td><td style="padding: 8px; border: 1px solid #ddd;"><code>components/organisms</code></td><td style="padding: 8px; border: 1px solid #ddd;"><code>Organism</code></td><td style="padding: 8px; border: 1px solid #ddd;">Header, sidebar, form section.</td></tr>
          </tbody>
        </table>
        <h2>Scripts</h2>
        <ul>
          <li><code>pnpm run storybook</code> — Chạy Storybook (port 6006)</li>
          <li><code>pnpm run storybook:gen</code> — Tạo stories từ ui/molecules/organisms</li>
        </ul>
      </div>
    `
  })
}
