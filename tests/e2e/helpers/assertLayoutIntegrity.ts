import type { Page } from '@playwright/test'
import { expect } from '@playwright/test'

import {
  checkLayout,
  formatLayoutIssues,
  type LayoutIntegrityOptions
} from './layoutIntegrity'

export type { LayoutIntegrityOptions, LayoutIssue } from './layoutIntegrity'
export { formatLayoutIssues, resolveLayoutIntegrityOptions } from './layoutIntegrity'

export async function assertLayoutIntegrity(
  page: Page,
  options: LayoutIntegrityOptions = {}
) {
  const issues = await page.evaluate(checkLayout, options)
  expect(issues, formatLayoutIssues(issues)).toEqual([])
}
