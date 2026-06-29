# Chain — danh sách hotel (施設一覧)

- **Testcase:** [Chain xem danh sách hotel](./chain-hotel-list/testcases/chain-hotel-list.md)
- **Screen:** `/hotels` (dev `http://localhost:3000/hotels`) · `chain-hotels-page`

Chain user xem danh sách hotel thuộc chain, tải báo cáo 開封率データ và handoff sang store portal theo manager.

## status

draft

## owner

portal-team

## codegen

```yaml
profile: list
entity: hotel
module: chain-hotels
namespace: chain-hotel
skip: []
```

## tags

```yaml
- "#shell: DataListPage"
- "#pattern: CRUD"
- "#style: shadcn/ui"
- "#style: compact"
- "#style: flat"
- "#needs-component: cell-managers:MoManagerHandoffPills:managers"
- "#manual-composable: exportOpenRateReport"
- "#manual-composable: loginAsStoreManager"
- "#wire-only: login-as-store-handoff"
- "#phase-api: chain-hotel-list-api"
```

## requirements

```yaml
- id: REQ-CHAIN-HOTEL-LIST-001
  title: Chain xem danh sách hotel thuộc chain
  description: Chỉ hotel có chain_id trùng session; sort mặc định created_at desc,
    tie-break id desc.
  priority: must
- id: REQ-CHAIN-HOTEL-LIST-002
  title: Manager handoff trên từng row
  description: Cột Login hiển thị pill theo managers; ẩn user có full_name
    case-insensitive mairy.
  priority: must
- id: REQ-CHAIN-HOTEL-LIST-003
  title: Phân trang chain list
  description: Toolbar trái nút 合計; toolbar phải 表示件数 + select per_page + 件; mặc
    định 100; options 20/40/80/100.
  priority: must
- id: REQ-CHAIN-HOTEL-LIST-004
  title: Khối export 開封率データ trên list
  description: Month picker Y-m mặc định tháng trước; nút ダウンロード POST export-report.
  priority: must
```

## ui

```yaml
composition:
  pattern: DataListPage
  overrideCommonPattern: true
routes:
  - path: /hotels
    legacyPath: /chain/hotel
    pageTestId: chain-hotels-page
filters: []
columns:
  - key: id
    title: ID
    sortable: false
    align: center
  - key: name
    title: 店舗名
    sortable: false
  - key: managers
    title: Login
    render: custom
testIds:
  module: chain-hotels
toolbar:
  showTotal: true
  totalLabel: 合計
  defaultPageSize: 100
  pageSizeOptions:
    - 20
    - 40
    - 80
    - 100
  perPage:
    position: toolbar-end
    labelBefore: 表示件数
    labelAfter: 件
    testId: chain-hotels-per-page-select
embeddedBlocks:
  - id: export-open-rate
    position: above-toolbar
    label: 開封率データ
    testIds:
      monthInput: chain-hotels-export-month-input
      submitBtn: chain-hotels-export-report-btn
```

## api

```yaml
endpoints:
  - method: GET
    path: /hotels
    legacyPath: /chain/hotel
    action: list
    query:
      order_by: string
      sorted_by: asc|desc
      per_page: number
    response:
      data:
        - id: number
          name: string
          managers:
            - id: number
              full_name: string|null
      meta:
        total: number
        current_page: number
        per_page: number
  - method: POST
    path: /hotels/export-report
    legacyPath: /chain/hotel/export-report
    action: export
    body:
      month: string
```

## notes

```yaml
- Bám docs/features/common/common-list-toolbar.spec.yaml cho per-page góc phải;
  label legacy 表示件数/件 (không ページ).
- Legacy ChainService::paginateHotels hỗ trợ name/to_created nhưng blade không
  render search — portal giữ parity, không thêm filters.
- chain/hotel/create|update views và route name chain.hotel.create|update|delete
  không đăng ký trong routes/chain.php — out of scope chain portal.
- Legacy POST login-from-admin không gọi inChain; API mới nên bổ sung kiểm tra
  chain scope (xem openQuestions).
- Design v1 grill source — export/login-as chi tiết ở chain-hotel-export-report
  và chain-hotel-login-as-manager.
```

## openQuestions

```yaml
- id: chain-hotel-list-api-contract
  question: Module Chain API (api workspace) chưa có route list — contract tạm
    theo legacy paginateHotels cho đến khi BE publish.
  tag: "#phase-api"
```
