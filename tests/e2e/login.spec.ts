import { expect, test } from '@playwright/test'

import { assertLayoutIntegrity } from './helpers/assertLayoutIntegrity'
import { mockAuthenticatedSession } from './helpers/session'

test.describe('Login page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/login')
  })

  test('shows login form fields', async ({ page }) => {
    await expect(page.getByTestId('auth-login-page')).toBeVisible()
    await expect(page.getByTestId('auth-login-email-input')).toBeVisible()
    await expect(page.getByTestId('auth-login-password-input')).toBeVisible()
    await expect(page.getByTestId('auth-login-submit-btn')).toBeVisible()
    await assertLayoutIntegrity(page)
  })

  test('shows logo and subtitle section', async ({ page }) => {
    await expect(page.getByTestId('auth-login-logo')).toBeVisible()
    await expect(page.getByTestId('auth-login-subtitle')).toBeVisible()
  })

  test('shows email validation error for invalid email', async ({ page }) => {
    let loginAttempts = 0
    await page.route('**/api/auth/login*', () => {
      loginAttempts += 1
    })

    await page.getByTestId('auth-login-email-input').fill('not-an-email')
    await page.getByTestId('auth-login-password-input').fill('password123')
    await page.getByTestId('auth-login-submit-btn').click()
    await page.waitForTimeout(500)
    expect(loginAttempts).toBe(0)
  })

  test('shows password validation error for short password', async ({ page }) => {
    let loginAttempts = 0
    await page.route('**/api/auth/login*', () => {
      loginAttempts += 1
    })

    await page.getByTestId('auth-login-email-input').fill('user@example.co.jp')
    await page.getByTestId('auth-login-password-input').fill('short')
    await page.getByTestId('auth-login-submit-btn').click()
    await page.waitForTimeout(500)
    expect(loginAttempts).toBe(0)
  })

  test('shows validation errors when empty form is submitted', async ({ page }) => {
    let loginAttempts = 0
    await page.route('**/api/auth/login*', () => {
      loginAttempts += 1
    })

    await page.getByTestId('auth-login-submit-btn').click()
    await page.waitForTimeout(500)
    expect(loginAttempts).toBe(0)
  })

  test('keeps user on login page when credentials are not authenticated', async ({ page }) => {
    await page.getByTestId('auth-login-email-input').fill('user@example.co.jp')
    await page.getByTestId('auth-login-password-input').fill('wrongpassword')
    await page.getByTestId('auth-login-form').evaluate((form) => (form as HTMLFormElement).requestSubmit())
    await expect(page).toHaveURL(/\/auth\/login/)
  })

  test('redirects authenticated user away from login page', async ({ page }) => {
    await mockAuthenticatedSession(page)
    await page.goto('/auth/login?redirect=%2F')
    await expect(page).toHaveURL('/')
  })
})
