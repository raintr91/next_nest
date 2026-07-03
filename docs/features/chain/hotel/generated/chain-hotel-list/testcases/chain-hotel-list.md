# Chain xem danh sách hotel

Tính năng: Chain — danh sách hotel (施設一覧)

## Mã yêu cầu

- REQ-CHAIN-HOTEL-LIST-001
- REQ-CHAIN-HOTEL-LIST-002
- REQ-CHAIN-HOTEL-LIST-003

## Route

- Path: `/hotels`
- Auth: `chain`

## Test ID

- chain-hotels-page
- chain-hotels-search-form
- chain-hotels-table
- chain-hotels-toolbar
- chain-hotels-pagination
- chain-hotels-total-btn
- chain-hotels-per-page-select
- chain-hotels-export-month-input
- chain-hotels-export-report-btn
- chain-hotels-cell-managers

## Thiết lập

```yaml
session: mockChainAuthenticatedSession
mocks: []
```

## Dữ liệu

```yaml
{}
```

## Kịch bản mock

`#`

## Các bước

1. action: goto, path: /hotels
2. action: waitFor, testId: chain-hotels-table

## Assertion

```yaml
ui:
  - testId: chain-hotels-total-btn
    visible: true
  - testId: chain-hotels-per-page-select
    visible: true
  - testId: chain-hotels-export-month-input
    visible: true
  - testId: chain-hotels-search-form
    visible: false
semantic:
  ready:
    rootTestId: chain-hotels-page
    waitForTestIds:
      - chain-hotels-table
```

## Kết quả mong đợi

- Bảng 3 cột ID, name, managers; không có search form.
- Không có nút create/bulk delete admin.
- Toolbar phải có 表示件数 + select mặc định 100 + 件 bên phải trên table.
