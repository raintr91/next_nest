/**
 * Layout integrity checks for E2E — runs in browser context.
 * Detects: content overflow, collapsed/empty shells, overlapping elements.
 *
 * Playwright: assertLayoutIntegrity(page)
 */

export type LayoutIssueType = 'overflow' | 'collapsed' | 'overlap'

export interface LayoutIssue {
  type: LayoutIssueType
  testId: string | null
  tag: string
  message: string
}

export interface LayoutIntegrityOptions {
  /** Elements to scan; default `[data-testid]` */
  selector?: string
  /** Scan within this root; default `body` */
  rootSelector?: string
  /** Ignore these data-testid values */
  skipTestIds?: string[]
  /** Min height for `*-page` containers (px) */
  minPageHeight?: number
  /** Min width/height for buttons/controls (px) */
  minControlSize?: number
  /** Overflow detection tolerance (px) */
  overflowTolerance?: number
  /** Min intersection area to flag overlap (px²) */
  minOverlapArea?: number
  /** Skip sibling overlap detection */
  skipOverlap?: boolean
}

type ResolvedLayoutIntegrityOptions = Required<LayoutIntegrityOptions>

const DEFAULT_SKIP_TEST_IDS = [
  'app-toast',
  'app-toast-icon',
  'app-toast-close',
  'app-dialog',
  'app-dialog-content'
]

export function resolveLayoutIntegrityOptions(
  options: LayoutIntegrityOptions = {}
): ResolvedLayoutIntegrityOptions {
  return {
    selector: options.selector ?? '[data-testid]',
    rootSelector: options.rootSelector ?? 'body',
    skipTestIds: options.skipTestIds ?? DEFAULT_SKIP_TEST_IDS,
    minPageHeight: options.minPageHeight ?? 80,
    minControlSize: options.minControlSize ?? 20,
    overflowTolerance: options.overflowTolerance ?? 2,
    minOverlapArea: options.minOverlapArea ?? 64,
    skipOverlap: options.skipOverlap ?? false
  }
}

export function formatLayoutIssues(issues: LayoutIssue[]): string {
  if (issues.length === 0) return 'No layout issues'
  return issues
    .map((issue, index) => {
      const id = issue.testId ? `[data-testid="${issue.testId}"]` : issue.tag
      return `${index + 1}. [${issue.type}] ${id} — ${issue.message}`
    })
    .join('\n')
}

/**
 * Self-contained browser function — safe for Playwright page.evaluate.
 * All helpers are inlined so serialization does not drop dependencies.
 */
export function checkLayout(options: LayoutIntegrityOptions = {}): LayoutIssue[] {
  const opts: ResolvedLayoutIntegrityOptions = {
    selector: options.selector ?? '[data-testid]',
    rootSelector: options.rootSelector ?? 'body',
    skipTestIds: options.skipTestIds ?? [
      'app-toast',
      'app-toast-icon',
      'app-toast-close',
      'app-dialog',
      'app-dialog-content'
    ],
    minPageHeight: options.minPageHeight ?? 80,
    minControlSize: options.minControlSize ?? 20,
    overflowTolerance: options.overflowTolerance ?? 2,
    minOverlapArea: options.minOverlapArea ?? 64,
    skipOverlap: options.skipOverlap ?? false
  }

  const issues: LayoutIssue[] = []
  const root = document.querySelector(opts.rootSelector) ?? document.body
  if (!root) return issues

  function isVisible(el: Element): boolean {
    if (!(el instanceof HTMLElement)) return false
    const style = window.getComputedStyle(el)
    if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
      return false
    }
    const rect = el.getBoundingClientRect()
    return rect.width > 0 && rect.height > 0
  }

  function isScrollContainer(el: HTMLElement): boolean {
    const style = window.getComputedStyle(el)
    const scrollable = (v: string) => v === 'auto' || v === 'scroll' || v === 'overlay'
    return scrollable(style.overflowY) || scrollable(style.overflowX)
  }

  function getTestId(el: Element): string | null {
    return el instanceof HTMLElement ? el.dataset.testid ?? null : null
  }

  function shouldSkip(el: Element): boolean {
    const testId = getTestId(el)
    if (testId && opts.skipTestIds.includes(testId)) return true
    const tag = el.tagName
    if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT' || tag === 'TEMPLATE') return true
    return false
  }

  function describeElement(el: Element): { testId: string | null, tag: string } {
    return { testId: getTestId(el), tag: el.tagName.toLowerCase() }
  }

  function intersectionArea(a: DOMRect, b: DOMRect): number {
    const left = Math.max(a.left, b.left)
    const top = Math.max(a.top, b.top)
    const right = Math.min(a.right, b.right)
    const bottom = Math.min(a.bottom, b.bottom)
    const width = right - left
    const height = bottom - top
    if (width <= 0 || height <= 0) return 0
    return width * height
  }

  function isOverlayPosition(el: HTMLElement): boolean {
    const pos = window.getComputedStyle(el).position
    return pos === 'fixed' || pos === 'sticky'
  }

  function isMeaningfulTextContainer(el: HTMLElement): boolean {
    const testId = el.dataset.testid ?? ''
    if (testId.endsWith('-title') || testId.endsWith('-description') || testId.endsWith('-label')) {
      return true
    }
    const tag = el.tagName
    return tag === 'H1' || tag === 'H2' || tag === 'H3' || tag === 'TH' || tag === 'TD'
  }

  function isControl(el: HTMLElement): boolean {
    const testId = el.dataset.testid ?? ''
    if (testId.endsWith('-btn') || testId.endsWith('-button')) return true
    const tag = el.tagName
    return tag === 'BUTTON' || tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA'
  }

  function isPageShell(el: HTMLElement): boolean {
    return (el.dataset.testid ?? '').endsWith('-page')
  }

  function isTableShell(el: HTMLElement): boolean {
    const testId = el.dataset.testid ?? ''
    return testId.includes('-table') && (el.tagName === 'TABLE' || el.querySelector('table') !== null)
  }

  const candidates = Array.from(root.querySelectorAll(opts.selector))
    .filter((el) => !shouldSkip(el) && isVisible(el)) as HTMLElement[]

  for (const el of candidates) {
    const meta = describeElement(el)
    const rect = el.getBoundingClientRect()

    if (isPageShell(el) && rect.height < opts.minPageHeight) {
      issues.push({
        type: 'collapsed',
        ...meta,
        message: `page shell height ${Math.round(rect.height)}px < min ${opts.minPageHeight}px (empty or broken layout)`
      })
    }

    if (isControl(el) && (rect.width < opts.minControlSize || rect.height < opts.minControlSize)) {
      issues.push({
        type: 'collapsed',
        ...meta,
        message: `control size ${Math.round(rect.width)}×${Math.round(rect.height)}px smaller than min ${opts.minControlSize}px`
      })
    }

    if (isMeaningfulTextContainer(el)) {
      const text = (el.textContent ?? '').replace(/\s+/g, ' ').trim()
      if (!text && rect.height < 12) {
        issues.push({
          type: 'collapsed',
          ...meta,
          message: 'expected text content is empty — label/title may have collapsed'
        })
      }
    }

    if (isTableShell(el)) {
      const table = el.tagName === 'TABLE' ? el : el.querySelector('table')
      const bodyRows = table?.querySelectorAll('tbody tr').length ?? 0
      const dataRows = table?.querySelectorAll('tr').length ?? 0
      const rowCount = bodyRows || dataRows
      if (rowCount === 0 && rect.height < opts.minPageHeight / 2) {
        issues.push({
          type: 'collapsed',
          ...meta,
          message: `table has no rows and height ${Math.round(rect.height)}px — data shell may have collapsed`
        })
      }
    }

    if (!isScrollContainer(el)) {
      const overflowX = el.scrollWidth - el.clientWidth
      const overflowY = el.scrollHeight - el.clientHeight
      if (overflowX > opts.overflowTolerance || overflowY > opts.overflowTolerance) {
        issues.push({
          type: 'overflow',
          ...meta,
          message: `content overflow ${overflowX}px×${overflowY}px (scroll ${el.scrollWidth}×${el.scrollHeight} vs client ${el.clientWidth}×${el.clientHeight})`
        })
      }
    }
  }

  if (!opts.skipOverlap) {
    const overlapTargets = candidates.filter((el) => !isOverlayPosition(el))
    for (let i = 0; i < overlapTargets.length; i++) {
      for (let j = i + 1; j < overlapTargets.length; j++) {
        const a = overlapTargets[i]
        const b = overlapTargets[j]
        if (a.contains(b) || b.contains(a)) continue

        const rectA = a.getBoundingClientRect()
        const rectB = b.getBoundingClientRect()
        const area = intersectionArea(rectA, rectB)
        if (area < opts.minOverlapArea) continue

        const metaA = describeElement(a)
        const metaB = describeElement(b)
        issues.push({
          type: 'overlap',
          testId: metaA.testId,
          tag: metaA.tag,
          message: `overlaps with ${metaB.testId ?? metaB.tag} (intersection ~${Math.round(area)}px²)`
        })
      }
    }
  }

  return issues
}
