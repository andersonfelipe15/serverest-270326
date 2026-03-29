/// <reference types="cypress" />
const BasePage = require('./BasePage')

/**
 * HomePage — Page Object para a página principal (lista de produtos)
 * URL: https://front.serverest.dev/home
 */
class HomePage extends BasePage {
  get route() {
    return '/home'
  }

  get sel() {
    return {
      searchInput:   '[data-testid="pesquisar"]',
      searchButton:  '[data-testid="botaoPesquisar"]',
      productCard:   '.card',
      productTitle:  '.card-title',
      addToCartBtn:  '[data-testid="adicionarNaLista"]',
      cartBadge:     '.badge',
      pageHeading:   'h1, h2, h3',
      emptyMessage:  '.alert',
    }
  }

  /** Navega para a página home */
  visit() {
    return super.visit(this.route)
  }

  /** Preenche o campo de busca */
  fillSearch(term) {
    cy.get(this.sel.searchInput).clear().type(term)
    return this
  }

  /** Clica no botão de pesquisar */
  submitSearch() {
    cy.get(this.sel.searchButton).click()
    return this
  }

  /** Fluxo completo de pesquisa */
  pesquisar(term) {
    return this.fillSearch(term).submitSearch()
  }

  /** Adiciona produto ao carrinho pelo nome visível */
  adicionarProduto(nomeProduto) {
    cy.contains(this.sel.productCard, nomeProduto)
      .find(this.sel.addToCartBtn)
      .click()
    return this
  }

  // ─── Assertions ──────────────────────────────────────────────────────────

  /** Verifica que está na página Home */
  assertOnHomePage() {
    return this.assertUrl('/home')
  }

  /** Verifica que os cards de produto estão visíveis */
  assertProductsVisible() {
    cy.get(this.sel.productCard).should('have.length.greaterThan', 0)
    return this
  }

  /** Verifica que o resultado contém o produto pesquisado */
  assertSearchResult(nomeProduto) {
    cy.get(this.sel.productTitle)
      .should('be.visible')
      .and('contain.text', nomeProduto)
    return this
  }

  /** Verifica que nenhum produto foi encontrado */
  assertNoResults() {
    cy.get(this.sel.productCard).should('have.length', 0)
    return this
  }
}

module.exports = new HomePage()
