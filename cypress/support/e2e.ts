/// <reference types="cypress" />

Cypress.Commands.add(
  'getByTestId',
  (testId: string, options?: Partial<Cypress.Loggable & Cypress.Timeoutable & Cypress.Shadow>) => {
    return cy.get(`[data-testid="${testId}"]`, options)
  }
)

declare global {
  namespace Cypress {
    interface Chainable {
      getByTestId(testId: string, options?: Partial<Cypress.Loggable & Cypress.Timeoutable & Cypress.Shadow>): Chainable<JQuery<HTMLElement>>
    }
  }
}

export {}
