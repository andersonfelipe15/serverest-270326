/// <reference types="cypress" />

const loginPage  = require('../../support/pages/LoginPage')
const UserFactory = require('../../support/factories/UserFactory')
const UsuariosApi = require('../../support/api/UsuariosApi')
const LoginApi    = require('../../support/api/LoginApi')

/**
 * Suite: Login UI
 * URL: https://front.serverest.dev/login
 *
 * Valida o fluxo de autenticação via interface:
 * login com sucesso, redirecionamento, validações de campo e mensagens de erro.
 */
describe('Login UI', () => {
  // ─── Cria usuário válido via API (sem passar pela UI de cadastro) ──────────
  before(() => {
    const payload = UserFactory.create()
    UsuariosApi.create(payload).then(({ body }) => {
      cy.wrap(payload.email).as('emailValido')
      cy.wrap(payload.password).as('senhaValida')
      cy.wrap(body._id).as('userId')
    })
  })

  after(function () {
    if (this.userId) UsuariosApi.delete(this.userId)
  })

  // Navega para a página de login antes de cada teste
  beforeEach(() => {
    loginPage.visit()
  })

  // ──────────────────────────────────────────────────────────────────────────
  context('Cenários de sucesso', () => {
    it('deve realizar login com credenciais válidas', function () {
      loginPage.login(this.emailValido, this.senhaValida)
      loginPage.assertRedirectedToHome()
    })

    it('deve redirecionar para /home após login bem-sucedido', function () {
      loginPage.login(this.emailValido, this.senhaValida)
      cy.url().should('include', '/home')
    })

    it('deve exibir a página Home com conteúdo após login', function () {
      loginPage.login(this.emailValido, this.senhaValida)
      cy.get('h1, h2, [data-testid]').should('exist')
    })
  })

  // ──────────────────────────────────────────────────────────────────────────
  context('Cenários de falha — Credenciais inválidas', () => {
    it('não deve logar com e-mail correto e senha incorreta', function () {
      loginPage.login(this.emailValido, 'senhaErrada999')
      loginPage.assertAlert('Email e/ou senha inválidos')
      loginPage.assertRemainsOnLogin()
    })

    it('não deve logar com e-mail inexistente', () => {
      loginPage.login('nao.existe@serverest.dev', 'Test@2024')
      loginPage.assertAlert('Email e/ou senha inválidos')
    })

    it('não deve logar com e-mail e senha incorretos simultaneamente', () => {
      loginPage.login('invalido@qualquer.com', 'senhaErrada')
      loginPage.assertAlert('Email e/ou senha inválidos')
    })
  })

  // ──────────────────────────────────────────────────────────────────────────
  context('Cenários de falha — Validação de campos obrigatórios', () => {
    it('deve exibir erro de validação ao submeter sem preencher o e-mail', function () {
      loginPage.fillPassword(this.senhaValida).submit()
      loginPage.assertFieldError('Email é obrigatório')
    })

    it('deve exibir erro de validação ao submeter sem preencher a senha', function () {
      loginPage.fillEmail(this.emailValido).submit()
      loginPage.assertFieldError('Password é obrigatório')
    })

    it('deve exibir erros de validação para ambos os campos vazios', () => {
      loginPage.submit()
      cy.get('span').should('contain.text', 'Email é obrigatório')
      cy.get('span').should('contain.text', 'Password é obrigatório')
    })

    it('deve exibir 2 mensagens de validação ao submeter formulário vazio', () => {
      loginPage.submit()
      cy.get('span').should('have.length.at.least', 2)
    })
  })

  // ──────────────────────────────────────────────────────────────────────────
  context('Navegação', () => {
    it('deve navegar para a página de cadastro ao clicar no link', () => {
      loginPage.goToRegister()
      cy.url().should('include', '/cadastrarusuarios')
    })

    it('deve manter a página de login visível ao carregar inicialmente', () => {
      cy.url().should('include', '/login')
      cy.getByTestId('email').should('be.visible')
      cy.getByTestId('senha').should('be.visible')
      cy.getByTestId('entrar').should('be.visible')
    })
  })
})
