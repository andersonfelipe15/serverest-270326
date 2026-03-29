/**
 * BasePage — Classe base para todos os Page Objects
 *
 * Aplica Template Method Pattern: define interface comum
 * e métodos utilitários reutilizáveis por todas as páginas.
 */
class BasePage {
  get frontUrl() {
    return Cypress.env('frontUrl')
  }

  /**
   * Navega para uma rota da aplicação front-end
   * @param {string} path - Rota relativa (ex: '/login')
   * @returns {this}
   */
  visit(path = '') {
    cy.visit(`${this.frontUrl}${path}`)
    return this
  }

  /**
   * Seleciona elemento por atributo data-testid
   * @param {string} testId
   * @returns {Cypress.Chainable}
   */
  getByTestId(testId) {
    return cy.get(`[data-testid="${testId}"]`)
  }

  /**
   * Preenche um campo identificado por data-testid
   * @param {string} testId
   * @param {string} value
   * @returns {this}
   */
  fillByTestId(testId, value) {
    this.getByTestId(testId).clear().type(value)
    return this
  }

  /**
   * Clica em elemento identificado por data-testid
   * @param {string} testId
   * @returns {this}
   */
  clickByTestId(testId) {
    this.getByTestId(testId).click()
    return this
  }

  /**
   * Verifica que a URL atual contém o path informado
   * @param {string} path
   * @returns {this}
   */
  assertUrl(path) {
    cy.url().should('include', path)
    return this
  }

  /**
   * Verifica mensagem de alerta visível na página
   * @param {string} message
   * @returns {this}
   */
  assertAlertContains(message) {
    cy.get('.alert').should('be.visible').and('contain.text', message)
    return this
  }

  /**
   * Verifica que um elemento está visível
   * @param {string} selector
   * @returns {this}
   */
  assertVisible(selector) {
    cy.get(selector).should('be.visible')
    return this
  }
}

module.exports = BasePage
