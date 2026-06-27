# Admin hotel list

- **Testcase:** `#`
- **Screen:** `/admin/hotels` (dev `http://localhost:3000/admin/hotels`) · `hotels-page`

Danh sách hotel với search, pagination và row actions theo common list page.

## status

draft

## owner

portal-team

## codegen

```yaml
profile: list
entity: hotel
module: hotels
skip: []
```

## tags

```yaml
- "#needs-component: cell-activate_status:MoStatusChip:label"
```

## requirements

```yaml
- id: REQ-HOTEL-LIST-001
  title: List hotels
  description: Admin xem danh sách hotel, filter
    created_at/name/code/chain_name/activate_status, phân trang.
  priority: must
```

## ui

```yaml
composition:
  pattern: DataListPage
  overrideCommonPattern: false
routes:
  - path: /admin/hotels
    pageTestId: hotels-page
filters:
  - name: created_at
    label: Created at
    type: date
  - name: name
    label: Hotel name
    type: text_field
    placeholder: Search by name
  - name: code
    label: Hotel code
    type: text_field
  - name: chain_name
    label: Chain name
    type: text_field
  - name: activate_status
    label: Activate status
    type: select
columns:
  - key: id
    title: ID
    sortable: true
    align: center
  - key: name
    title: Name
    sortable: true
  - key: code
    title: Code
    sortable: true
  - key: chain_name
    title: Chain
  - key: created_at
    title: Created
    sortable: true
  - key: activate_status
    title: Status
    render: custom
testIds:
  module: hotels
```

## api

```yaml
endpoints:
  - method: GET
    path: /hotels
    action: list
```

## notes

```yaml
- Post-grill portal-gen-ready example (docs/templates/spec.yaml).
- Design v1 legacy source is docs/features/hotel/hotel-list.spec.yaml — enrich
  via /grill-with-docs.
- Bám docs/features/common/common-list-page.spec.yaml.
```

## openQuestions

`#`
