import type { Locator } from '@playwright/test'

import type { UiIssue } from './assets'

export type ValidTableLayoutOptions = {
  tolerance?: number
  allowHorizontalScroll?: boolean
}

/**
 * @testcase
 * ```md
 * @assertion toHaveValidTableLayout
 * - Table test id: `{module}-table`
 * - Expected columns: name, status, createdAt, actions
 * - Action/expand columns: actions
 * - Horizontal scroll allowed: true | false
 * - Long cell content fields: name, description
 * - Expected: header/body columns align and cells do not overflow unexpectedly
 * ```
 */
export async function findTableLayoutIssues(
  locator: Locator,
  options: ValidTableLayoutOptions = {}
) {
  return locator.evaluate((root, opts) => {
    const table = root.matches('table') ? root : root.querySelector('table')
    const tolerance = opts.tolerance ?? 4
    const issues: UiIssue[] = []

    if (!(table instanceof HTMLTableElement)) {
      return [{
        testId: root instanceof HTMLElement ? root.dataset.testid ?? null : null,
        tag: root.tagName.toLowerCase(),
        message: 'expected a table element or descendant table'
      }]
    }

    const headers = Array.from(table.querySelectorAll('thead th'))
    const firstRowCells = Array.from(table.querySelectorAll('tbody tr:first-child td'))
    const expectedCells = headers.length
    const actualCells = firstRowCells.length

    if (expectedCells > 0 && actualCells > 0 && expectedCells !== actualCells) {
      issues.push(describe(table, `header has ${expectedCells} columns but first body row has ${actualCells}`))
    }

    headers.forEach((header, index) => {
      const cell = firstRowCells[index]
      if (!cell) return

      const diff = Math.abs(header.getBoundingClientRect().width - cell.getBoundingClientRect().width)
      if (diff > tolerance) {
        issues.push(describe(table, `column ${index + 1} header/body width differs by ${Math.round(diff)}px`))
      }
    })

    if (!opts.allowHorizontalScroll && table.scrollWidth - table.clientWidth > tolerance) {
      issues.push(describe(table, `table has horizontal overflow ${table.scrollWidth - table.clientWidth}px`))
    }

    for (const cell of Array.from(table.querySelectorAll('th, td'))) {
      const el = cell as HTMLElement
      if (el.scrollWidth - el.clientWidth <= tolerance) continue

      issues.push({
        testId: el.dataset.testid ?? table.dataset.testid ?? null,
        tag: el.tagName.toLowerCase(),
        message: `cell text/content overflows by ${el.scrollWidth - el.clientWidth}px`
      })
    }

    return issues

    function describe(el: HTMLElement, message: string): UiIssue {
      return {
        testId: el.dataset.testid ?? null,
        tag: el.tagName.toLowerCase(),
        message
      }
    }
  }, options)
}
