# Download PDF analytics hotel

- **Testcase:** [Admin tải PDF hotel analytics](./hotel-analytics-download-pdf/testcases/hotel-analytics-download-pdf.md)
- **Screen:** `#`

Admin tải PDF báo cáo survey/message toàn bộ hotel theo cùng filter ngày của analytics.

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
- name: HotelSetting
  table: hotel_settings
```

## requirements

```yaml
- id: REQ-HOTEL-ANALYTICS-PDF-001
  title: Tải PDF analytics
  description: PDF render cùng dữ liệu analytics, dùng layout landscape và
    filename theo khoảng ngày legacy.
  priority: should
```

## api

```yaml
endpoints:
  - method: GET
    path: /hotels/analytics/download-pdf
    legacyPath: /admin/hotel/analytics/download-pdf
    query:
      start: string
      end: string
    response:
      contentType: application/pdf
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
    - /home/vutv/workspace/mairy-backend/resources/views/admin/hotel/pdf.blade.php
  detail: Legacy `downloadPdf()` load cùng metric analytics, render
    `admin.hotel.pdf`, set paper A4 landscape rồi download.
```
