type ApiEnvelope<T> = {
  success: true
  code: number
  message: string
  data: T
  meta: null
  trace_id: null
}

export function success<T>(data: T, message = 'OK'): ApiEnvelope<T> {
  return {
    success: true,
    code: 200,
    message,
    data,
    meta: null,
    trace_id: null
  }
}

export function mockAuthenticatedSession() {
  const authUser = encodeURIComponent(JSON.stringify({
    id: 1,
    name: 'User',
    full_name: 'Portal User',
    email: 'user@example.com',
    role: 'USER',
    active: true,
    status: 1
  }))

  cy.setCookie('auth_token', 'fake-token')
  cy.setCookie('auth_user', authUser)
  cy.intercept('GET', '**/api/auth/me*', {
    statusCode: 200,
    body: success({
      id: 1,
      name: 'User',
      full_name: 'Portal User',
      email: 'user@example.com',
      role: 'USER',
      active: true,
      status: 1
    })
  }).as('authMe')
  cy.intercept('POST', '**/api/internal/client-error', {
    statusCode: 200,
    body: { ok: true }
  })
}
