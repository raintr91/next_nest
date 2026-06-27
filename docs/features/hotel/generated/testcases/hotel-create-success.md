# Create hotel successfully

Tính năng: Hotel Management

## Mã yêu cầu

- REQ-HOTEL-002

## Route

- Path: `/hotels/create`
- Auth: `required`

## Test ID

- hotel-create-page
- hotel-name-input
- hotel-save-btn
- app-toast-message

## Thiết lập

```yaml
session: mockAuthenticatedSession
mocks:
  - method: POST
    path: /api/hotels
    response: hotelCreateSuccess
```

## Dữ liệu

```yaml
hotelName: Hotel Sakura
```

## Kịch bản mock

`#`

## Các bước

1. action: goto, path: /hotels/create
2. action: fill, testId: hotel-name-input, valueFrom: data.hotelName
3. action: click, testId: hotel-save-btn

## Assertion

```yaml
ui:
  - testId: app-toast-message
    contains: Created
  - url: /hotels
semantic:
  ready:
    rootTestId: hotel-create-page
    waitForFonts: true
    waitForImages: visible
  level1:
    - toHaveNoConsoleErrors
    - toHaveNoHorizontalScroll
    - toHaveNoBrokenImages
    - toHaveNoTextOverflow
  accessibility:
    - toHaveNoA11yViolations
    - toHaveValidAccessibleNames
```

## Kết quả mong đợi

- Success toast is visible.
- User returns to hotel list.
