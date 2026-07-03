# Chain — login as manager (store handoff)

- **Testcase:** [Chain login as manager mở store tab](./chain-hotel-login-as-manager/testcases/chain-hotel-login-as-manager.md)
- **Screen:** `/hotels` (dev `http://localhost:3000/hotels`) · `chain-hotels-page`

Chain user click manager pill trên list; nhận JWT và mở store portal tab mới qua legacy login-from-admin API.

## status

draft

## owner

portal-team

## codegen

```yaml
profile: list
entity: hotel
module: chain-hotels
skip:
  - models
  - service
  - composable
  - page
  - mock
  - validation
  - component
```

## tags

```yaml
- "#skip-codegen: page"
- "#needs-component: cell-managers:MoManagerHandoffPills:managers"
- "#manual-composable: loginAsStoreManager"
- "#wire-only: login-as-store-handoff"
- "#phase-api: chain-login-as-inchain"
```

## requirements

```yaml
- id: REQ-CHAIN-HOTEL-LOGIN-AS-001
  title: Handoff store qua manager pill
  description: Click pill → POST login-from-admin với user id → mở store tab với
    hotel_name, token, user_name, id_admin, use_restaurant, user_id.
  priority: must
- id: REQ-CHAIN-HOTEL-LOGIN-AS-002
  title: Lỗi handoff trên UI
  description: AJAX fail đóng tab mới; alert ストアとしてのログインに失敗しました...
  priority: must
```

## ui

```yaml
composition:
  pattern: custom
  overrideCommonPattern: true
routes:
  - path: /hotels
    legacyPath: /chain/hotel
    pageTestId: chain-hotels-page
filters: []
columns:
  - key: managers
    title: Login
    render: custom
testIds:
  module: chain-hotels
  patterns:
    - id: manager-login-as
      template: chain-hotels-cell-managers-login-as-{managerId}
```

## api

```yaml
endpoints:
  - method: POST
    path: /auth/store/login-from-admin
    legacyPath: /api/store-login-from-admin/login-from-admin
    action: login-as
    body:
      id: number
    response:
      token: string
      user_name: string
      hotel_name: string
      use_restaurant: boolean|null
      user_id: number
```

## notes

```yaml
- Legacy loginFromAdmin không kiểm tra HotelService::inChain — chỉ verify user
  và hotel tồn tại; GET loginAsManager có inChain nhưng không dùng trên list UI.
- GET /chain/login-as-manager-by-chain-user/{id} đăng ký chain.php nhưng không
  reference trong views chain hotel — flow khác (redirect manager settings).
- API mới nên thêm chain scope check trước khi cấp token.
- Parent list spec owns MoManagerHandoffPills slot.
```

## openQuestions

```yaml
- id: chain-hotel-login-as-inchain
  question: Phase API có bắt buộc inChain trên POST login-from-admin cho chain
    portal không (cải thiện so với legacy)?
  tag: "#phase-api"
- id: chain-hotel-login-as-spa-flow
  question: Giữ mở tab store legacy với query string hay SSO thống nhất v2-mairy-store?
  tag: "#phase-api"
```
