# Chain — tải báo cáo 開封率データ

- **Testcase:** [Chain tải báo cáo 開封率データ](./chain-hotel-export-report/testcases/chain-hotel-export-report.md)
- **Screen:** `/hotels` (dev `http://localhost:3000/hotels`) · `chain-hotels-page`

Chain user chọn tháng và tải Excel open-rate EMAIL/SMS theo hotel trong chain; UI embed trên trang list.

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
- "#manual-composable: exportOpenRateReport"
- "#phase-api: chain-hotel-export-api"
```

## requirements

```yaml
- id: REQ-CHAIN-HOTEL-EXPORT-001
  title: Chọn tháng báo cáo
  description: Month picker format Y-m; mặc định now()->subMonth().
  priority: must
- id: REQ-CHAIN-HOTEL-EXPORT-002
  title: Tải Excel 開封率データ
  description: POST month; server export theo chainId và firstOfMonth/endOfMonth.
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
columns: []
testIds:
  module: chain-hotels
  monthInput: chain-hotels-export-month-input
  submitBtn: chain-hotels-export-report-btn
```

## api

```yaml
endpoints:
  - method: POST
    path: /hotels/export-report
    legacyPath: /chain/hotel/export-report
    action: export
    body:
      month: string
    response:
      type: file
      format: xlsx
      contentDisposition: attachment;filename="【{chain.name}様】開封率月次報告.xlsx"
```

## notes

```yaml
- Implement trong useChainHotelList hoặc composable exportOpenRateReport; không
  gen page riêng.
- Legacy dùng POST form; SPA giữ POST download binary.
- Parent spec chain-hotel-list owns embedded UI testIds.
```

## openQuestions

```yaml
- id: chain-hotel-export-api-contract
  question: Endpoint export chưa có trong api workspace — mirror legacy
    TrackerService::exportReportHotels.
  tag: "#phase-api"
```
