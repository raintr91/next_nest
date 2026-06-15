import { expect, test } from '@playwright/test'

import { clearSession, mockAuthenticatedApi, mockAuthenticatedSession } from './helpers/session'

test.describe('Auth guard', () => {
  test.beforeEach(async ({ context }) => {
    await clearSession(context)
  })

  test('redirects / to auth when unauthenticated', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL(/\/auth/)
  })

  test('redirects arbitrary protected route to auth when unauthenticated', async ({ page }) => {
    await page.goto('/some-protected-route')
    await expect(page).toHaveURL(/\/auth\/login/)
  })

  test('/auth/login is publicly accessible without authentication', async ({ page }) => {
    await page.goto('/auth/login')
    await expect(page).toHaveURL(/\/auth\/login/)
    await expect(page.getByTestId('auth-login-email-input')).toBeVisible()
  })

  test('/auth route is publicly accessible without authentication', async ({ page }) => {
    await page.goto('/auth')
    await expect(page).toHaveURL(/\/auth/)
  })

  test('authenticated user can access protected route without redirect', async ({ page }) => {
    await mockAuthenticatedSession(page)
    await mockAuthenticatedApi(page)
    await page.goto('/')
    await expect(page).not.toHaveURL(/\/auth\/login/)
    await expect(page).toHaveURL('/')
  })
})
