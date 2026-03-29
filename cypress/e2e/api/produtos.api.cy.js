/// <reference types="cypress" />

const ProdutosApi  = require('../../support/api/ProdutosApi')
const UsuariosApi  = require('../../support/api/UsuariosApi')
const LoginApi     = require('../../support/api/LoginApi')
const UserFactory  = require('../../support/factories/UserFactory')
const ProductFactory = require('../../support/factories/ProductFactory')

/**
 * Suite: Produtos API
 * Endpoint base: https://serverest.dev/produtos
 *
 * Operações de produtos exigem token de administrador para
 * escrita (POST, PUT, DELETE). GET é público.
 */
describe('Produtos API', () => {
  // ─── Setup global: cria admin e obtém token ──────────────────────────────
  before(() => {
    const adminPayload = UserFactory.createAdmin()

    UsuariosApi.create(adminPayload).then(({ status, body }) => {
      expect(status).to.eq(201, 'Setup: admin criado')
      cy.wrap(body._id).as('adminId')

      LoginApi.login(adminPayload.email, adminPayload.password).then(({ body: loginBody }) => {
        expect(loginBody).to.have.property('authorization')
        cy.wrap(loginBody.authorization).as('adminToken')
        Cypress.env('token', loginBody.authorization)
      })
    })
  })

  after(function () {
    if (this.adminId) UsuariosApi.delete(this.adminId)
  })

  // ──────────────────────────────────────────────────────────────────────────
  context('GET /produtos — Listagem de produtos', () => {
    it('deve retornar status 200 com a lista de produtos', () => {
      ProdutosApi.list().then(({ status, body }) => {
        expect(status).to.eq(200)
        expect(body).to.have.all.keys('quantidade', 'produtos')
        expect(body.produtos).to.be.an('array')
      })
    })

    it('deve retornar quantidade maior que zero', () => {
      ProdutosApi.list().then(({ body }) => {
        expect(body.quantidade).to.be.greaterThan(0)
        expect(body.produtos).to.have.length(body.quantidade)
      })
    })

    it('deve retornar produtos com estrutura de campos válida', () => {
      ProdutosApi.list().then(({ body }) => {
        const produto = body.produtos[0]
        expect(produto).to.include.keys('_id', 'nome', 'preco', 'descricao', 'quantidade')
        expect(produto.preco).to.be.a('number').and.to.be.greaterThan(0)
        expect(produto.quantidade).to.be.a('number').and.to.be.at.least(0)
      })
    })
  })

  // ──────────────────────────────────────────────────────────────────────────
  context('POST /produtos — Cadastro de produto', () => {
    it('deve cadastrar produto com sucesso usando token de admin — status 201', function () {
      const payload = ProductFactory.create()

      ProdutosApi.create(payload, this.adminToken).then(({ status, body }) => {
        expect(status).to.eq(201)
        expect(body.message).to.eq('Cadastro realizado com sucesso')
        expect(body).to.have.property('_id').and.to.be.a('string')
      })
    })

    it('deve retornar _id válido do produto criado', function () {
      const payload = ProductFactory.create()

      ProdutosApi.create(payload, this.adminToken).then(({ body }) => {
        expect(body._id).to.match(/^[a-zA-Z0-9]+$/)
      })
    })

    it('não deve permitir cadastro com nome duplicado — status 400', function () {
      const payload = ProductFactory.create()

      ProdutosApi.create(payload, this.adminToken).then(({ status }) => {
        expect(status).to.eq(201)

        ProdutosApi.create(payload, this.adminToken).then(({ status: s, body }) => {
          expect(s).to.eq(400)
          expect(body.message).to.eq('Já existe produto com esse nome')
        })
      })
    })

    it('não deve cadastrar produto sem token de autenticação — status 401', () => {
      const payload = ProductFactory.create()

      ProdutosApi.createUnauthenticated(payload).then(({ status, body }) => {
        expect(status).to.eq(401)
        expect(body.message).to.include('Token de acesso ausente')
      })
    })

    it('não deve cadastrar produto sem o campo nome — status 400', function () {
      const payload = ProductFactory.createInvalid('semNome')

      ProdutosApi.create(payload, this.adminToken).then(({ status, body }) => {
        expect(status).to.eq(400)
        expect(body).to.have.property('nome')
      })
    })

    it('não deve cadastrar produto sem o campo preco — status 400', function () {
      const payload = ProductFactory.createInvalid('semPreco')

      ProdutosApi.create(payload, this.adminToken).then(({ status, body }) => {
        expect(status).to.eq(400)
        expect(body).to.have.property('preco')
      })
    })
  })

  // ──────────────────────────────────────────────────────────────────────────
  context('GET /produtos/:id — Busca de produto por ID', () => {
    before(function () {
      const payload = ProductFactory.create()
      ProdutosApi.create(payload, this.adminToken).then(({ body }) => {
        cy.wrap(body._id).as('produtoId')
        cy.wrap(payload.nome).as('produtoNome')
      })
    })

    it('deve retornar o produto correto pelo ID — status 200', function () {
      ProdutosApi.getById(this.produtoId).then(({ status, body }) => {
        expect(status).to.eq(200)
        expect(body._id).to.eq(this.produtoId)
        expect(body.nome).to.eq(this.produtoNome)
      })
    })

    it('deve retornar todos os campos esperados do produto', function () {
      ProdutosApi.getById(this.produtoId).then(({ body }) => {
        expect(body).to.include.keys('_id', 'nome', 'preco', 'descricao', 'quantidade')
        expect(body.preco).to.be.a('number')
        expect(body.quantidade).to.be.a('number')
      })
    })

    it('deve retornar status 400 para ID de produto inexistente', () => {
      ProdutosApi.getById('idInexistente999').then(({ status, body }) => {
        expect(status).to.eq(400)
        expect(body.message).to.eq('Produto não encontrado')
      })
    })
  })

  // ──────────────────────────────────────────────────────────────────────────
  context('PUT /produtos/:id — Atualização de produto', () => {
    before(function () {
      const payload = ProductFactory.create()
      ProdutosApi.create(payload, this.adminToken).then(({ body }) => {
        cy.wrap(body._id).as('produtoUpdateId')
        cy.wrap(payload).as('produtoOriginal')
      })
    })

    it('deve atualizar produto com sucesso — status 200', function () {
      const updatedPayload = {
        ...this.produtoOriginal,
        nome: `Produto Atualizado ${Date.now()}`,
        preco: 299,
      }

      ProdutosApi.update(this.produtoUpdateId, updatedPayload, this.adminToken).then(({ status, body }) => {
        expect(status).to.eq(200)
        expect(body.message).to.eq('Registro alterado com sucesso')
      })
    })
  })

  // ──────────────────────────────────────────────────────────────────────────
  context('DELETE /produtos/:id — Exclusão de produto', () => {
    before(function () {
      const payload = ProductFactory.create()
      ProdutosApi.create(payload, this.adminToken).then(({ body }) => {
        cy.wrap(body._id).as('produtoDeleteId')
      })
    })

    it('deve excluir produto com sucesso — status 200', function () {
      ProdutosApi.delete(this.produtoDeleteId, this.adminToken).then(({ status, body }) => {
        expect(status).to.eq(200)
        expect(body.message).to.eq('Registro excluído com sucesso')
      })
    })

    it('não deve encontrar produto já excluído ao buscar por ID', function () {
      ProdutosApi.getById(this.produtoDeleteId).then(({ status }) => {
        expect(status).to.eq(400)
      })
    })
  })
})
