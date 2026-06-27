# Common UI Patterns

Source of truth cho pattern UI dùng chung: **`docs/features/common/*.spec.yaml`**.

**Design registry (shadcn canonical + shells):** `shared/portal-design.registry.json` — `#shell: DataListPage`, `#widget:`, `#ui:`. Validate: `pnpm portal:registry`. Agent: `.cursor/extracts/portal-design-registry.md`. **Promotion sau prototype:** [DESIGN-REGISTRY-PROMOTION.md](/operational/DESIGN-REGISTRY-PROMOTION).

Agent đọc thêm `.cursor/extracts/common-ui-spec.md`. Trước khi copy UI legacy ad hoc, bám common spec hoặc ghi `#legacy-global-ui-violation` kèm evidence.

## Review (BA/QA)

Sau `pnpm docs:render`, xem bản Markdown: [generated.md](/common-ui/generated).

| Pattern | YAML | Generated review |
|---------|------|------------------|
| List page shell | `common-list-page.spec.yaml` | [spec](/features/common/generated/common-list-page) |
| List toolbar | `common-list-toolbar.spec.yaml` | [spec](/features/common/generated/common-list-toolbar) |
| Search filter | `common-search-filter.spec.yaml` | [spec](/features/common/generated/common-search-filter) |
| Data table | `common-data-table.spec.yaml` | [spec](/features/common/generated/common-data-table) |
| Table actions | `common-table-action-column.spec.yaml` | [spec](/features/common/generated/common-table-action-column) |
| Pagination | `common-pagination.spec.yaml` | [spec](/features/common/generated/common-pagination) |
| Buttons | `common-buttons.spec.yaml` | [spec](/features/common/generated/common-buttons) |
| Status chip | `common-status-chip.spec.yaml` | [spec](/features/common/generated/common-status-chip) |
| Form validation | `common-form-validation.spec.yaml` | [spec](/features/common/generated/common-form-validation) |
| Feedback / alerts | `common-feedback.spec.yaml` | [spec](/features/common/generated/common-feedback) |
| Confirm dialog | `common-confirm-dialog.spec.yaml` | [spec](/features/common/generated/common-confirm-dialog) |
| CSV import | `common-import-csv.spec.yaml` | [spec](/features/common/generated/common-import-csv) |
| Navigation / header | `common-navigation.spec.yaml` | [spec](/features/common/generated/common-navigation) |
| Flat design | `common-flat-design.spec.yaml` | [spec](/features/common/generated/common-flat-design) |

## Code conventions

- List + search/filter + table: ưu tiên organism **`DataListPage`** (`components/organisms/DataListPage.vue`) trước khi dựng shell riêng.
- Dashboard table đơn giản: **`DataTablePage`** + `MoDataTable`.
- Chi tiết component split: `.cursor/rules/portal-component-split.mdc`.

## Trong spec / prototype

- `/spec` và `/prototype`: tham chiếu pattern common khi mô tả list, toolbar, pagination, feedback.
- Feature spec riêng (`docs/features/{slug}/spec.yaml`) extend common, không duplicate nguyên khối đã có trong common YAML.
