# Chain tải báo cáo 開封率データ

Tính năng: Chain — tải báo cáo 開封率データ

## Mã yêu cầu

- REQ-CHAIN-HOTEL-EXPORT-001
- REQ-CHAIN-HOTEL-EXPORT-002

## Route

- Path: `/hotels`
- Auth: `chain`

## Test ID

- chain-hotels-page
- chain-hotels-export-month-input
- chain-hotels-export-report-btn

## Thiết lập

```yaml
session: mockChainAuthenticatedSession
mocks:
  - method: POST
    path: /api/hotels/export-report
    response: chainHotelExportReportSuccess
```

## Dữ liệu

```yaml
month: "{{last_month_yyyy_mm}}"
```

## Kịch bản mock

`#`

## Các bước

1. action: goto, path: /hotels
2. action: waitFor, testId: chain-hotels-table
3. action: waitFor, role: row, name: /Manager A/
4. action: fill, testId: chain-hotels-export-month-input, value: {{last_month_yyyy_mm}}
5. action: click, testId: chain-hotels-export-report-btn

## Assertion

```yaml
network:
  - method: POST
    path: /api/hotels/export-report
    bodyContains:
      month: "{{last_month_yyyy_mm}}"
```

## Kết quả mong đợi

- Response file download xlsx; filename chứa 開封率月次報告.
