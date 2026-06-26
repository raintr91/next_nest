/**
 * Map prop `testId` → HTML attribute `data-testid` for E2E selectors.
 * Use in shared UI primitives; pages pass stable kebab-case ids (see docs/operational/E2E-TESTIDS.md).
 */
export function testIdAttr(testId?: string): { 'data-testid'?: string } {
  if (!testId) return {}
  return { 'data-testid': testId }
}

/** Suffix helper, e.g. testIdSuffix('auth-login', 'input') → auth-login-input */
export function testIdSuffix(testId: string | undefined, suffix: string): { 'data-testid'?: string } {
  if (!testId) return {}
  return { 'data-testid': `${testId}-${suffix}` }
}
