# Export CSV analytics hotel

- **Testcase:** [Admin tải CSV hotel analytics](./hotel-analytics-export/testcases/hotel-analytics-export.md)
- **Screen:** `#`

Admin tải CSV báo cáo survey/message toàn bộ hotel theo cùng filter ngày của analytics.

## status

draft

## owner

portal-team

## actors

```yaml
- id: admin
  legacyRoleCode: master
```

## entities

```yaml
- name: MessageTracking
  table: message_trackings
- name: LinkSurvey
  table: link_surveys
```

## requirements

```yaml
- id: REQ-HOTEL-ANALYTICS-EXPORT-001
  title: Tải CSV analytics
  description: CSV dùng `TrackerService::getDataExportCSV(start,end)`, encode
    `SJIS-win`, filename theo khoảng ngày legacy.
  priority: should
```

## api

```yaml
endpoints:
  - method: GET
    path: /hotels/analytics/export
    legacyPath: /admin/hotel/analytics/export
    query:
      start: string
      end: string
    response:
      contentType: text/csv
      encoding: SJIS-win
      fileName: string
```

## validation

```yaml
fields:
  - key: start
    rules: required date date_format FORMAT_DATE
  - key: end
    rules: required date date_format FORMAT_DATE after_or_equal:start
```

## openQuestions

`#`

## notes

```yaml
- type: inferredFromCode
  evidence:
    - /home/vutv/workspace/mairy-backend/app/Http/Controllers/Admin/HotelController.php
    - /home/vutv/workspace/mairy-backend/app/Http/Requests/AdminTrackingAnalyticsSearchRequest.php
  detail: Legacy `export()` tạo CSV bằng League CSV, convert SJIS-win, trả `text/csv`.
```
