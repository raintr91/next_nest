# Admin tải CSV hotel analytics

Tính năng: Export CSV analytics hotel

## Mã yêu cầu

- REQ-HOTEL-ANALYTICS-EXPORT-001

## Route

- Path: `/hotels/analytics`
- Auth: `required`

## Test ID

`#`

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

- **export-success** — Download CSV thành công: CSV body không rỗng và encoding contract là `SJIS-win`.

## Các bước

1. action: request, method: GET, path: /hotels/analytics/export, query: `{"start":"2026-06-01","end":"2026-06-30"}`

## Assertion

```yaml
{}
```

## Kết quả mong đợi

- Response content-type là `text/csv`.
- Filename chứa `全施設のアンケートデータ.csv`.
