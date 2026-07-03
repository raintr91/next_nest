/** Resolve `{{placeholder}}` values from testcase `data` for E2E. */
export type TestcaseDataMap = Record<string, string>

const DEFAULT_MANAGER_ID = '101'

export function lastMonthYyyyMm(): string {
  const date = new Date()
  date.setMonth(date.getMonth() - 1)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${date.getFullYear()}-${month}`
}

export function resolveTestcaseData(
  raw: TestcaseDataMap = {},
  overrides: TestcaseDataMap = {}
): TestcaseDataMap {
  const resolved: TestcaseDataMap = {}

  for (const [key, value] of Object.entries({ ...raw, ...overrides })) {
    resolved[key] = resolvePlaceholder(value, overrides)
  }

  return resolved
}

export function resolvePlaceholder(value: string, overrides: TestcaseDataMap = {}): string {
  if (value === '{{last_month_yyyy_mm}}') return lastMonthYyyyMm()
  if (value === '{{manager_id}}') return overrides.manager_id ?? DEFAULT_MANAGER_ID
  if (value.startsWith('{{') && value.endsWith('}}')) {
    const key = value.slice(2, -2)
    if (overrides[key]) return overrides[key]
  }
  return value
}

export function resolveTestIdTemplate(template: string, data: TestcaseDataMap): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => data[key] ?? '')
}
