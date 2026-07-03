# Chain login as manager mở store tab

Tính năng: Chain — login as manager (store handoff)

## Mã yêu cầu

- REQ-CHAIN-HOTEL-LOGIN-AS-001
- REQ-CHAIN-HOTEL-LOGIN-AS-002

## Route

- Path: `/hotels`
- Auth: `chain`

## Test ID

- chain-hotels-page
- chain-hotels-cell-managers

## Thiết lập

```yaml
session: mockChainAuthenticatedSession
mocks:
  - method: POST
    path: /api/auth/store/login-from-admin
    response: storeLoginFromAdminSuccess
```

## Dữ liệu

```yaml
manager_id: "{{manager_id}}"
```

## Kịch bản mock

`#`

## Các bước

1. action: goto, path: /hotels
2. action: waitFor, testId: chain-hotels-table

## Assertion

```yaml
network:
  - method: POST
    path: /api/auth/store/login-from-admin
    bodyContains:
      id: "{{manager_id}}"
ui:
  - action: newTabOpened
    urlContains: /store/
```

## Kết quả mong đợi

- Tab store mở với token và hotel_name trong query.
- Manager full_name mairy không có testId handoff.
