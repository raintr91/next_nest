# Create hotel successfully

Feature: [Hotel Management](../spec.md)

## Requirement IDs

- REQ-HOTEL-002

## Route

- Path: `/hotels/create`
- Auth: `required`

## Test IDs

- hotel-create-page
- hotel-name-input
- hotel-save-btn
- app-toast-message

## Setup

```yaml
session: mockAuthenticatedSession
mocks:
  - method: POST
    path: /api/hotels
    response: hotelCreateSuccess
```

## Data

```yaml
hotelName: Hotel Sakura
```

## Steps

1. action: goto, path: /hotels/create
2. action: fill, testId: hotel-name-input, valueFrom: data.hotelName
3. action: click, testId: hotel-save-btn

## Assertions

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

## Expected

- Success toast is visible.
- User returns to hotel list.
