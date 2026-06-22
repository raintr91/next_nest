import type { Locator } from '@playwright/test'

import type { UiIssue } from './assets'

export type ElementOverlapOptions = {
  selector?: string
  minIntersectionArea?: number
  excludeTestIds?: string[]
  ignorePairs?: Array<[string, string]>
}

/**
 * @testcase
 * ```md
 * @assertion toHaveNoElementOverlap
 * - Scope: `{module}-page`
 * - Scan selector: `[data-testid]`
 * - Allowed overlays: app-toast, app-dialog, popover, tooltip
 * - Ignore overlap pairs with reason: none
 * - Min intersection area px2: 64
 * - Expected: no visible non-overlay elements overlap unexpectedly
 * ```
 */
export async function findElementOverlapIssues(
  locator: Locator,
  options: ElementOverlapOptions = {}
) {
  return locator.evaluate((root, opts) => {
    const selector = opts.selector ?? '[data-testid]'
    const minArea = opts.minIntersectionArea ?? 64
    const exclude = new Set([
      'app-toast',
      'app-dialog',
      'app-dialog-content',
      ...(opts.excludeTestIds ?? [])
    ])
    const ignorePairs = new Set((opts.ignorePairs ?? []).map(([a, b]) => `${a}::${b}`))
    const candidates = Array.from(root.querySelectorAll(selector)).filter(isTarget) as HTMLElement[]
    const issues: UiIssue[] = []

    function isTarget(el: Element) {
      if (!(el instanceof HTMLElement)) return false
      const testId = el.dataset.testid
      if (testId && exclude.has(testId)) return false

      const style = window.getComputedStyle(el)
      if (style.display === 'none' || style.visibility === 'hidden') return false
      if (style.position === 'fixed' || style.position === 'sticky') return false

      const rect = el.getBoundingClientRect()
      return rect.width > 0 && rect.height > 0
    }

    function intersectionArea(a: DOMRect, b: DOMRect) {
      const width = Math.min(a.right, b.right) - Math.max(a.left, b.left)
      const height = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top)
      return width > 0 && height > 0 ? width * height : 0
    }

    for (let i = 0; i < candidates.length; i++) {
      for (let j = i + 1; j < candidates.length; j++) {
        const a = candidates[i]
        const b = candidates[j]
        if (a.contains(b) || b.contains(a)) continue

        const aId = a.dataset.testid ?? a.tagName.toLowerCase()
        const bId = b.dataset.testid ?? b.tagName.toLowerCase()
        if (ignorePairs.has(`${aId}::${bId}`) || ignorePairs.has(`${bId}::${aId}`)) continue

        const area = intersectionArea(a.getBoundingClientRect(), b.getBoundingClientRect())
        if (area < minArea) continue

        issues.push({
          testId: a.dataset.testid ?? null,
          tag: a.tagName.toLowerCase(),
          message: `overlaps with ${bId} (intersection ~${Math.round(area)}px²)`
        })
      }
    }

    return issues
  }, options)
}
