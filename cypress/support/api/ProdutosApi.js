/**
 * ProdutosApi — Service Object para o endpoint /produtos
 *
 * Endpoints de produtos exigem token Bearer para operações
 * de escrita (POST, PUT, DELETE).
 */
class ProdutosApi {
  static get endpoint() {
    return '/produtos'
  }

  static _authHeader(token) {
    return { Authorization: token || Cypress.env('token') }
  }

  /** Lista todos os produtos */
  static list(queryParams = {}) {
    return cy.request({
      method: 'GET',
      url: ProdutosApi.endpoint,
      qs: queryParams,
      failOnStatusCode: false,
    })
  }

  /** Busca produto por ID */
  static getById(id) {
    return cy.request({
      method: 'GET',
      url: `${ProdutosApi.endpoint}/${id}`,
      failOnStatusCode: false,
    })
  }

  /** Cadastra novo produto (requer token de administrador) */
  static create(payload, token) {
    return cy.request({
      method: 'POST',
      url: ProdutosApi.endpoint,
      headers: ProdutosApi._authHeader(token),
      body: payload,
      failOnStatusCode: false,
    })
  }

  /** Atualiza produto por ID */
  static update(id, payload, token) {
    return cy.request({
      method: 'PUT',
      url: `${ProdutosApi.endpoint}/${id}`,
      headers: ProdutosApi._authHeader(token),
      body: payload,
      failOnStatusCode: false,
    })
  }

  /** Remove produto por ID */
  static delete(id, token) {
    return cy.request({
      method: 'DELETE',
      url: `${ProdutosApi.endpoint}/${id}`,
      headers: ProdutosApi._authHeader(token),
      failOnStatusCode: false,
    })
  }

  /** Cria produto sem autenticação (para testes negativos) */
  static createUnauthenticated(payload) {
    return cy.request({
      method: 'POST',
      url: ProdutosApi.endpoint,
      body: payload,
      failOnStatusCode: false,
    })
  }
}

module.exports = ProdutosApi
