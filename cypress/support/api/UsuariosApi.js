/**
 * UsuariosApi — Service Object para o endpoint /usuarios
 *
 * Encapsula todas as chamadas HTTP ao recurso de usuários,
 * centralizando headers, URL base e opções de request.
 */
class UsuariosApi {
  static get endpoint() {
    return '/usuarios'
  }

  /** Lista todos os usuários
   * @param {Object} queryParams - Filtros opcionais (nome, email, administrador)
   */
  static list(queryParams = {}) {
    return cy.request({
      method: 'GET',
      url: UsuariosApi.endpoint,
      qs: queryParams,
      failOnStatusCode: false,
    })
  }

  /** Busca usuário por ID */
  static getById(id) {
    return cy.request({
      method: 'GET',
      url: `${UsuariosApi.endpoint}/${id}`,
      failOnStatusCode: false,
    })
  }

  /** Cadastra novo usuário */
  static create(payload) {
    return cy.request({
      method: 'POST',
      url: UsuariosApi.endpoint,
      body: payload,
      failOnStatusCode: false,
    })
  }

  /** Atualiza usuário por ID */
  static update(id, payload) {
    return cy.request({
      method: 'PUT',
      url: `${UsuariosApi.endpoint}/${id}`,
      body: payload,
      failOnStatusCode: false,
    })
  }

  /** Remove usuário por ID */
  static delete(id) {
    return cy.request({
      method: 'DELETE',
      url: `${UsuariosApi.endpoint}/${id}`,
      failOnStatusCode: false,
    })
  }
}

module.exports = UsuariosApi
