import type { Locator } from '@playwright/test'

import type { UiIssue } from './assets'

export type TextOverflowOptions = {
  selector?: string
  tolerance?: number
  excludeTestIds?: string[]
  allowTruncate?: boolean
}

/**
 * @testcase
 * ```md
 * @assertion toHaveNoTextOverflow
 * - Scope: `{module}-page`
 * - Long text data: describe fields that contain long content
 * - Allowed truncate test ids: `{module}-description`
 * - Allowed scroll containers: `{module}-table-scroll`
 * - Tolerance px: 2
 * - Expected: no unexpected clipped or overflowing visible text
 * ```
 */
export async function findTextOverflowIssues(
  locator: Locator,
  options: TextOverflowOptions = {}
) {
  return locator.evaluate((root, opts) => {
    const tolerance = opts.tolerance ?? 2
    const selector = opts.selector ?? '[data-testid], h1, h2, h3, p, label, th, td, button, a'
    const excludeTestIds = new Set(opts.excludeTestIds ?? [])
    const candidates = [root, ...Array.from(root.querySelectorAll(selector))]

    function isVisible(el: Element) {
      if (!(el instanceof HTMLElement)) return false
      const style = window.getComputedStyle(el)
      if (style.display === 'none' || style.visibility === 'hidden') return false
      const rect = el.getBoundingClientRect()
      return rect.width > 0 && rect.height > 0
    }

    function allowsOverflow(el: HTMLElement) {
      if (opts.allowTruncate && el.dataset.overflowAllowed === 'true') return true

      const style = window.getComputedStyle(el)
      const scrollable = ['auto', 'scroll', 'overlay']
      return scrollable.includes(style.overflowX) || scrollable.includes(style.overflowY)
    }

    return candidates.flatMap((el) => {
      if (!(el instanceof HTMLElement) || !isVisible(el)) return []
      if (excludeTestIds.has(el.dataset.testid ?? '')) return []
      if (!el.textContent?.replace(/\s+/g, '').trim()) return []
      if (allowsOverflow(el)) return []

      const overflowX = el.scrollWidth - el.clientWidth
      const overflowY = el.scrollHeight - el.clientHeight
      if (overflowX <= tolerance && overflowY <= tolerance) return []

      return [{
        testId: el.dataset.testid ?? null,
        tag: el.tagName.toLowerCase(),
        message: `text overflow ${overflowX}px×${overflowY}px (scroll ${el.scrollWidth}×${el.scrollHeight}, client ${el.clientWidth}×${el.clientHeight})`
      }]
    }) satisfies UiIssue[]
  }, options)
}
