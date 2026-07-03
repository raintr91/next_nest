# View hotel list

Tính năng: Danh sách hotel admin

## Mã yêu cầu

- REQ-HOTEL-001

## Route

- Path: `/hotels`
- Auth: `required`

## Test ID

- hotels-page
- hotels-page-title
- hotels-table

## Thiết lập

```yaml
session: mockAuthenticatedSession
mocks:
  - method: GET
    path: /api/hotels
    response: hotelListSuccess
```

## Dữ liệu

```yaml
{}
```

## Kịch bản mock

`#`

## Các bước

1. action: goto, path: /hotels
2. action: waitFor, testId: hotels-table

## Assertion

```yaml
ui:
  - testId: hotels-page-title
    contains: Hotels
semantic:
  ready:
    rootTestId: hotels-page
    waitForTestIds:
      - hotels-table
    waitForFonts: true
    waitForImages: visible
  level1:
    - toHaveNoConsoleErrors
    - toHaveNoHorizontalScroll
    - toHaveNoBrokenImages
    - toHaveNoTextOverflow
  layout:
    - toHaveValidTableLayout
  accessibility:
    - toHaveNoA11yViolations
    - toHaveValidAccessibleNames
```

## Kết quả mong đợi

- Hotel table is visible.
- Page has no semantic UI issues.
