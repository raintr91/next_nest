# View hotel list

Feature: [Hotel Management](../spec.md)

## Requirement IDs

- REQ-HOTEL-001

## Route

- Path: `/hotels`
- Auth: `required`

## Test IDs

- hotels-page
- hotels-page-title
- hotels-table

## Setup

```yaml
session: mockAuthenticatedSession
mocks:
  - method: GET
    path: /api/hotels
    response: hotelListSuccess
```

## Data

```yaml
{}
```

## Steps

1. action: goto, path: /hotels
2. action: waitFor, testId: hotels-table

## Assertions

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

## Expected

- Hotel table is visible.
- Page has no semantic UI issues.
