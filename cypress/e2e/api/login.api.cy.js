/// <reference types="cypress" />

const LoginApi    = require('../../support/api/LoginApi')
const UsuariosApi = require('../../support/api/UsuariosApi')
const UserFactory = require('../../support/factories/UserFactory')

/**
 * Suite: Login API
 * Endpoint: POST https://serverest.dev/login
 *
 * Valida autenticação com credenciais válidas e inválidas,
 * formato do token retornado e mensagens de erro.
 */
describe('Login API', () => {
  // Cria um usuário de referência válido antes de todos os testes
  before(() => {
    const payload = UserFactory.createAdmin()
    UsuariosApi.create(payload).then(({ status, body }) => {
      expect(status).to.eq(201, 'Setup: usuário criado com sucesso')
      cy.wrap(payload.email).as('emailValido')
      cy.wrap(payload.password).as('senhaValida')
      cy.wrap(body._id).as('userId')
    })
  })

  // Limpeza: remove o usuário criado no setup
  after(function () {
    if (this.userId) {
      UsuariosApi.delete(this.userId)
    }
  })

  // ──────────────────────────────────────────────────────────────────────────
  context('POST /login — Cenários de sucesso', () => {
    it('deve retornar status 200 ao autenticar com credenciais válidas', function () {
      LoginApi.login(this.emailValido, this.senhaValida).then(({ status }) => {
        expect(status).to.eq(200)
      })
    })

    it('deve retornar a mensagem "Login realizado com sucesso"', function () {
      LoginApi.login(this.emailValido, this.senhaValida).then(({ body }) => {
        expect(body.message).to.eq('Login realizado com sucesso')
      })
    })

    it('deve retornar um token de autorização no formato Bearer', function () {
      LoginApi.login(this.emailValido, this.senhaValida).then(({ body }) => {
        expect(body).to.have.property('authorization').and.to.be.a('string')
        expect(body.authorization).to.match(/^Bearer\s[\w-]+\.[\w-]+\.[\w-]+$/)
      })
    })

    it('deve retornar um token não vazio e reutilizável', function () {
      LoginApi.login(this.emailValido, this.senhaValida).then(({ body }) => {
        expect(body.authorization).to.have.length.greaterThan(10)
        Cypress.env('token', body.authorization)

        // Valida que o token funciona para listar usuários
        cy.request({
          method: 'GET',
          url: '/usuarios',
          headers: { Authorization: body.authorization },
        }).then(({ status }) => {
          expect(status).to.eq(200)
        })
      })
    })
  })

  // ──────────────────────────────────────────────────────────────────────────
  context('POST /login — Cenários de falha', () => {
    it('não deve autenticar com senha incorreta — status 401', function () {
      LoginApi.login(this.emailValido, 'senhaIncorreta999').then(({ status, body }) => {
        expect(status).to.eq(401)
        expect(body.message).to.eq('Email e/ou senha inválidos')
      })
    })

    it('não deve autenticar com e-mail inexistente — status 401', () => {
      LoginApi.login('email.nao.existe@serverest.dev', 'Test@2024').then(({ status, body }) => {
        expect(status).to.eq(401)
        expect(body.message).to.eq('Email e/ou senha inválidos')
      })
    })

    it('não deve autenticar sem o campo e-mail — status 400', () => {
      LoginApi.login('', 'Test@2024').then(({ status, body }) => {
        expect(status).to.eq(400)
        expect(body).to.have.property('email')
      })
    })

    it('não deve autenticar sem o campo password — status 400', function () {
      LoginApi.login(this.emailValido, '').then(({ status, body }) => {
        expect(status).to.eq(400)
        expect(body).to.have.property('password')
      })
    })

    it('não deve autenticar com body vazio — status 400', () => {
      cy.request({
        method: 'POST',
        url: '/login',
        body: {},
        failOnStatusCode: false,
      }).then(({ status }) => {
        expect(status).to.eq(400)
      })
    })
  })
})
