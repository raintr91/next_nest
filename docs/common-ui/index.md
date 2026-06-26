# Common UI Patterns

Source of truth cho pattern UI dùng chung: **`docs/features/common/*.spec.yaml`**.

Agent đọc thêm `.cursor/extracts/common-ui-spec.md`. Trước khi copy UI legacy ad hoc, bám common spec hoặc ghi `#legacy-global-ui-violation` kèm evidence.

## Review (BA/QA)

Sau `pnpm docs:render`, xem bản Markdown: [generated.md](./generated.md).

| Pattern | YAML | Generated review |
|---------|------|------------------|
| List page shell | `common-list-page.spec.yaml` | [README](../features/common/generated/common-list-page.README.md) |
| List toolbar | `common-list-toolbar.spec.yaml` | [README](../features/common/generated/common-list-toolbar.README.md) |
| Search filter | `common-search-filter.spec.yaml` | [README](../features/common/generated/common-search-filter.README.md) |
| Data table | `common-data-table.spec.yaml` | [README](../features/common/generated/common-data-table.README.md) |
| Table actions | `common-table-action-column.spec.yaml` | [README](../features/common/generated/common-table-action-column.README.md) |
| Pagination | `common-pagination.spec.yaml` | [README](../features/common/generated/common-pagination.README.md) |
| Buttons | `common-buttons.spec.yaml` | [README](../features/common/generated/common-buttons.README.md) |
| Status chip | `common-status-chip.spec.yaml` | [README](../features/common/generated/common-status-chip.README.md) |
| Form validation | `common-form-validation.spec.yaml` | [README](../features/common/generated/common-form-validation.README.md) |
| Feedback / alerts | `common-feedback.spec.yaml` | [README](../features/common/generated/common-feedback.README.md) |
| Confirm dialog | `common-confirm-dialog.spec.yaml` | [README](../features/common/generated/common-confirm-dialog.README.md) |
| CSV import | `common-import-csv.spec.yaml` | [README](../features/common/generated/common-import-csv.README.md) |
| Navigation / header | `common-navigation.spec.yaml` | [README](../features/common/generated/common-navigation.README.md) |
| Flat design | `common-flat-design.spec.yaml` | [README](../features/common/generated/common-flat-design.README.md) |

## Code conventions

- List + search/filter + table: ưu tiên organism **`DataListPage`** (`components/organisms/DataListPage.vue`) trước khi dựng shell riêng.
- Dashboard table đơn giản: **`DataTablePage`** + `MoDataTable`.
- Chi tiết component split: `.cursor/rules/portal-component-split.mdc`.

## Trong spec / prototype

- `/spec` và `/prototype`: tham chiếu pattern common khi mô tả list, toolbar, pagination, feedback.
- Feature spec riêng (`docs/features/{slug}/spec.yaml`) extend common, không duplicate nguyên khối đã có trong common YAML.
