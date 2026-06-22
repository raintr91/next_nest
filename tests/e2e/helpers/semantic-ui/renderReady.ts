import type { Page } from '@playwright/test'
import { expect } from '@playwright/test'

export type SemanticUiReadyOptions = {
  rootTestId?: string
  waitForTestIds?: string[]
  waitForAttachedTestIds?: string[]
  waitForHiddenTestIds?: string[]
  waitForDetachedTestIds?: string[]
  waitForUrl?: string | RegExp
  waitForFonts?: boolean
  waitForImages?: 'none' | 'visible' | 'all'
  waitForNetworkIdle?: boolean
  waitForStableBoundingBoxes?: boolean
  timeout?: number
}

/**
 * @testcase
 * ```md
 * @semantic-ready
 * - Root test id: `{module}-page`
 * - Wait visible test ids: `{module}-table`, `{module}-primary-action-btn`
 * - Wait fonts: true
 * - Wait images: visible
 * - Loading indicators that must disappear: `{module}-loading`
 * - Stable bounding boxes: true for layout assertions
 * - Network idle required: false
 * ```
 */
export async function waitForSemanticUiReady(
  page: Page,
  options: SemanticUiReadyOptions = {}
) {
  const timeout = options.timeout ?? 10_000

  await page.waitForLoadState('domcontentloaded', { timeout })

  if (options.waitForUrl) {
    await page.waitForURL(options.waitForUrl, { timeout })
  }

  if (options.waitForNetworkIdle) {
    await page.waitForLoadState('networkidle', { timeout })
  }

  if (options.rootTestId) {
    await expect(page.getByTestId(options.rootTestId)).toBeVisible({ timeout })
  }

  for (const testId of options.waitForTestIds ?? []) {
    await expect(page.getByTestId(testId)).toBeVisible({ timeout })
  }

  for (const testId of options.waitForAttachedTestIds ?? []) {
    await expect(page.getByTestId(testId)).toBeAttached({ timeout })
  }

  for (const testId of options.waitForHiddenTestIds ?? []) {
    await expect(page.getByTestId(testId)).toBeHidden({ timeout })
  }

  for (const testId of options.waitForDetachedTestIds ?? []) {
    await expect(page.getByTestId(testId)).not.toBeAttached({ timeout })
  }

  if (options.waitForFonts) {
    await page.evaluate(async () => {
      if ('fonts' in document) await document.fonts.ready
    })
  }

  if (options.waitForImages && options.waitForImages !== 'none') {
    await waitForImages(page, options.waitForImages, timeout)
  }

  if (options.waitForStableBoundingBoxes) {
    await waitForStableBoundingBoxes(page, timeout)
  }
}

async function waitForImages(
  page: Page,
  mode: Exclude<SemanticUiReadyOptions['waitForImages'], undefined | 'none'>,
  timeout: number
) {
  await page.waitForFunction(
    (imageMode) => {
      const images = Array.from(document.images)
      const targets = imageMode === 'visible'
        ? images.filter((image) => {
            const style = window.getComputedStyle(image)
            if (style.display === 'none' || style.visibility === 'hidden') return false

            const rect = image.getBoundingClientRect()
            return rect.width > 0 && rect.height > 0
          })
        : images

      return targets.every((image) => image.complete)
    },
    mode,
    { timeout }
  )
}

async function waitForStableBoundingBoxes(page: Page, timeout: number) {
  await page.waitForFunction(
    () => new Promise<boolean>((resolve) => {
      const before = snapshotRects()
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          resolve(before === snapshotRects())
        })
      })

      function snapshotRects() {
        return Array.from(document.querySelectorAll('[data-testid]'))
          .filter((el): el is HTMLElement => el instanceof HTMLElement)
          .map((el) => {
            const rect = el.getBoundingClientRect()
            return [
              el.dataset.testid,
              Math.round(rect.left),
              Math.round(rect.top),
              Math.round(rect.width),
              Math.round(rect.height)
            ].join(':')
          })
          .join('|')
      }
    }),
    undefined,
    { timeout }
  )
}
