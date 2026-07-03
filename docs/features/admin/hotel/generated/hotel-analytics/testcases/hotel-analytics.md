# Admin xem hotel analytics

Tính năng: Analytics toàn bộ hotel

## Mã yêu cầu

- REQ-HOTEL-ANALYTICS-001

## Route

- Path: `/hotels/analytics`
- Auth: `required`

## Test ID

- admin-hotel-analytics-page
- admin-hotel-analytics-start-input
- admin-hotel-analytics-end-input
- admin-hotel-analytics-search-btn
- admin-hotel-analytics-clear-btn
- admin-hotel-analytics-pdf-btn
- admin-hotel-analytics-csv-btn
- admin-hotel-analytics-report-table

## Thiết lập

```yaml
session: mockAdminSession
```

## Dữ liệu

```yaml
start: 2026-06-01
end: 2026-06-30
```

## Kịch bản mock

- **analytics-data** — Có dữ liệu: Metrics và rate hiển thị.
- **analytics-empty** — Không có dữ liệu: UI hiển thị `－` cho metric thiếu.

## Các bước

1. action: goto, path: /hotels/analytics
2. action: fill, testId: admin-hotel-analytics-start-input, valueFrom: data.start
3. action: fill, testId: admin-hotel-analytics-end-input, valueFrom: data.end
4. action: click, testId: admin-hotel-analytics-search-btn
5. action: assert-layout, target: filter, expected: date range centered, search/clear centered below period input
6. action: assert-layout, target: report, expected: title left, PDF/CSV primary buttons right, overview table 8 columns and 3 rows

## Assertion

```yaml
ui:
  - testId: admin-hotel-analytics-page
    contains: MAIRY survey report
  - testId: admin-hotel-analytics-report-table
    contains: 宿泊前
```

## Kết quả mong đợi

- API trả các metric before/after/survey/company survey.
- UI render legacy survey-table-overview, không render metric card grid.
- CSV/PDF download được kiểm ở spec child `hotel-analytics-export` và `hotel-analytics-download-pdf`.
