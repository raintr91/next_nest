import type { Response } from '@playwright/test'
import { expect } from '@playwright/test'

import { resolvePlaceholder } from './testcaseData'
import { urlMatchesApiPath } from './applyTestcaseMocks'

export type NetworkAssertion = {
  method: string
  path: string
  bodyContains?: Record<string, string>
}

export function whenNetworkRequest(page: Page, assertion: NetworkAssertion) {
  const method = assertion.method.toUpperCase()

  return page.waitForResponse((response) => {
    const request = response.request()
    if (request.method() !== method) return false
    return urlMatchesApiPath(response.url(), assertion.path)
  })
}

export async function assertRequestMatches(
  response: Response,
  assertion: NetworkAssertion,
  data: Record<string, string> = {}
) {
  if (!assertion.bodyContains) return

  const body = response.request().postDataJSON() as Record<string, unknown>
  for (const [key, expected] of Object.entries(assertion.bodyContains)) {
    const resolved = resolvePlaceholder(expected, data)
    expect(String(body[key])).toBe(resolved)
  }
}

export async function expectNewTabWithUrl(
  page: Page,
  action: () => Promise<void>,
  urlContains: string
) {
  const newPagePromise = page.context().waitForEvent('page')
  await action()
  const newPage = await newPagePromise
  await newPage.waitForLoadState('domcontentloaded')
  expect(newPage.url()).toContain(urlContains)
}
