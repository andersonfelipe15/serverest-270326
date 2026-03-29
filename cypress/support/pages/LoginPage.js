/// <reference types="cypress" />
const BasePage = require('./BasePage')

/**
 * LoginPage — Page Object para a página de login
 * URL: https://front.serverest.dev/login
 *
 * Encapsula todos os seletores e ações da tela de login,
 * isolando os testes das implementações do DOM.
 */
class LoginPage extends BasePage {
  get route() {
    return '/login'
  }

  /** Mapa de seletores da página — única fonte de verdade */
  get sel() {
    return {
      emailInput:    '[data-testid="email"]',
      passwordInput: '[data-testid="senha"]',
      loginButton:   '[data-testid="entrar"]',
      registerLink:  '[data-testid="cadastrar"]',
      alertMessage:  '.alert',
      spanError:     'span',
    }
  }

  /** Navega até a página de login */
  visit() {
    return super.visit(this.route)
  }

  /** Preenche o campo e-mail */
  fillEmail(email) {
    cy.get(this.sel.emailInput).clear().type(email)
    return this
  }

  /** Preenche o campo senha */
  fillPassword(password) {
    cy.get(this.sel.passwordInput).clear().type(password)
    return this
  }

  /** Clica no botão Entrar */
  submit() {
    cy.get(this.sel.loginButton).click()
    return this
  }

  /** Fluxo completo de login */
  login(email, password) {
    return this.fillEmail(email).fillPassword(password).submit()
  }

  /** Clica no link de cadastro */
  goToRegister() {
    cy.get(this.sel.registerLink).click()
    return this
  }

  // ─── Assertions ──────────────────────────────────────────────────────────

  /** Verifica mensagem de alerta (credenciais inválidas, etc.) */
  assertAlert(message) {
    cy.get(this.sel.alertMessage).should('be.visible').and('contain.text', message)
    return this
  }

  /** Verifica erro de validação de campo (span de feedback) */
  assertFieldError(message) {
    cy.get(this.sel.spanError).should('contain.text', message)
    return this
  }

  /** Verifica redirecionamento para Home após login bem-sucedido */
  assertRedirectedToHome() {
    return this.assertUrl('/home')
  }

  /** Verifica que permanece na página de login (login falhou) */
  assertRemainsOnLogin() {
    return this.assertUrl('/login')
  }
}

module.exports = new LoginPage()
