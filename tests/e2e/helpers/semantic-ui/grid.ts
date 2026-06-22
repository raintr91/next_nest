import type { Locator } from '@playwright/test'

import type { UiIssue } from './assets'

export type AlignedGridOptions = {
  itemSelector: string
  columns?: number
  rowTolerance?: number
  columnTolerance?: number
}

/**
 * @testcase
 * ```md
 * @assertion toHaveAlignedGrid
 * - Grid root test id: `{module}-grid`
 * - Item selector/test id: `{module}-card`
 * - Expected columns by viewport: desktop 4, tablet 2, mobile 1
 * - Expected gap token or px: spacing.4 | 16
 * - Masonry layout: false
 * - Expected: items align by row/column within tolerance
 * ```
 */
export async function findAlignedGridIssues(
  locator: Locator,
  options: AlignedGridOptions
) {
  return locator.evaluate((root, opts) => {
    const items = Array.from(root.querySelectorAll(opts.itemSelector)) as HTMLElement[]
    const rowTolerance = opts.rowTolerance ?? 4
    const columnTolerance = opts.columnTolerance ?? 4
    const issues: UiIssue[] = []

    if (items.length === 0) {
      return [describe(root, `no grid items found for selector "${opts.itemSelector}"`)]
    }

    const rects = items.map((item) => item.getBoundingClientRect())
    const columns = opts.columns ?? countFirstRowColumns(rects, rowTolerance)

    for (let index = 0; index < rects.length; index++) {
      const rowStart = Math.floor(index / columns) * columns
      const columnIndex = index % columns
      const expectedTop = rects[rowStart]?.top
      const expectedLeft = rects[columnIndex]?.left

      if (expectedTop !== undefined && Math.abs(rects[index].top - expectedTop) > rowTolerance) {
        issues.push(describe(items[index], `item ${index + 1} row top differs by ${Math.round(Math.abs(rects[index].top - expectedTop))}px`))
      }

      if (expectedLeft !== undefined && Math.abs(rects[index].left - expectedLeft) > columnTolerance) {
        issues.push(describe(items[index], `item ${index + 1} column left differs by ${Math.round(Math.abs(rects[index].left - expectedLeft))}px`))
      }
    }

    return issues

    function countFirstRowColumns(itemRects: DOMRect[], tolerance: number) {
      const firstTop = itemRects[0]?.top ?? 0
      return Math.max(1, itemRects.filter((rect) => Math.abs(rect.top - firstTop) <= tolerance).length)
    }

    function describe(el: Element, message: string): UiIssue {
      return {
        testId: el instanceof HTMLElement ? el.dataset.testid ?? null : null,
        tag: el.tagName.toLowerCase(),
        message
      }
    }
  }, options)
}
