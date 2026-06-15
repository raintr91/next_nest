import { mockAuthenticatedSession } from './helpers/session'

describe('Login page', () => {
  const fillValidCredentials = (password: string) => {
    cy.getByTestId('auth-login-email-input')
      .clear()
      .invoke('val', 'user@example.co.jp')
      .trigger('input')
      .blur()
      .should('have.value', 'user@example.co.jp')

    cy.getByTestId('auth-login-password-input')
      .clear()
      .invoke('val', password)
      .trigger('input')
      .blur()
      .should('have.value', password)
  }

  beforeEach(() => {
    cy.visit('/auth/login', { failOnStatusCode: false })
  })

  it('shows login form fields', () => {
    cy.getByTestId('auth-login-page').should('be.visible')
    cy.getByTestId('auth-login-email-input').should('be.visible')
    cy.getByTestId('auth-login-password-input').should('be.visible')
    cy.getByTestId('auth-login-submit-btn').should('be.visible')
  })

  it('shows logo and subtitle section', () => {
    cy.getByTestId('auth-login-logo').should('be.visible')
    cy.getByTestId('auth-login-subtitle').should('be.visible')
  })

  it('shows email validation error for invalid email', () => {
    cy.intercept('POST', '**/api/auth/login*').as('loginAttempt')
    cy.getByTestId('auth-login-email-input').type('not-an-email')
    cy.getByTestId('auth-login-password-input').type('password123')
    cy.getByTestId('auth-login-submit-btn').click()
    cy.wait(500)
    cy.get('@loginAttempt.all').should('have.length', 0)
  })

  it('shows password validation error for short password', () => {
    cy.intercept('POST', '**/api/auth/login*').as('loginAttempt')
    cy.getByTestId('auth-login-email-input').type('user@example.co.jp')
    cy.getByTestId('auth-login-password-input').type('short')
    cy.getByTestId('auth-login-submit-btn').click()
    cy.wait(500)
    cy.get('@loginAttempt.all').should('have.length', 0)
  })

  it('shows validation errors when empty form is submitted', () => {
    cy.intercept('POST', '**/api/auth/login*').as('loginAttempt')
    cy.getByTestId('auth-login-submit-btn').click()
    cy.wait(500)
    cy.get('@loginAttempt.all').should('have.length', 0)
  })

  it('keeps user on login page when credentials are not authenticated', () => {
    fillValidCredentials('wrongpassword')
    cy.getByTestId('auth-login-form').trigger('submit')
    cy.location('pathname').should('eq', '/auth/login')
  })

  it('redirects authenticated user away from login page', () => {
    mockAuthenticatedSession()
    cy.visit('/auth/login?redirect=%2F', { failOnStatusCode: false })
    cy.location('pathname').should('eq', '/')
  })
})
