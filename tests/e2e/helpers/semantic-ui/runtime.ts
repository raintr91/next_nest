import type { Page } from '@playwright/test'

export type RuntimeIssueSource = 'console' | 'pageerror' | 'requestfailed' | 'response'

export type RuntimeIssue = {
  source: RuntimeIssueSource
  message: string
  url?: string
  status?: number
  resourceType?: string
}

export type RuntimeIssueOptions = {
  ignorePatterns?: RegExp[]
  ignoreUrls?: RegExp[]
  ignoreStatusCodes?: number[]
  includeResourceTypes?: string[]
  failOnHttpStatus?: boolean
}

export function collectRuntimeIssues(page: Page) {
  const issues: RuntimeIssue[] = []

  page.on('console', (message) => {
    if (message.type() === 'error') {
      issues.push({ source: 'console', message: message.text() })
    }
  })

  page.on('pageerror', (error) => {
    issues.push({ source: 'pageerror', message: error.message })
  })

  page.on('requestfailed', (request) => {
    issues.push({
      source: 'requestfailed',
      message: request.failure()?.errorText ?? 'request failed',
      url: request.url(),
      resourceType: request.resourceType()
    })
  })

  page.on('response', (response) => {
    if (response.status() < 400) return

    const request = response.request()
    issues.push({
      source: 'response',
      message: `HTTP ${response.status()}`,
      url: response.url(),
      status: response.status(),
      resourceType: request.resourceType()
    })
  })

  return issues
}

export function filterRuntimeIssues(
  issues: RuntimeIssue[],
  options: RuntimeIssueOptions = {}
) {
  const failOnHttpStatus = options.failOnHttpStatus ?? true
  const ignoredStatuses = new Set(options.ignoreStatusCodes ?? [])
  const resourceTypes = new Set(options.includeResourceTypes ?? [])

  return issues.filter((issue) => {
    if (!failOnHttpStatus && issue.source === 'response') return false
    if (issue.status && ignoredStatuses.has(issue.status)) return false
    if (resourceTypes.size > 0 && issue.resourceType && !resourceTypes.has(issue.resourceType)) return false
    if (options.ignoreUrls?.some((pattern) => pattern.test(issue.url ?? ''))) return false
    if (options.ignorePatterns?.some((pattern) => pattern.test(issue.message))) return false
    return true
  })
}

export function formatRuntimeIssues(issues: RuntimeIssue[]) {
  if (issues.length === 0) return 'No runtime issues'

  return issues
    .map((issue, index) => {
      const meta = [
        issue.resourceType,
        issue.status ? `status=${issue.status}` : null,
        issue.url
      ].filter(Boolean).join(' ')

      return `${index + 1}. [${issue.source}] ${issue.message}${meta ? ` — ${meta}` : ''}`
    })
    .join('\n')
}
