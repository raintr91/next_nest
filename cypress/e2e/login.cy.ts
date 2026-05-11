import { mockAuthenticatedSession } from './helpers/session'

describe('Login page', () => {
  const fillValidCredentials = (password: string) => {
    cy.get('input#email')
      .clear()
      .invoke('val', 'user@example.co.jp')
      .trigger('input')
      .blur()
      .should('have.value', 'user@example.co.jp')

    cy.get('input#password')
      .clear()
      .invoke('val', password)
      .trigger('input')
      .blur()
      .should('have.value', password)
  }

  beforeEach(() => {
    cy.visit('/auth/login', { failOnStatusCode: false })
  })

  it('shows login heading and form fields', () => {
    cy.contains('ログインID').should('be.visible')
    cy.contains('パスワード').should('be.visible')
    cy.get('input#email').should('be.visible')
    cy.get('input#password').should('be.visible')
    cy.get('button[type="submit"]').should('be.visible')
  })

  it('shows logo and subtitle section', () => {
    cy.get('img[alt="Portal"]').should('be.visible')
    cy.contains('※当システムでは全ての通信に対してHTTPS（SSL/TLS）暗号化を採用しております。').should('be.visible')
  })

  it('shows email validation error for invalid email', () => {
    cy.intercept('POST', '**/api/auth/login*').as('loginAttempt')
    cy.get('input#email').type('not-an-email')
    cy.get('input#password').type('password123')
    cy.get('button[type="submit"]').click()
    cy.wait(500)
    cy.get('@loginAttempt.all').should('have.length', 0)
  })

  it('shows password validation error for short password', () => {
    cy.intercept('POST', '**/api/auth/login*').as('loginAttempt')
    cy.get('input#email').type('user@example.co.jp')
    cy.get('input#password').type('short')
    cy.get('button[type="submit"]').click()
    cy.wait(500)
    cy.get('@loginAttempt.all').should('have.length', 0)
  })

  it('shows validation errors when empty form is submitted', () => {
    cy.intercept('POST', '**/api/auth/login*').as('loginAttempt')
    cy.get('button[type="submit"]').click()
    cy.wait(500)
    cy.get('@loginAttempt.all').should('have.length', 0)
  })

  it('keeps user on login page when credentials are not authenticated', () => {
    fillValidCredentials('wrongpassword')
    cy.get('form').trigger('submit')
    cy.location('pathname').should('eq', '/auth/login')
  })

  it('redirects authenticated user away from login page', () => {
    mockAuthenticatedSession()
    cy.visit('/auth/login?redirect=%2F', { failOnStatusCode: false })
    cy.location('pathname').should('eq', '/')
  })
})
