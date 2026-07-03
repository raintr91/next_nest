# Admin tải PDF hotel analytics

Tính năng: Download PDF analytics hotel

## Mã yêu cầu

- REQ-HOTEL-ANALYTICS-PDF-001

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

- **download-pdf-success** — Download PDF thành công: PDF response không rỗng.

## Các bước

1. action: request, method: GET, path: /hotels/analytics/download-pdf, query: `{"start":"2026-06-01","end":"2026-06-30"}`

## Assertion

```yaml
{}
```

## Kết quả mong đợi

- Response content-type là `application/pdf`.
- Filename chứa `全施設のアンケートレポート.pdf`.
