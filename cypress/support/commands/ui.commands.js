/**
 * Custom Commands — Camada de UI
 *
 * Comandos que abstraem interações comuns de interface,
 * reduzindo repetição nos testes E2E.
 */

/**
 * Navega para rota da aplicação front-end
 * @example cy.visitFront('/login')
 */
Cypress.Commands.add('visitFront', (path = '/login') => {
  cy.visit(`${Cypress.env('frontUrl')}${path}`)
})

/**
 * Realiza login completo pela interface
 * @example cy.loginUI(email, password)
 */
Cypress.Commands.add('loginUI', (email, password) => {
  cy.get('[data-testid="email"]').clear().type(email)
  cy.get('[data-testid="senha"]').clear().type(password)
  cy.get('[data-testid="entrar"]').click()
})

/**
 * Realiza login via API e navega para home (mais rápido que login via UI)
 * Ideal para testes que não validam o fluxo de login em si.
 * @example cy.loginViaApiENavegar(email, password)
 */
Cypress.Commands.add('loginViaApiENavegar', (email, password) => {
  cy.request({
    method: 'POST',
    url: '/login',
    body: { email, password },
  }).then(({ body }) => {
    Cypress.env('token', body.authorization)
    window.localStorage.setItem('serverest/userEmail', email)
    cy.visitFront('/home')
  })
})

/**
 * Seleciona elemento por data-testid (atalho semântico)
 * @example cy.getByTestId('email').type('user@test.com')
 */
Cypress.Commands.add('getByTestId', (testId) => {
  return cy.get(`[data-testid="${testId}"]`)
})

/**
 * Verifica mensagem de alerta Bootstrap visível
 * @example cy.assertAlert('Email e/ou senha inválidos')
 */
Cypress.Commands.add('assertAlert', (message) => {
  cy.get('.alert').should('be.visible').and('contain.text', message)
})

/**
 * Verifica mensagem de erro de validação de campo (span)
 * @example cy.assertFieldError('Email é obrigatório')
 */
Cypress.Commands.add('assertFieldError', (message) => {
  cy.get('span').should('contain.text', message)
})
