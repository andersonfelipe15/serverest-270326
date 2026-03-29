/// <reference types="cypress" />

const cadastroPage = require('../../support/pages/CadastroPage')
const loginPage    = require('../../support/pages/LoginPage')
const UserFactory  = require('../../support/factories/UserFactory')
const UsuariosApi  = require('../../support/api/UsuariosApi')

/**
 * Suite: Cadastro UI
 * URL: https://front.serverest.dev/cadastrarusuarios
 *
 * Valida o fluxo de registro de novos usuários via interface:
 * cadastro com sucesso, validações de campo e cenários negativos.
 */
describe('Cadastro UI', () => {
  // Navega para a página de cadastro antes de cada teste
  beforeEach(() => {
    cadastroPage.visit()
  })

  // ──────────────────────────────────────────────────────────────────────────
  context('Cenários de sucesso', () => {
    it('deve cadastrar novo usuário com dados válidos', () => {
      const usuario = UserFactory.create()

      cadastroPage.cadastrar(usuario.nome, usuario.email, usuario.password)
      cadastroPage.assertCadastroSucesso()
    })

    it('deve exibir link de sucesso clicável após cadastro', () => {
      const usuario = UserFactory.create()

      cadastroPage.cadastrar(usuario.nome, usuario.email, usuario.password)

      cy.get('a.alert-link')
        .should('be.visible')
        .and('contain.text', 'Cadastro realizado com sucesso')
    })

    it('deve redirecionar para o login ao clicar no link de sucesso', () => {
      const usuario = UserFactory.create()

      cadastroPage.cadastrar(usuario.nome, usuario.email, usuario.password)
      cy.get('a.alert-link').click()
      cy.url().should('include', '/login')
    })

    it('deve permitir cadastro de usuário administrador', () => {
      const usuario = UserFactory.createAdmin()

      cadastroPage.cadastrar(usuario.nome, usuario.email, usuario.password)
      cadastroPage.assertCadastroSucesso()
    })
  })

  // ──────────────────────────────────────────────────────────────────────────
  context('Cenários de falha — E-mail duplicado', () => {
    it('não deve permitir cadastro com e-mail já existente', () => {
      // Cria primeiro usuário via API para garantir o e-mail já existe
      const usuario = UserFactory.create()

      UsuariosApi.create(usuario).then(({ status }) => {
        expect(status).to.eq(201)

        // Tenta cadastrar o mesmo e-mail pela UI
        cadastroPage.visit()
        cadastroPage.cadastrar(usuario.nome, usuario.email, usuario.password)
        cadastroPage.assertAlert('Este email já está sendo usado')
      })
    })
  })

  // ──────────────────────────────────────────────────────────────────────────
  context('Cenários de falha — Validação de campos obrigatórios', () => {
    it('deve exibir erro ao submeter sem preencher o nome', () => {
      const usuario = UserFactory.create()

      cadastroPage.fillEmail(usuario.email).fillPassword(usuario.password).submit()
      cadastroPage.assertFieldError('Nome é obrigatório')
    })

    it('deve exibir erro ao submeter sem preencher o e-mail', () => {
      const usuario = UserFactory.create()

      cadastroPage.fillNome(usuario.nome).fillPassword(usuario.password).submit()
      cadastroPage.assertFieldError('Email é obrigatório')
    })

    it('deve exibir erro ao submeter sem preencher a senha', () => {
      const usuario = UserFactory.create()

      cadastroPage.fillNome(usuario.nome).fillEmail(usuario.email).submit()
      cadastroPage.assertFieldError('Password é obrigatório')
    })

    it('deve exibir múltiplos erros ao submeter formulário completamente vazio', () => {
      cadastroPage.submit()
      cy.get('span').should('have.length.at.least', 3)
    })
  })

  // ──────────────────────────────────────────────────────────────────────────
  context('Elementos da página', () => {
    it('deve exibir todos os campos do formulário', () => {
      cy.getByTestId('nome').should('be.visible')
      cy.getByTestId('email').should('be.visible')
      cy.get('#password').should('be.visible')
      cy.getByTestId('cadastrar').should('be.visible')
    })

    it('deve ter pelo menos um link de navegação na página', () => {
      cy.get('a').should('have.length.at.least', 1)
    })
  })
})
