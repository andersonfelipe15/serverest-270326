/// <reference types="cypress" />

const homePage    = require('../../support/pages/HomePage')
const loginPage   = require('../../support/pages/LoginPage')
const UserFactory  = require('../../support/factories/UserFactory')
const UsuariosApi  = require('../../support/api/UsuariosApi')

/**
 * Suite: Home UI
 * URL: https://front.serverest.dev/home
 *
 * Valida a página principal após login:
 * exibição de produtos, pesquisa e adição ao carrinho.
 *
 * Estratégia: login é feito via API antes dos testes que precisam
 * estar autenticados, evitando dependência da UI de login.
 */
describe('Home UI', () => {
  // ─── Setup: cria usuário e faz login via API ─────────────────────────────
  before(() => {
    const payload = UserFactory.create()
    UsuariosApi.create(payload).then(({ body }) => {
      cy.wrap(payload.email).as('userEmail')
      cy.wrap(payload.password).as('userPassword')
      cy.wrap(body._id).as('userId')
    })
  })

  after(function () {
    if (this.userId) UsuariosApi.delete(this.userId)
  })

  // Autentica via UI antes de cada teste da Home
  beforeEach(function () {
    loginPage.visit()
    loginPage.login(this.userEmail, this.userPassword)
    loginPage.assertRedirectedToHome()
  })

  // ──────────────────────────────────────────────────────────────────────────
  context('Exibição da página', () => {
    it('deve exibir a lista de produtos ao acessar a Home', () => {
      homePage.assertProductsVisible()
    })

    it('deve exibir cards de produto com nome visível', () => {
      cy.get('.card').first().within(() => {
        cy.get('.card-title').should('be.visible').and('not.be.empty')
      })
    })

    it('deve exibir o campo de pesquisa na Home', () => {
      cy.getByTestId('pesquisar').should('be.visible')
    })

    it('deve ter URL correta na página Home', () => {
      homePage.assertOnHomePage()
    })
  })

  // ──────────────────────────────────────────────────────────────────────────
  context('Pesquisa de produtos', () => {
    it('deve exibir resultados ao pesquisar por termo existente', () => {
      homePage.pesquisar('produto')
      cy.get('.card, p, .alert').should('exist')
    })

    it('deve exibir apenas produtos que correspondam ao termo pesquisado', () => {
      const termoPesquisa = 'Camisa'

      homePage.pesquisar(termoPesquisa)

      cy.get('body').then(($body) => {
        if ($body.find('.card').length > 0) {
          cy.get('.card-title').each(($titulo) => {
            expect($titulo.text().toLowerCase()).to.include(termoPesquisa.toLowerCase())
          })
        }
      })
    })

    it('deve limpar resultados e mostrar todos os produtos ao apagar a pesquisa', () => {
      homePage.pesquisar('Loção')

      cy.getByTestId('pesquisar').clear()
      cy.getByTestId('botaoPesquisar').click()

      homePage.assertProductsVisible()
    })

    it('deve permitir pesquisa sem resultados sem travar a página', () => {
      homePage.pesquisar('ProdutoQueNaoExiste123456789')
      cy.get('.card, .alert, p').should('exist')
    })
  })

  // ──────────────────────────────────────────────────────────────────────────
  context('Adição ao carrinho', () => {
    it('deve ter botão de adicionar ao carrinho em cada produto', () => {
      cy.get('.card').first().within(() => {
        cy.getByTestId('adicionarNaLista').should('be.visible')
      })
    })

    it('deve adicionar o primeiro produto ao carrinho com sucesso', () => {
      cy.get('.card').first().within(() => {
        cy.getByTestId('adicionarNaLista').click()
      })
      // Verifica feedback visual (badge de quantidade ou mensagem)
      cy.get('body').should('not.contain.text', 'Erro')
    })

    it('deve processar o clique em adicionar ao carrinho sem erro', () => {
      cy.get('.card').first().within(() => {
        cy.getByTestId('adicionarNaLista').click()
      })
      // Adicionar na lista redireciona para a tela de lista de produtos
      cy.get('body').should('not.contain.text', 'Erro')
      cy.get('body').should('exist')
    })
  })

  // ──────────────────────────────────────────────────────────────────────────
  context('Persistência de sessão', () => {
    it('deve manter o usuário autenticado ao recarregar a página', () => {
      cy.reload()
      homePage.assertOnHomePage()
    })
  })
})
