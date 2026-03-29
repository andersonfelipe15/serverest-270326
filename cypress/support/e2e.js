/**
 * Support File — e2e.js
 *
 * Carregado automaticamente antes de cada spec file.
 * Responsável por importar commands e configurações globais.
 */
import './commands/index'

// ─── Tratamento global de exceções ───────────────────────────────────────────
// Suprime erros não relacionados aos testes (third-party scripts, ResizeObserver, etc.)
Cypress.on('uncaught:exception', (err) => {
  const ignoredErrors = [
    'ResizeObserver loop limit exceeded',
    'ResizeObserver loop completed with undelivered notifications',
    'Non-Error promise rejection captured',
  ]
  if (ignoredErrors.some((msg) => err.message.includes(msg))) {
    return false
  }
  return true
})

// ─── Configuração global de beforeEach ───────────────────────────────────────
// Garante isolamento entre testes: limpa cookies e storage a cada execução
beforeEach(() => {
  cy.clearCookies()
  cy.clearLocalStorage()
  cy.window().then((win) => win.sessionStorage.clear())
})
