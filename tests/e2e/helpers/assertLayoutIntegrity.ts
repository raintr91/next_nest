import type { Page } from '@playwright/test'
import { expect } from '@playwright/test'

import { findHorizontalScrollIssues, formatIssues, type UiIssue } from './semantic-ui/assets'
import { findElementOverlapIssues } from './semantic-ui/layout'
import { findTextOverflowIssues } from './semantic-ui/textOverflow'
import type { LayoutIntegrityOptions } from './layoutIntegrity'

export type { LayoutIntegrityOptions, LayoutIssue } from './layoutIntegrity'
export { formatLayoutIssues, resolveLayoutIntegrityOptions } from './layoutIntegrity'

export async function assertLayoutIntegrity(
  page: Page,
  options: LayoutIntegrityOptions = {}
) {
  const rootSelector = options.rootSelector ?? 'body'
  const root = page.locator(rootSelector).first()
  const issues: UiIssue[] = [
    ...await findHorizontalScrollIssues(page, {
      rootSelector,
      tolerance: options.overflowTolerance
    }),
    ...await findTextOverflowIssues(root, {
      selector: options.selector,
      tolerance: options.overflowTolerance,
      excludeTestIds: options.skipTestIds
    }),
    ...(options.skipOverlap
      ? []
      : await findElementOverlapIssues(root, {
          selector: options.selector,
          minIntersectionArea: options.minOverlapArea,
          excludeTestIds: options.skipTestIds
        }))
  ]

  expect(issues, formatIssues('No layout issues', issues)).toEqual([])
}
