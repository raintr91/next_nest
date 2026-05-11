import { mockAuthenticatedSession, success } from './helpers/session'

describe('Auth guard', () => {
  beforeEach(() => {
    cy.clearCookies()
  })

  it('redirects / to auth when unauthenticated', () => {
    cy.visit('/', { failOnStatusCode: false })
    cy.url({ timeout: 8000 }).should('include', '/auth')
  })

  it('redirects arbitrary protected route to auth when unauthenticated', () => {
    cy.visit('/some-protected-route', { failOnStatusCode: false })
    cy.url({ timeout: 8000 }).should('include', '/auth/login')
  })

  it('/auth/login is publicly accessible without authentication', () => {
    cy.visit('/auth/login', { failOnStatusCode: false })
    cy.url({ timeout: 8000 }).should('include', '/auth/login')
    cy.get('input#email', { timeout: 8000 }).should('exist')
  })

  it('/auth route is publicly accessible without authentication', () => {
    cy.visit('/auth', { failOnStatusCode: false })
    cy.url({ timeout: 8000 }).should('include', '/auth')
  })

  it('authenticated user can access protected route without redirect', () => {
    mockAuthenticatedSession()
    cy.intercept('**/api/**', (req) => {
      if (req.url.includes('/api/auth/me')) {
        req.reply({
          statusCode: 200,
          body: success({ id: 1, name: 'User', full_name: 'Portal User', email: 'user@example.com', role: 'USER' })
        })
        return
      }

      req.reply({ statusCode: 200, body: success([]) })
    })

    cy.visit('/', { failOnStatusCode: false })
    cy.location('pathname').should('not.include', '/auth/login')
    cy.location('pathname').should('eq', '/')
  })
})
