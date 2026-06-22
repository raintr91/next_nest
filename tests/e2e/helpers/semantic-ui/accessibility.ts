import AxeBuilder from '@axe-core/playwright'
import type { AxeResults, Result } from 'axe-core'
import type { Page, TestInfo } from '@playwright/test'

export type A11yScanOptions = {
  include?: string
  exclude?: string[]
  tags?: string[]
  rules?: string[]
  disableRules?: string[]
}

export const axeRulePresets = {
  accessibleNames: ['button-name', 'link-name', 'aria-input-field-name', 'select-name', 'label'],
  aria: ['aria-allowed-attr', 'aria-valid-attr', 'aria-valid-attr-value', 'aria-required-attr', 'aria-roles', 'aria-hidden-focus'],
  media: ['image-alt', 'input-image-alt', 'svg-img-alt', 'object-alt'],
  contrast: ['color-contrast'],
  document: ['document-title', 'html-has-lang', 'html-lang-valid', 'landmark-one-main', 'page-has-heading-one', 'heading-order', 'duplicate-id']
} as const

/**
 * @testcase
 * ```md
 * @assertion scanA11y
 * - Include selector: `[data-testid="{module}-page"]`
 * - Exclude selectors: none
 * - WCAG tags: wcag2a, wcag2aa, wcag21a, wcag21aa
 * - Specific axe rules: use only when testing a preset
 * - Disabled axe rules with reason: none
 * - Attach full scan result: true
 * - Expected: result shape has violations/incomplete arrays and zero violations for strict assertions
 * ```
 */
export async function scanA11y(
  page: Page,
  testInfo?: TestInfo,
  options: A11yScanOptions = {}
) {
  let builder = new AxeBuilder({ page })

  if (options.rules?.length) {
    builder = builder.withRules([...options.rules])
  } else {
    builder = builder.withTags(options.tags ?? ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
  }

  if (options.include) builder = builder.include(options.include)
  for (const selector of options.exclude ?? []) builder = builder.exclude(selector)
  if (options.disableRules?.length) builder = builder.disableRules(options.disableRules)

  const results = await builder.analyze()

  if (testInfo) {
    await testInfo.attach('accessibility-scan-results', {
      body: JSON.stringify(results, null, 2),
      contentType: 'application/json'
    })
  }

  return results
}

export function formatA11yViolations(results: Pick<AxeResults, 'violations'>) {
  if (results.violations.length === 0) return 'No accessibility violations'

  return results.violations.map(formatViolation).join('\n')
}

function formatViolation(violation: Result, index: number) {
  const targets = violation.nodes
    .flatMap((node) => node.target)
    .slice(0, 5)
    .join(', ')

  return `${index + 1}. [${violation.id}] ${violation.help} — ${targets}`
}
