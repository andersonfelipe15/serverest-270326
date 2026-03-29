/**
 * Custom Commands — Camada de API
 *
 * Comandos reutilizáveis que abstraem setup/teardown de dados via API,
 * garantindo isolamento e independência entre testes.
 */

/**
 * Autentica via API e armazena o token em Cypress.env('token')
 * @example cy.autenticarViaApi(email, password)
 */
Cypress.Commands.add('autenticarViaApi', (email, password) => {
  cy.request({
    method: 'POST',
    url: '/login',
    body: { email, password },
  }).then(({ body }) => {
    Cypress.env('token', body.authorization)
    cy.wrap(body.authorization).as('token')
  })
})

/**
 * Cria usuário via API e retorna o response
 * @example cy.criarUsuarioViaApi(payload)
 */
Cypress.Commands.add('criarUsuarioViaApi', (payload) => {
  return cy.request({
    method: 'POST',
    url: '/usuarios',
    body: payload,
    failOnStatusCode: false,
  })
})

/**
 * Remove usuário via API (uso em teardown)
 * @example cy.deletarUsuarioViaApi(userId)
 */
Cypress.Commands.add('deletarUsuarioViaApi', (userId) => {
  if (!userId) return
  cy.request({
    method: 'DELETE',
    url: `/usuarios/${userId}`,
    failOnStatusCode: false,
  })
})

/**
 * Cria produto via API com token de admin
 * @example cy.criarProdutoViaApi(payload, token)
 */
Cypress.Commands.add('criarProdutoViaApi', (payload, token) => {
  return cy.request({
    method: 'POST',
    url: '/produtos',
    headers: { Authorization: token || Cypress.env('token') },
    body: payload,
    failOnStatusCode: false,
  })
})

/**
 * Remove produto via API (uso em teardown)
 * @example cy.deletarProdutoViaApi(productId, token)
 */
Cypress.Commands.add('deletarProdutoViaApi', (productId, token) => {
  if (!productId) return
  cy.request({
    method: 'DELETE',
    url: `/produtos/${productId}`,
    headers: { Authorization: token || Cypress.env('token') },
    failOnStatusCode: false,
  })
})

/**
 * Cria carrinho via API
 * @example cy.criarCarrinhoViaApi(payload, token)
 */
Cypress.Commands.add('criarCarrinhoViaApi', (payload, token) => {
  return cy.request({
    method: 'POST',
    url: '/carrinhos',
    headers: { Authorization: token || Cypress.env('token') },
    body: payload,
    failOnStatusCode: false,
  })
})

/**
 * Cancela compra/carrinho ativo do usuário (teardown seguro)
 * @example cy.cancelarCompraViaApi(token)
 */
Cypress.Commands.add('cancelarCompraViaApi', (token) => {
  cy.request({
    method: 'DELETE',
    url: '/carrinhos/cancelar-compra',
    headers: { Authorization: token || Cypress.env('token') },
    failOnStatusCode: false,
  })
})
