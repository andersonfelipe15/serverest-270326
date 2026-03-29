/// <reference types="cypress" />

const UsuariosApi = require('../../support/api/UsuariosApi')
const LoginApi    = require('../../support/api/LoginApi')
const UserFactory = require('../../support/factories/UserFactory')

/**
 * Suite: Usuários API
 * Endpoint base: https://serverest.dev/usuarios
 *
 * Cobre os verbos: GET (list), GET (by id), POST, PUT, DELETE
 * com cenários positivos e negativos.
 */
describe('Usuários API', () => {
  // ─── Helpers de setup ──────────────────────────────────────────────────────
  const criarUsuario = (payload) =>
    UsuariosApi.create(payload).then(({ body }) => body._id)

  // ──────────────────────────────────────────────────────────────────────────
  context('GET /usuarios — Listagem de usuários', () => {
    it('deve retornar status 200 com a lista de usuários', () => {
      UsuariosApi.list().then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.all.keys('quantidade', 'usuarios')
        expect(response.body.usuarios).to.be.an('array')
      })
    })

    it('deve retornar quantidade de usuários maior que zero', () => {
      UsuariosApi.list().then(({ body }) => {
        expect(body.quantidade).to.be.greaterThan(0)
        expect(body.usuarios.length).to.eq(body.quantidade)
      })
    })

    it('deve retornar usuários com estrutura de campos válida', () => {
      UsuariosApi.list().then(({ body }) => {
        const usuario = body.usuarios[0]
        expect(usuario).to.include.keys('_id', 'nome', 'email', 'administrador')
      })
    })

    it('deve filtrar usuários por query param administrador', () => {
      UsuariosApi.list({ administrador: 'true' }).then(({ body, status }) => {
        expect(status).to.eq(200)
        body.usuarios.forEach((u) => {
          expect(u.administrador).to.eq('true')
        })
      })
    })
  })

  // ──────────────────────────────────────────────────────────────────────────
  context('POST /usuarios — Cadastro de usuário', () => {
    it('deve cadastrar um novo usuário com sucesso e retornar status 201', () => {
      const payload = UserFactory.create()

      UsuariosApi.create(payload).then(({ status, body }) => {
        expect(status).to.eq(201)
        expect(body.message).to.eq('Cadastro realizado com sucesso')
        expect(body).to.have.property('_id').and.to.be.a('string')
      })
    })

    it('deve retornar o _id do usuário recém-cadastrado', () => {
      const payload = UserFactory.createAdmin()

      UsuariosApi.create(payload).then(({ body }) => {
        expect(body._id).to.match(/^[a-zA-Z0-9]+$/)
      })
    })

    it('não deve permitir cadastro com e-mail já existente — status 400', () => {
      const payload = UserFactory.create()

      UsuariosApi.create(payload).then(({ status }) => {
        expect(status).to.eq(201)

        UsuariosApi.create(payload).then(({ status: s, body }) => {
          expect(s).to.eq(400)
          expect(body.message).to.eq('Este email já está sendo usado')
        })
      })
    })

    it('não deve cadastrar usuário sem o campo nome — status 400', () => {
      const payload = UserFactory.createInvalid('semNome')

      UsuariosApi.create(payload).then(({ status, body }) => {
        expect(status).to.eq(400)
        expect(body).to.have.property('nome')
      })
    })

    it('não deve cadastrar usuário sem o campo email — status 400', () => {
      const payload = UserFactory.createInvalid('semEmail')

      UsuariosApi.create(payload).then(({ status, body }) => {
        expect(status).to.eq(400)
        expect(body).to.have.property('email')
      })
    })

    it('não deve cadastrar usuário sem o campo password — status 400', () => {
      const payload = UserFactory.createInvalid('semSenha')

      UsuariosApi.create(payload).then(({ status, body }) => {
        expect(status).to.eq(400)
        expect(body).to.have.property('password')
      })
    })

    it('não deve cadastrar usuário com e-mail em formato inválido — status 400', () => {
      const payload = UserFactory.createInvalid('emailInvalido')

      UsuariosApi.create(payload).then(({ status, body }) => {
        expect(status).to.eq(400)
        expect(body).to.have.property('email')
      })
    })
  })

  // ──────────────────────────────────────────────────────────────────────────
  context('GET /usuarios/:id — Busca de usuário por ID', () => {
    let userId
    let userPayload

    before(() => {
      userPayload = UserFactory.create()
      UsuariosApi.create(userPayload).then(({ body }) => {
        cy.wrap(body._id).as('createdUserId')
      })
    })

    it('deve retornar o usuário correto pelo ID — status 200', function () {
      UsuariosApi.getById(this.createdUserId).then(({ status, body }) => {
        expect(status).to.eq(200)
        expect(body._id).to.eq(this.createdUserId)
        expect(body.email).to.eq(userPayload.email)
        expect(body.nome).to.eq(userPayload.nome)
      })
    })

    it('deve retornar os campos corretos na busca por ID', function () {
      UsuariosApi.getById(this.createdUserId).then(({ body }) => {
        expect(body).to.include.keys('_id', 'nome', 'email', 'administrador')
      })
    })

    it('deve retornar status 400 para ID inexistente', () => {
      UsuariosApi.getById('idInexistente123').then(({ status, body }) => {
        expect(status).to.eq(400)
        expect(body.message).to.eq('Usuário não encontrado')
      })
    })
  })

  // ──────────────────────────────────────────────────────────────────────────
  context('PUT /usuarios/:id — Atualização de usuário', () => {
    before(() => {
      const payload = UserFactory.create()
      UsuariosApi.create(payload).then(({ body }) => {
        cy.wrap(body._id).as('updateUserId')
        cy.wrap(payload).as('originalPayload')
      })
    })

    it('deve atualizar o usuário com sucesso — status 200', function () {
      const updatedPayload = {
        ...this.originalPayload,
        nome: `Nome Atualizado ${Date.now()}`,
      }

      UsuariosApi.update(this.updateUserId, updatedPayload).then(({ status, body }) => {
        expect(status).to.eq(200)
        expect(body.message).to.eq('Registro alterado com sucesso')
      })
    })

    it('deve refletir os dados atualizados ao buscar o usuário', () => {
      // Cria usuário dedicado para este teste de verificação
      const payload = UserFactory.create()
      const novoNome = `Nome Verificado ${Date.now()}`

      UsuariosApi.create(payload).then(({ body: created }) => {
        const updatedPayload = { ...payload, nome: novoNome }

        UsuariosApi.update(created._id, updatedPayload).then(({ status }) => {
          expect(status).to.eq(200)

          UsuariosApi.getById(created._id).then(({ body }) => {
            expect(body.nome).to.eq(novoNome)
          })
        })
      })
    })
  })

  // ──────────────────────────────────────────────────────────────────────────
  context('DELETE /usuarios/:id — Exclusão de usuário', () => {
    before(() => {
      const payload = UserFactory.create()
      UsuariosApi.create(payload).then(({ body }) => {
        cy.wrap(body._id).as('deleteUserId')
      })
    })

    it('deve excluir o usuário com sucesso — status 200', function () {
      UsuariosApi.delete(this.deleteUserId).then(({ status, body }) => {
        expect(status).to.eq(200)
        expect(body.message).to.eq('Registro excluído com sucesso')
      })
    })

    it('deve retornar 200 ao tentar excluir ID já inexistente', function () {
      UsuariosApi.delete(this.deleteUserId).then(({ status, body }) => {
        expect(status).to.eq(200)
        expect(body.message).to.eq('Nenhum registro excluído')
      })
    })
  })
})
