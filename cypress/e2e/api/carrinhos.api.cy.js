/// <reference types="cypress" />

const CarrinhosApi  = require('../../support/api/CarrinhosApi')
const ProdutosApi   = require('../../support/api/ProdutosApi')
const UsuariosApi   = require('../../support/api/UsuariosApi')
const LoginApi      = require('../../support/api/LoginApi')
const UserFactory   = require('../../support/factories/UserFactory')
const ProductFactory = require('../../support/factories/ProductFactory')
const CartFactory   = require('../../support/factories/CartFactory')

/**
 * Suite: Carrinhos API
 * Endpoint base: https://serverest.dev/carrinhos
 *
 * Regras importantes da API:
 * - Um usuário só pode ter 1 carrinho ativo por vez
 * - POST /carrinhos exige token válido
 * - DELETE /concluir-compra atualiza o estoque
 * - DELETE /cancelar-compra reintegra a quantidade ao estoque
 */
describe('Carrinhos API', () => {
  // ─── Setup global: cria admin, produto e obtém token ──────────────────────
  before(() => {
    const adminPayload = UserFactory.createAdmin()

    UsuariosApi.create(adminPayload).then(({ body }) => {
      cy.wrap(body._id).as('adminId')

      LoginApi.login(adminPayload.email, adminPayload.password).then(({ body: loginBody }) => {
        const token = loginBody.authorization
        cy.wrap(token).as('adminToken')
        Cypress.env('token', token)

        // Cria produto para usar nos testes de carrinho
        const produtoPayload = ProductFactory.create({ quantidade: 100 })
        ProdutosApi.create(produtoPayload, token).then(({ body: prodBody }) => {
          cy.wrap(prodBody._id).as('produtoId')
        })
      })
    })
  })

  // Teardown: cancela carrinho se existir e remove admin
  after(function () {
    if (this.adminToken) {
      CarrinhosApi.cancelPurchase(this.adminToken)
    }
    if (this.adminId) {
      UsuariosApi.delete(this.adminId)
    }
  })

  // ──────────────────────────────────────────────────────────────────────────
  context('GET /carrinhos — Listagem de carrinhos', () => {
    it('deve retornar status 200 com a lista de carrinhos', () => {
      CarrinhosApi.list().then(({ status, body }) => {
        expect(status).to.eq(200)
        expect(body).to.have.all.keys('quantidade', 'carrinhos')
        expect(body.carrinhos).to.be.an('array')
      })
    })

    it('deve retornar carrinhos com estrutura de campos válida quando houver registros', () => {
      CarrinhosApi.list().then(({ body }) => {
        if (body.quantidade > 0) {
          const carrinho = body.carrinhos[0]
          expect(carrinho).to.include.keys('_id', 'produtos', 'precoTotal', 'quantidadeTotal', 'idUsuario')
          expect(carrinho.produtos).to.be.an('array')
        }
      })
    })
  })

  // ──────────────────────────────────────────────────────────────────────────
  context('POST /carrinhos — Criação de carrinho', () => {
    // Garante que não há carrinho ativo antes de cada criação
    beforeEach(function () {
      CarrinhosApi.cancelPurchase(this.adminToken)
    })

    it('deve criar um carrinho com produto válido — status 201', function () {
      const payload = CartFactory.create(this.produtoId, 1)

      CarrinhosApi.create(payload, this.adminToken).then(({ status, body }) => {
        expect(status).to.eq(201)
        expect(body.message).to.eq('Cadastro realizado com sucesso')
        expect(body).to.have.property('_id').and.to.be.a('string')
      })
    })

    it('deve persistir o produto no carrinho criado', function () {
      const payload = CartFactory.create(this.produtoId, 2)

      CarrinhosApi.create(payload, this.adminToken).then(({ body: createBody }) => {
        const carrinhoId = createBody._id

        CarrinhosApi.getById(carrinhoId).then(({ status, body }) => {
          expect(status).to.eq(200)
          expect(body.produtos[0].idProduto).to.eq(this.produtoId)
          expect(body.produtos[0].quantidade).to.eq(2)
        })
      })
    })

    it('não deve criar carrinho sem token de autenticação — status 401', function () {
      const payload = CartFactory.create(this.produtoId, 1)

      CarrinhosApi.createUnauthenticated(payload).then(({ status, body }) => {
        expect(status).to.eq(401)
        expect(body.message).to.include('Token de acesso ausente')
      })
    })

    it('não deve permitir dois carrinhos para o mesmo usuário — status 400', function () {
      const payload = CartFactory.create(this.produtoId, 1)

      CarrinhosApi.create(payload, this.adminToken).then(({ status }) => {
        expect(status).to.eq(201)

        // Segundo carrinho deve ser rejeitado
        CarrinhosApi.create(payload, this.adminToken).then(({ status: s, body }) => {
          expect(s).to.eq(400)
          expect(body.message).to.eq('Não é permitido ter mais de 1 carrinho')
        })
      })
    })
  })

  // ──────────────────────────────────────────────────────────────────────────
  context('GET /carrinhos/:id — Busca de carrinho por ID', () => {
    before(function () {
      CarrinhosApi.cancelPurchase(this.adminToken)
      const payload = CartFactory.create(this.produtoId, 1)
      CarrinhosApi.create(payload, this.adminToken).then(({ body }) => {
        cy.wrap(body._id).as('carrinhoId')
      })
    })

    it('deve retornar o carrinho correto pelo ID — status 200', function () {
      CarrinhosApi.getById(this.carrinhoId).then(({ status, body }) => {
        expect(status).to.eq(200)
        expect(body._id).to.eq(this.carrinhoId)
        expect(body.produtos).to.be.an('array').and.have.length.greaterThan(0)
      })
    })

    it('deve retornar os campos precoTotal e quantidadeTotal calculados', function () {
      CarrinhosApi.getById(this.carrinhoId).then(({ body }) => {
        expect(body.precoTotal).to.be.a('number').and.to.be.greaterThan(0)
        expect(body.quantidadeTotal).to.be.a('number').and.to.be.greaterThan(0)
      })
    })

    it('deve retornar status 400 para ID de carrinho inexistente', () => {
      CarrinhosApi.getById('carrinhoIdInexistente').then(({ status }) => {
        expect(status).to.eq(400)
      })
    })
  })

  // ──────────────────────────────────────────────────────────────────────────
  context('DELETE /carrinhos/concluir-compra — Conclusão de compra', () => {
    beforeEach(function () {
      // Garante carrinho ativo para cada teste
      CarrinhosApi.cancelPurchase(this.adminToken)
      const payload = CartFactory.create(this.produtoId, 1)
      CarrinhosApi.create(payload, this.adminToken)
    })

    it('deve concluir a compra com sucesso — status 200', function () {
      CarrinhosApi.concludePurchase(this.adminToken).then(({ status, body }) => {
        expect(status).to.eq(200)
        expect(body.message).to.include('Registro excluído com sucesso')
      })
    })

    it('deve retornar mensagem adequada quando não há carrinho ativo', function () {
      // Conclui o carrinho primeiro
      CarrinhosApi.concludePurchase(this.adminToken).then(({ status }) => {
        expect(status).to.eq(200)

        // Segunda conclusão sem carrinho ativo
        CarrinhosApi.concludePurchase(this.adminToken).then(({ status: s, body }) => {
          expect(s).to.eq(200)
          expect(body.message).to.eq('Não foi encontrado carrinho para esse usuário')
        })
      })
    })
  })

  // ──────────────────────────────────────────────────────────────────────────
  context('DELETE /carrinhos/cancelar-compra — Cancelamento de compra', () => {
    beforeEach(function () {
      CarrinhosApi.cancelPurchase(this.adminToken)
      const payload = CartFactory.create(this.produtoId, 1)
      CarrinhosApi.create(payload, this.adminToken)
    })

    it('deve cancelar a compra com sucesso — status 200', function () {
      CarrinhosApi.cancelPurchase(this.adminToken).then(({ status, body }) => {
        expect(status).to.eq(200)
        expect(body.message).to.include('Registro excluído com sucesso')
      })
    })
  })
})
