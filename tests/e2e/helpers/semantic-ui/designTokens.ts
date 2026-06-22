import type { Locator } from '@playwright/test'

import type { UiIssue } from './assets'

export type DesignTokenExpectation = {
  color?: string
  backgroundColor?: string
  borderColor?: string
  borderRadius?: string
}

export const shadcnTokenExpressions = {
  'color.background': 'hsl(var(--background))',
  'color.foreground': 'hsl(var(--foreground))',
  'color.card': 'hsl(var(--card))',
  'color.cardForeground': 'hsl(var(--card-foreground))',
  'color.primary': 'hsl(var(--primary))',
  'color.primaryForeground': 'hsl(var(--primary-foreground))',
  'color.secondary': 'hsl(var(--secondary))',
  'color.secondaryForeground': 'hsl(var(--secondary-foreground))',
  'color.muted': 'hsl(var(--muted))',
  'color.mutedForeground': 'hsl(var(--muted-foreground))',
  'color.accent': 'hsl(var(--accent))',
  'color.accentForeground': 'hsl(var(--accent-foreground))',
  'color.destructive': 'hsl(var(--destructive))',
  'color.destructiveForeground': 'hsl(var(--destructive-foreground))',
  'color.border': 'hsl(var(--border))',
  'color.input': 'hsl(var(--input))',
  'color.ring': 'hsl(var(--ring))',
  'radius.lg': 'var(--radius)',
  'radius.md': 'calc(var(--radius) - 2px)',
  'radius.sm': 'calc(var(--radius) - 4px)'
} as const

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
export async function findDesignTokenIssues(
  locator: Locator,
  expectation: DesignTokenExpectation
) {
  return locator.evaluate((el, payload) => {
    const { expected, tokenMap } = payload
    if (!(el instanceof HTMLElement)) return []

    const styles = window.getComputedStyle(el)
    const checks = [
      ['color', 'color', expected.color],
      ['backgroundColor', 'background-color', expected.backgroundColor],
      ['borderColor', 'border-color', expected.borderColor],
      ['borderRadius', 'border-radius', expected.borderRadius]
    ] as const

    return checks.flatMap(([styleKey, cssProp, token]) => {
      if (!token) return []

      const expectedValue = resolveToken(el, cssProp, token)
      const actualValue = styles[styleKey]
      if (actualValue === expectedValue) return []

      return [{
        testId: el.dataset.testid ?? null,
        tag: el.tagName.toLowerCase(),
        message: `${styleKey} expected ${token} (${expectedValue}) but received ${actualValue}`
      }]
    }) satisfies UiIssue[]

    function resolveToken(target: HTMLElement, cssProp: string, token: string) {
      const expression = tokenMap[token] ?? token
      const probe = document.createElement('span')
      probe.style.setProperty(cssProp, expression)
      probe.style.position = 'absolute'
      probe.style.visibility = 'hidden'
      ;(target.parentElement ?? document.body).append(probe)
      const value = window.getComputedStyle(probe).getPropertyValue(cssProp)
      probe.remove()
      return value
    }
  }, { expected: expectation, tokenMap: shadcnTokenExpressions as Record<string, string> })
}

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
export function buttonTokenExpectation(variant = 'default'): DesignTokenExpectation {
  if (variant === 'destructive') {
    return { backgroundColor: 'color.destructive', color: 'color.destructiveForeground', borderRadius: 'radius.md' }
  }

  if (variant === 'secondary') {
    return { backgroundColor: 'color.secondary', color: 'color.secondaryForeground', borderRadius: 'radius.md' }
  }

  return { backgroundColor: 'color.primary', color: 'color.primaryForeground', borderRadius: 'radius.md' }
}

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
export function controlTokenExpectation(): DesignTokenExpectation {
  return { borderColor: 'color.input', borderRadius: 'radius.md' }
}

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
export function surfaceTokenExpectation(surface: 'card' | 'dialog' | 'popover' | 'sheet' = 'card') {
  const radius = surface === 'card' ? 'radius.lg' : 'radius.lg'
  return { backgroundColor: 'color.background', color: 'color.foreground', borderColor: 'color.border', borderRadius: radius }
}

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
export async function findShadcnTableTokenIssues(locator: Locator) {
  return locator.evaluate((root, payload) => {
    const { tokenMap } = payload
    const table = root.matches('table') ? root : root.querySelector('table')
    if (!(table instanceof HTMLElement)) return []

    const cell = table.querySelector('th, td')
    if (!(cell instanceof HTMLElement)) return []

    const expectedBorder = resolveToken(cell, 'border-color', 'color.border')
    const actualBorder = window.getComputedStyle(cell).borderBottomColor
    if (actualBorder === expectedBorder) return []

    return [{
      testId: cell.dataset.testid ?? table.dataset.testid ?? null,
      tag: cell.tagName.toLowerCase(),
      message: `table cell border expected color.border (${expectedBorder}) but received ${actualBorder}`
    }] satisfies UiIssue[]

    function resolveToken(target: HTMLElement, cssProp: string, token: string) {
      const expression = tokenMap[token] ?? token
      const probe = document.createElement('span')
      probe.style.setProperty(cssProp, expression)
      probe.style.position = 'absolute'
      probe.style.visibility = 'hidden'
      ;(target.parentElement ?? document.body).append(probe)
      const value = window.getComputedStyle(probe).getPropertyValue(cssProp)
      probe.remove()
      return value
    }
  }, { tokenMap: shadcnTokenExpressions as Record<string, string> })
}
