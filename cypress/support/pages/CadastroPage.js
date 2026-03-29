/// <reference types="cypress" />
const BasePage = require('./BasePage')

/**
 * CadastroPage — Page Object para a página de cadastro de usuário
 * URL: https://front.serverest.dev/cadastrarusuarios
 */
class CadastroPage extends BasePage {
  get route() {
    return '/cadastrarusuarios'
  }

  get sel() {
    return {
      nomeInput:       '[data-testid="nome"]',
      emailInput:      '[data-testid="email"]',
      passwordInput:   '#password',
      adminCheckbox:   '[data-testid="checkbox"]',
      submitButton:    '[data-testid="cadastrar"]',
      alertSuccess:    'a.alert-link',
      alertMessage:    '.alert',
      spanError:       'span',
    }
  }

  /** Navega diretamente até a página de cadastro */
  visit() {
    return super.visit(this.route)
  }

  /** Preenche o campo Nome */
  fillNome(nome) {
    cy.get(this.sel.nomeInput).clear().type(nome)
    return this
  }

  /** Preenche o campo E-mail */
  fillEmail(email) {
    cy.get(this.sel.emailInput).clear().type(email)
    return this
  }

  /** Preenche o campo Senha */
  fillPassword(password) {
    cy.get(this.sel.passwordInput).clear().type(password)
    return this
  }

  /** Clica no botão Cadastrar */
  submit() {
    cy.get(this.sel.submitButton).click()
    return this
  }

  /** Fluxo completo de preenchimento e envio do formulário */
  cadastrar(nome, email, password) {
    return this.fillNome(nome).fillEmail(email).fillPassword(password).submit()
  }

  // ─── Assertions ──────────────────────────────────────────────────────────

  /** Verifica cadastro realizado com sucesso */
  assertCadastroSucesso() {
    cy.get(this.sel.alertSuccess)
      .should('be.visible')
      .and('contain.text', 'Cadastro realizado com sucesso')
    return this
  }

  /** Verifica mensagem de alerta (ex: email duplicado) */
  assertAlert(message) {
    cy.get(this.sel.alertMessage).should('be.visible').and('contain.text', message)
    return this
  }

  /** Verifica erro de validação de campo */
  assertFieldError(message) {
    cy.get(this.sel.spanError).should('contain.text', message)
    return this
  }

  /** Verifica redirecionamento para login após cadastro */
  assertRedirectedToLogin() {
    return this.assertUrl('/login')
  }
}

module.exports = new CadastroPage()
