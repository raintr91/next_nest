# Hotel autocomplete trả label/value

Tính năng: Hotel name autocomplete

## Mã yêu cầu

- REQ-HOTEL-AUTOCOMPLETE-001

## Route

- Path: `/hotels/autocomplete`
- Auth: `required`

## Test ID

`#`

## Thiết lập

```yaml
session: mockAdminSession
```

## Dữ liệu

```yaml
term: Sakura
```

## Kịch bản mock

- **autocomplete-match** — Có kết quả: Trả tên hotel match term.
- **autocomplete-empty-term** — Term rỗng: Trả mảng rỗng.

## Các bước

1. action: request, method: GET, path: /hotels/autocomplete, query: `{"term":"Sakura"}`

## Assertion

```yaml
{}
```

## Kết quả mong đợi

- Response là mảng `{label,value}`.
- Term rỗng trả `[]`.
