/**
 * CarrinhosApi — Service Object para o endpoint /carrinhos
 *
 * Todas as operações de carrinho exigem autenticação via Bearer token.
 * Um usuário só pode possuir 1 carrinho ativo por vez.
 */
class CarrinhosApi {
  static get endpoint() {
    return '/carrinhos'
  }

  static _authHeader(token) {
    return { Authorization: token || Cypress.env('token') }
  }

  /** Lista todos os carrinhos */
  static list(queryParams = {}) {
    return cy.request({
      method: 'GET',
      url: CarrinhosApi.endpoint,
      qs: queryParams,
      failOnStatusCode: false,
    })
  }

  /** Busca carrinho por ID */
  static getById(id) {
    return cy.request({
      method: 'GET',
      url: `${CarrinhosApi.endpoint}/${id}`,
      failOnStatusCode: false,
    })
  }

  /** Cria novo carrinho */
  static create(payload, token) {
    return cy.request({
      method: 'POST',
      url: CarrinhosApi.endpoint,
      headers: CarrinhosApi._authHeader(token),
      body: payload,
      failOnStatusCode: false,
    })
  }

  /** Cria carrinho sem autenticação (para testes negativos) */
  static createUnauthenticated(payload) {
    return cy.request({
      method: 'POST',
      url: CarrinhosApi.endpoint,
      body: payload,
      failOnStatusCode: false,
    })
  }

  /** Conclui compra — remove carrinho e atualiza estoque */
  static concludePurchase(token) {
    return cy.request({
      method: 'DELETE',
      url: `${CarrinhosApi.endpoint}/concluir-compra`,
      headers: CarrinhosApi._authHeader(token),
      failOnStatusCode: false,
    })
  }

  /** Cancela compra — remove carrinho e reintegra estoque */
  static cancelPurchase(token) {
    return cy.request({
      method: 'DELETE',
      url: `${CarrinhosApi.endpoint}/cancelar-compra`,
      headers: CarrinhosApi._authHeader(token),
      failOnStatusCode: false,
    })
  }
}

module.exports = CarrinhosApi
