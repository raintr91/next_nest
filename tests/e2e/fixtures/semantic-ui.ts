import type { Locator, Page } from '@playwright/test'
import { expect as baseExpect, test as base } from '@playwright/test'

import {
  axeRulePresets,
  formatA11yViolations,
  scanA11y,
  type A11yScanOptions
} from '../helpers/semantic-ui/accessibility'
import {
  findBrokenImageIssues,
  findHorizontalScrollIssues,
  formatIssues,
  type BrokenImagesOptions,
  type HorizontalScrollOptions,
  type UiIssue
} from '../helpers/semantic-ui/assets'
import {
  buttonTokenExpectation,
  controlTokenExpectation,
  findDesignTokenIssues,
  findShadcnTableTokenIssues,
  surfaceTokenExpectation,
  type DesignTokenExpectation
} from '../helpers/semantic-ui/designTokens'
import { findAlignedGridIssues, type AlignedGridOptions } from '../helpers/semantic-ui/grid'
import { findElementOverlapIssues, type ElementOverlapOptions } from '../helpers/semantic-ui/layout'
import {
  collectRuntimeIssues,
  filterRuntimeIssues,
  formatRuntimeIssues,
  type RuntimeIssue,
  type RuntimeIssueOptions
} from '../helpers/semantic-ui/runtime'
import { findTableLayoutIssues, type ValidTableLayoutOptions } from '../helpers/semantic-ui/table'
import { findTextOverflowIssues, type TextOverflowOptions } from '../helpers/semantic-ui/textOverflow'

export type SemanticUiAsserts = {
  expectNoA11yViolations: (page: Page, options?: A11yScanOptions) => Promise<void>
  expectValidAccessibleNames: (page: Page, options?: A11yScanOptions) => Promise<void>
  expectValidAria: (page: Page, options?: A11yScanOptions) => Promise<void>
  expectAccessibleMedia: (page: Page, options?: A11yScanOptions) => Promise<void>
  expectReadableContrast: (page: Page, options?: A11yScanOptions) => Promise<void>
  expectValidDocumentSemantics: (page: Page, options?: A11yScanOptions) => Promise<void>
}

type SemanticFixtures = {
  runtimeIssues: RuntimeIssue[]
  consoleErrors: RuntimeIssue[]
  semanticUi: SemanticUiAsserts
}

export const test = base.extend<SemanticFixtures>({
  consoleErrors: async ({ page }, use) => {
    const issues = collectRuntimeIssues(page)
    await use(issues)
  },

  runtimeIssues: async ({ consoleErrors }, use) => {
    await use(consoleErrors)
  },

  semanticUi: async ({}, use, testInfo) => {
    const assertAxe = async (page: Page, options: A11yScanOptions = {}) => {
      const results = await scanA11y(page, testInfo, options)
      baseExpect(results.violations, formatA11yViolations(results)).toEqual([])
    }

    await use({
      expectNoA11yViolations: assertAxe,
      expectValidAccessibleNames: (page, options) => assertAxe(page, { ...options, rules: [...axeRulePresets.accessibleNames] }),
      expectValidAria: (page, options) => assertAxe(page, { ...options, rules: [...axeRulePresets.aria] }),
      expectAccessibleMedia: (page, options) => assertAxe(page, { ...options, rules: [...axeRulePresets.media] }),
      expectReadableContrast: (page, options) => assertAxe(page, { ...options, rules: [...axeRulePresets.contrast] }),
      expectValidDocumentSemantics: (page, options) => assertAxe(page, { ...options, rules: [...axeRulePresets.document] })
    })
  }
})

export const expect = baseExpect.extend({
  /**
   * @testcase
   * ```md
   * @assertion toHaveNoConsoleErrors
   * - Capture from: test start
   * - Include: console.error, pageerror
   * - Optional include failed requests: document/script/stylesheet/image/font
   * - Ignore patterns with reason: none
   * - Expected: no unexpected browser/runtime errors
   * ```
   */
  async toHaveNoConsoleErrors(_page: Page, issues: RuntimeIssue[] = [], options?: RuntimeIssueOptions) {
    const filtered = filterRuntimeIssues(issues, options)
    const pass = filtered.length === 0
    return {
      pass,
      message: () => formatRuntimeIssues(filtered)
    }
  },

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
  async toHaveNoHorizontalScroll(page: Page, options?: HorizontalScrollOptions) {
    return issueResult(await findHorizontalScrollIssues(page, options), 'No horizontal scroll')
  },

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
  async toHaveNoBrokenImages(page: Page, options?: BrokenImagesOptions) {
    return issueResult(await findBrokenImageIssues(page, options), 'No broken images')
  },

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
  async toHaveNoTextOverflow(locator: Locator, options?: TextOverflowOptions) {
    return issueResult(await findTextOverflowIssues(locator, options), 'No text overflow')
  },

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
  async toHaveNoElementOverlap(locator: Locator, options?: ElementOverlapOptions) {
    return issueResult(await findElementOverlapIssues(locator, options), 'No element overlap')
  },

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
  async toHaveAlignedGrid(locator: Locator, options: AlignedGridOptions) {
    return issueResult(await findAlignedGridIssues(locator, options), 'Grid is aligned')
  },

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
  async toHaveValidTableLayout(locator: Locator, options?: ValidTableLayoutOptions) {
    return issueResult(await findTableLayoutIssues(locator, options), 'Table layout is valid')
  },

  /**
   * @testcase
   * ```md
   * @assertion toHaveNoA11yViolations
   * - Include selector: `[data-testid="{module}-page"]`
   * - Exclude selectors: none
   * - WCAG tags: wcag2a, wcag2aa, wcag21a, wcag21aa
   * - Disabled axe rules with reason: none
   * - Attach full scan result: on failure
   * - Expected: zero axe violations for selected scope
   * ```
   */
  async toHaveNoA11yViolations(page: Page, options?: A11yScanOptions) {
    const results = await scanA11y(page, undefined, options)
    const pass = results.violations.length === 0
    return {
      pass,
      message: () => formatA11yViolations(results)
    }
  },

  /**
   * @testcase
   * ```md
   * @assertion toHaveValidAccessibleNames
   * - Scope: `{module}-page`
   * - Controls to verify: inputs, buttons, links, selects
   * - Expected accessible names: describe labels/names for critical controls
   * - Known decorative/unnamed exceptions: none
   * - Axe rules: button-name, link-name, aria-input-field-name, select-name, label
   * ```
   */
  async toHaveValidAccessibleNames(page: Page, options?: A11yScanOptions) {
    return axePresetResult(page, axeRulePresets.accessibleNames, options)
  },

  /**
   * @testcase
   * ```md
   * @assertion toHaveValidAria
   * - Scope: `{module}-page`
   * - Interactive widgets: dialog, select, menu, tabs, table
   * - Expected ARIA states: describe expanded/selected/invalid states if relevant
   * - Known ARIA exceptions: none
   * - Axe rules: aria-allowed-attr, aria-valid-attr, aria-required-attr, aria-roles, aria-hidden-focus
   * ```
   */
  async toHaveValidAria(page: Page, options?: A11yScanOptions) {
    return axePresetResult(page, axeRulePresets.aria, options)
  },

  /**
   * @testcase
   * ```md
   * @assertion toHaveAccessibleMedia
   * - Scope: `{module}-page`
   * - Content images requiring alt: list test ids or purpose
   * - Decorative images allowed: describe selectors expected to use `alt=""`
   * - SVG role expectation: img | presentation
   * - Axe rules: image-alt, input-image-alt, svg-img-alt, object-alt
   * ```
   */
  async toHaveAccessibleMedia(page: Page, options?: A11yScanOptions) {
    return axePresetResult(page, axeRulePresets.media, options)
  },

  /**
   * @testcase
   * ```md
   * @assertion toHaveReadableContrast
   * - Scope: `{module}-page`
   * - Theme: light | dark | tailwind-admin-theme
   * - Critical text: headings, labels, buttons, alerts
   * - Known contrast exceptions: none
   * - Axe rules: color-contrast
   * ```
   */
  async toHaveReadableContrast(page: Page, options?: A11yScanOptions) {
    return axePresetResult(page, axeRulePresets.contrast, options)
  },

  /**
   * @testcase
   * ```md
   * @assertion toHaveValidDocumentSemantics
   * - Route: `/path`
   * - Expected page title: text or pattern
   * - Expected html lang: `en` | `vi` | `ja`
   * - Expected h1: page heading text
   * - Expected landmarks: main, navigation if present
   * - Axe rules: document-title, html-has-lang, html-lang-valid, landmark-one-main, page-has-heading-one, heading-order, duplicate-id
   * ```
   */
  async toHaveValidDocumentSemantics(page: Page, options?: A11yScanOptions) {
    return axePresetResult(page, axeRulePresets.document, options)
  },

  /**
   * @testcase
   * ```md
   * @assertion toMatchDesignToken
   * - Component test id: `{module}-primary-btn`
   * - Component kind: shadcn Button | Input | Card | Dialog | Table
   * - Theme scope: :root | .dark | .tailwind-admin-theme
   * - Expected tokens: backgroundColor=color.primary, color=color.primaryForeground, borderRadius=radius.md
   * - State: default | hover | focus | disabled
   * - Expected: computed style resolves to the configured shadcn token values
   * ```
   */
  async toMatchDesignToken(locator: Locator, expectation: DesignTokenExpectation) {
    return issueResult(await findDesignTokenIssues(locator, expectation), 'Design tokens match')
  },

  /**
   * @testcase
   * ```md
   * @assertion toMatchShadcnButtonToken
   * - Button test id: `{module}-submit-btn`
   * - Variant: default | destructive | outline | secondary | ghost | link
   * - Size: default | sm | lg | icon
   * - States to verify: default, focus, disabled
   * - Theme scope: :root | .dark | .tailwind-admin-theme
   * - Expected: variant colors, radius, focus ring and disabled style match shadcn tokens
   * ```
   */
  async toMatchShadcnButtonToken(locator: Locator, options?: { variant?: string }) {
    return issueResult(await findDesignTokenIssues(locator, buttonTokenExpectation(options?.variant)), 'Button tokens match')
  },

  /**
   * @testcase
   * ```md
   * @assertion toMatchShadcnControlToken
   * - Control test id: `{module}-{field}-input`
   * - Control kind: input | textarea | select-trigger
   * - States to verify: default, focus, disabled, invalid
   * - Placeholder expected: true | false
   * - Theme scope: :root | .dark | .tailwind-admin-theme
   * - Expected: border/input/ring/radius/placeholder tokens match shadcn control style
   * ```
   */
  async toMatchShadcnControlToken(locator: Locator) {
    return issueResult(await findDesignTokenIssues(locator, controlTokenExpectation()), 'Control tokens match')
  },

  /**
   * @testcase
   * ```md
   * @assertion toMatchShadcnSurfaceToken
   * - Surface test id: `{module}-dialog`
   * - Surface kind: card | dialog | popover | sheet
   * - Open state setup: describe click/action needed before assertion
   * - Theme scope: :root | .dark | .tailwind-admin-theme
   * - Expected: background/text/border/radius tokens match shadcn surface style
   * ```
   */
  async toMatchShadcnSurfaceToken(locator: Locator, options?: { surface?: 'card' | 'dialog' | 'popover' | 'sheet' }) {
    return issueResult(await findDesignTokenIssues(locator, surfaceTokenExpectation(options?.surface)), 'Surface tokens match')
  },

  /**
   * @testcase
   * ```md
   * @assertion toMatchShadcnTableToken
   * - Table test id: `{module}-table`
   * - Header variant: default | muted
   * - Row states to verify: default, hover, selected
   * - Theme scope: :root | .dark | .tailwind-admin-theme
   * - Expected: row borders, header text and selected/hover backgrounds match shadcn table tokens
   * ```
   */
  async toMatchShadcnTableToken(locator: Locator) {
    return issueResult(await findShadcnTableTokenIssues(locator), 'Table tokens match')
  }
})

async function axePresetResult(
  page: Page,
  rules: readonly string[],
  options: A11yScanOptions = {}
) {
  const results = await scanA11y(page, undefined, { ...options, rules: [...rules] })
  const pass = results.violations.length === 0
  return {
    pass,
    message: () => formatA11yViolations(results)
  }
}

function issueResult(issues: UiIssue[], passMessage: string) {
  const pass = issues.length === 0
  return {
    pass,
    message: () => formatIssues(passMessage, issues)
  }
}

export { waitForSemanticUiReady } from '../helpers/semantic-ui/renderReady'
