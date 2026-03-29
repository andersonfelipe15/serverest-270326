/**
 * LoginApi — Service Object para o endpoint /login
 */
class LoginApi {
  static get endpoint() {
    return '/login'
  }

  /** Autentica e retorna o response com o token */
  static login(email, password) {
    return cy.request({
      method: 'POST',
      url: LoginApi.endpoint,
      body: { email, password },
      failOnStatusCode: false,
    })
  }
}

module.exports = LoginApi
