# Create hotel validation

Tính năng: Hotel Management

## Mã yêu cầu

- REQ-HOTEL-003

## Route

- Path: `/hotels/create`
- Auth: `required`

## Test ID

- hotel-create-page
- hotel-name-input
- hotel-save-btn
- hotel-name-error

## Thiết lập

```yaml
session: mockAuthenticatedSession
mocks: []
```

## Dữ liệu

```yaml
{}
```

## Kịch bản mock

`#`

## Các bước

1. action: goto, path: /hotels/create
2. action: click, testId: hotel-save-btn

## Assertion

```yaml
ui:
  - testId: hotel-name-error
    visible: true
semantic:
  ready:
    rootTestId: hotel-create-page
    waitForFonts: true
  level1:
    - toHaveNoConsoleErrors
    - toHaveNoHorizontalScroll
    - toHaveNoTextOverflow
  accessibility:
    - toHaveValidAccessibleNames
    - toHaveValidAria
```

## Kết quả mong đợi

- Required field validation error is visible.
- No create API request is sent.
