import type { Page } from '@playwright/test'

export type UiIssue = {
  testId: string | null
  tag: string
  message: string
}

export type HorizontalScrollOptions = {
  tolerance?: number
  rootSelector?: string
}

export type BrokenImagesOptions = {
  selector?: string
  includeHidden?: boolean
}

/**
 * @testcase
 * ```md
 * @assertion toHaveNoHorizontalScroll
 * - Scope: page | `{module}-page`
 * - Viewports: desktop `1440x900`, mobile `390x844`
 * - Allowed horizontal scroll containers: `{module}-table-scroll`
 * - Tolerance px: 2
 * - Expected: document/page shell has no horizontal scrollbar
 * ```
 */
export async function findHorizontalScrollIssues(
  page: Page,
  options: HorizontalScrollOptions = {}
) {
  return page.evaluate((opts) => {
    const tolerance = opts.tolerance ?? 2
    const roots = [
      document.documentElement,
      document.body,
      ...(opts.rootSelector ? Array.from(document.querySelectorAll(opts.rootSelector)) : [])
    ].filter(Boolean) as HTMLElement[]

    return roots.flatMap((el) => {
      const overflow = el.scrollWidth - el.clientWidth
      if (overflow <= tolerance) return []

      return [{
        testId: el.dataset?.testid ?? null,
        tag: el.tagName.toLowerCase(),
        message: `horizontal overflow ${overflow}px (scrollWidth ${el.scrollWidth}, clientWidth ${el.clientWidth})`
      }]
    })
  }, options)
}

/**
 * @testcase
 * ```md
 * @assertion toHaveNoBrokenImages
 * - Scope: `{module}-page`
 * - Image state before scan: visible images loaded
 * - Lazy images: scroll into view | not applicable
 * - Decorative images allowed: true
 * - Expected: every scanned image has currentSrc, complete, natural size > 0
 * ```
 */
export async function findBrokenImageIssues(
  page: Page,
  options: BrokenImagesOptions = {}
) {
  return page.evaluate((opts) => {
    const selector = opts.selector ?? 'img'
    const images = Array.from(document.querySelectorAll(selector)) as HTMLImageElement[]

    function isVisible(el: HTMLElement) {
      const style = window.getComputedStyle(el)
      if (style.display === 'none' || style.visibility === 'hidden') return false
      const rect = el.getBoundingClientRect()
      return rect.width > 0 && rect.height > 0
    }

    return images.flatMap((image) => {
      if (!opts.includeHidden && !isVisible(image)) return []

      const src = image.currentSrc || image.src
      const broken = !src || !image.complete || image.naturalWidth <= 0 || image.naturalHeight <= 0
      if (!broken) return []

      return [{
        testId: image.dataset.testid ?? null,
        tag: image.tagName.toLowerCase(),
        message: `broken image src="${src}" complete=${image.complete} natural=${image.naturalWidth}x${image.naturalHeight}`
      }]
    })
  }, options)
}

export function formatIssues(title: string, issues: UiIssue[]) {
  if (issues.length === 0) return title

  return issues
    .map((issue, index) => {
      const selector = issue.testId ? `[data-testid="${issue.testId}"]` : issue.tag
      return `${index + 1}. ${selector} — ${issue.message}`
    })
    .join('\n')
}
