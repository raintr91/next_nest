import { expect, test, waitForSemanticUiReady } from '../fixtures/semantic-ui'
import { scanA11y } from '../helpers/semantic-ui/accessibility'
import { findBrokenImageIssues, findHorizontalScrollIssues } from '../helpers/semantic-ui/assets'
import { findDesignTokenIssues } from '../helpers/semantic-ui/designTokens'
import { findAlignedGridIssues } from '../helpers/semantic-ui/grid'
import { findElementOverlapIssues } from '../helpers/semantic-ui/layout'
import { filterRuntimeIssues } from '../helpers/semantic-ui/runtime'
import { findTableLayoutIssues } from '../helpers/semantic-ui/table'
import { findTextOverflowIssues } from '../helpers/semantic-ui/textOverflow'

test.describe('Semantic UI helper contracts', () => {
  test('waitForSemanticUiReady waits for visible and hidden test ids', async ({ page }) => {
    await page.setContent(`
      <main data-testid="demo-page">
        <div data-testid="demo-loading" hidden>Loading</div>
        <button data-testid="demo-submit-btn">Submit</button>
      </main>
    `)

    await waitForSemanticUiReady(page, {
      rootTestId: 'demo-page',
      waitForTestIds: ['demo-submit-btn'],
      waitForHiddenTestIds: ['demo-loading'],
      waitForStableBoundingBoxes: true
    })
  })

  test('detects horizontal scroll and broken images', async ({ page }) => {
    await page.setContent(`
      <main data-testid="demo-page" style="width: 100px">
        <div data-testid="wide-content" style="width: 200px">wide</div>
        <img data-testid="broken-image" src="/missing-image.png" style="width: 16px; height: 16px">
      </main>
    `)

    await expect.poll(async () => (await findBrokenImageIssues(page, { includeHidden: true })).length).toBeGreaterThan(0)
    await expect.poll(async () => (await findHorizontalScrollIssues(page, { rootSelector: '[data-testid="demo-page"]' })).length).toBeGreaterThan(0)
  })

  test('allows valid image and no horizontal scroll', async ({ page }) => {
    await page.setContent(`
      <main data-testid="demo-page" style="width: 100px; overflow-x: hidden">
        <img
          data-testid="valid-image"
          alt="dot"
          src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1' height='1'%3E%3C/svg%3E"
        >
      </main>
    `)

    await waitForSemanticUiReady(page, { rootTestId: 'demo-page', waitForImages: 'visible' })
    await expect(await findBrokenImageIssues(page)).toEqual([])
  })

  test('detects text overflow and respects allowed truncation', async ({ page }) => {
    await page.setContent(`
      <main data-testid="demo-page">
        <p data-testid="overflow-text" style="width: 40px; white-space: nowrap">This text is too long</p>
        <p data-testid="allowed-text" data-overflow-allowed="true" style="width: 40px; white-space: nowrap">This text is too long</p>
      </main>
    `)

    const strictIssues = await findTextOverflowIssues(page.getByTestId('demo-page'))
    const allowedIssues = await findTextOverflowIssues(page.getByTestId('demo-page'), { allowTruncate: true })

    expect(strictIssues.some((issue) => issue.testId === 'overflow-text')).toBe(true)
    expect(allowedIssues.some((issue) => issue.testId === 'allowed-text')).toBe(false)
  })

  test('detects overlap while ignoring parent child layout', async ({ page }) => {
    await page.setContent(`
      <main data-testid="demo-page" style="position: relative; height: 120px">
        <section data-testid="parent" style="position: relative; width: 80px; height: 80px">
          <button data-testid="child">Child</button>
        </section>
        <button data-testid="overlap-a" style="position: absolute; left: 0; top: 0; width: 80px; height: 40px">A</button>
        <button data-testid="overlap-b" style="position: absolute; left: 10px; top: 10px; width: 80px; height: 40px">B</button>
      </main>
    `)

    const issues = await findElementOverlapIssues(page.getByTestId('demo-page'))

    expect(issues.some((issue) => issue.testId === 'parent' && issue.message.includes('child'))).toBe(false)
    expect(issues.some((issue) => issue.testId === 'overlap-a')).toBe(true)
  })

  test('detects invalid table layout and accepts valid table', async ({ page }) => {
    await page.setContent(`
      <table data-testid="invalid-table">
        <thead><tr><th>Name</th><th>Status</th></tr></thead>
        <tbody><tr><td>Only name</td></tr></tbody>
      </table>
      <table data-testid="valid-table">
        <thead><tr><th>Name</th><th>Status</th></tr></thead>
        <tbody><tr><td>Hotel</td><td>Active</td></tr></tbody>
      </table>
    `)

    expect(await findTableLayoutIssues(page.getByTestId('invalid-table'))).not.toEqual([])
    expect(await findTableLayoutIssues(page.getByTestId('valid-table'))).toEqual([])
  })

  test('detects misaligned grid items', async ({ page }) => {
    await page.setContent(`
      <main data-testid="grid-root">
        <div data-testid="grid-card" style="position:absolute; left: 0; top: 0; width: 50px; height: 20px"></div>
        <div data-testid="grid-card" style="position:absolute; left: 60px; top: 8px; width: 50px; height: 20px"></div>
      </main>
    `)

    const issues = await findAlignedGridIssues(page.getByTestId('grid-root'), {
      itemSelector: '[data-testid="grid-card"]',
      columns: 2,
      rowTolerance: 2
    })

    expect(issues).not.toEqual([])
  })

  test('detects design token mismatch', async ({ page }) => {
    await page.setContent(`
      <style>
        :root {
          --primary: 53 98% 45%;
          --primary-foreground: 220 17% 10%;
          --radius: 8px;
        }
      </style>
      <button data-testid="wrong-token" style="background: rgb(255, 0, 0); color: black; border-radius: 6px">Save</button>
    `)

    const issues = await findDesignTokenIssues(page.getByTestId('wrong-token'), {
      backgroundColor: 'color.primary',
      color: 'color.primaryForeground'
    })

    expect(issues.length).toBeGreaterThan(0)
  })

  test('detects axe accessible name violations', async ({ page }, testInfo) => {
    await page.setContent('<main data-testid="a11y-page"><button></button><input></main>')

    const results = await scanA11y(page, testInfo, {
      include: '[data-testid="a11y-page"]',
      rules: ['button-name', 'label']
    })

    expect(results.violations.map((violation) => violation.id)).toEqual(expect.arrayContaining(['button-name', 'label']))
  })

  test('semanticUi fixture asserts axe presets with report attachment', async ({ page, semanticUi }) => {
    await page.setContent(`
      <main data-testid="a11y-valid-page">
        <button>Save</button>
        <label for="name">Name</label>
        <input id="name">
      </main>
    `)

    await semanticUi.expectValidAccessibleNames(page, {
      include: '[data-testid="a11y-valid-page"]'
    })
  })

  test('filters allowed runtime issues', async () => {
    const filtered = filterRuntimeIssues([
      { source: 'response', status: 422, message: 'HTTP 422', url: '/api/form', resourceType: 'xhr' },
      { source: 'console', message: 'real error' }
    ], {
      ignoreStatusCodes: [422]
    })

    expect(filtered).toEqual([{ source: 'console', message: 'real error' }])
  })
})
