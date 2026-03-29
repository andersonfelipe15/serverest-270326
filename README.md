# ServeRest Automation - Cypress E2E + API Testing

Automacao de testes para a API REST e interface web do [ServeRest](https://serverest.dev).
Arquitetura com Page Object Model, Service Objects e Factory Pattern.

---

## Pre-requisitos

- Node.js >= 16
- npm >= 8
- Conexao com a internet

---

## Instalacao

    git clone https://github.com/andersonfelipe15/serverest-270326.git
    cd serverest-270326
    npm init -y

    E DEPOIS RODE:

    npm install cypress --save-dev

    ▶️ Rodar Front:

    npm run test:ui

    ▶️ Rodar API:

    npm run test:api

    ▶️ Abrir Cypress interativo:

    npm run cy:open

---

## Scripts disponiveis

    npm test                    # Todos os testes
    npm run test:api            # Somente testes de API
    npm run test:ui             # Somente testes de UI
    npm run test:api:login      # Suite Login API
    npm run test:api:usuarios   # Suite Usuarios API
    npm run test:api:produtos   # Suite Produtos API
    npm run test:api:carrinhos  # Suite Carrinhos API
    npm run test:ui:login       # Suite Login UI
    npm run test:ui:cadastro    # Suite Cadastro UI
    npm run test:ui:home        # Suite Home UI
    npm run cy:open             # Cypress Test Runner (interativo)
    npm run cy:open:api         # Test Runner somente API
    npm run cy:open:ui          # Test Runner somente UI

---

## Estrutura de pastas

    serverest-automation-270326/
    ├── cypress/
    │   ├── e2e/
    │   │   ├── api/
    │   │   │   ├── login.api.cy.js      # Testes POST /login
    │   │   │   ├── usuarios.api.cy.js   # Testes CRUD /usuarios
    │   │   │   ├── produtos.api.cy.js   # Testes CRUD /produtos
    │   │   │   └── carrinhos.api.cy.js  # Testes CRUD /carrinhos
    │   │   └── ui/
    │   │       ├── login.ui.cy.js       # Testes tela de Login
    │   │       ├── cadastro.ui.cy.js    # Testes tela de Cadastro
    │   │       └── home.ui.cy.js        # Testes tela Home
    │   ├── fixtures/
    │   │   ├── usuarios.json, produtos.json, carrinhos.json
    │   └── support/
    │       ├── e2e.js               # Entry point do support
    │       ├── commands/
    │       │   ├── api.commands.js      # Custom commands para API
    │       │   └── ui.commands.js       # Custom commands para UI
    │       ├── api/
    │       │   ├── LoginApi.js, UsuariosApi.js, ProdutosApi.js, CarrinhosApi.js
    │       ├── factories/
    │       │   ├── UserFactory.js, ProductFactory.js, CartFactory.js
    │       └── pages/
    │           ├── BasePage.js, LoginPage.js, CadastroPage.js, HomePage.js
    ├── cypress.config.js
    ├── jsconfig.json
    └── package.json

---

## Cenarios de teste - API

### Login (POST /login)

| Cenario | Tipo | Status |
|---|---|---|
| Autenticar com credenciais validas | Sucesso | 200 |
| Retornar mensagem de sucesso | Sucesso | 200 |
| Retornar token Bearer JWT valido | Sucesso | 200 |
| Token reutilizavel em requisicoes subsequentes | Sucesso | 200 |
| Rejeitar senha incorreta | Falha | 401 |
| Rejeitar e-mail inexistente | Falha | 401 |
| Rejeitar request sem campo e-mail | Falha | 400 |
| Rejeitar request sem campo password | Falha | 400 |
| Rejeitar body vazio | Falha | 400 |

### Usuarios (CRUD /usuarios)

| Cenario | Verbo | Tipo | Status |
|---|---|---|---|
| Listar todos os usuarios | GET | Sucesso | 200 |
| Validar estrutura de campos (quantidade, usuarios) | GET | Sucesso | 200 |
| Filtrar por query param administrador | GET | Sucesso | 200 |
| Criar usuario comum | POST | Sucesso | 201 |
| Criar usuario administrador | POST | Sucesso | 201 |
| Rejeitar e-mail duplicado | POST | Falha | 400 |
| Rejeitar request sem nome | POST | Falha | 400 |
| Rejeitar request sem e-mail | POST | Falha | 400 |
| Rejeitar request sem senha | POST | Falha | 400 |
| Rejeitar e-mail em formato invalido | POST | Falha | 400 |
| Buscar usuario por ID existente | GET/:id | Sucesso | 200 |
| Retornar 400 para ID inexistente | GET/:id | Falha | 400 |
| Atualizar dados do usuario | PUT | Sucesso | 200 |
| Verificar dados refletidos apos atualizacao | PUT | Sucesso | 200 |
| Excluir usuario por ID | DELETE | Sucesso | 200 |
| Retornar 200 ao excluir ID ja removido | DELETE | Edge case | 200 |

### Produtos (CRUD /produtos)

| Cenario | Verbo | Tipo | Status |
|---|---|---|---|
| Listar todos os produtos | GET | Sucesso | 200 |
| Validar campos: _id, nome, preco, descricao, quantidade | GET | Sucesso | 200 |
| Criar produto com token de admin | POST | Sucesso | 201 |
| Rejeitar nome de produto duplicado | POST | Falha | 400 |
| Rejeitar criacao sem token (401 Unauthorized) | POST | Falha | 401 |
| Rejeitar request sem campo nome | POST | Falha | 400 |
| Rejeitar request sem campo preco | POST | Falha | 400 |
| Buscar produto por ID existente | GET/:id | Sucesso | 200 |
| Retornar 400 para ID inexistente | GET/:id | Falha | 400 |
| Atualizar produto com sucesso | PUT | Sucesso | 200 |
| Excluir produto com sucesso | DELETE | Sucesso | 200 |
| Verificar que produto excluido retorna 400 | GET/:id | Edge case | 400 |

### Carrinhos (CRUD /carrinhos)

| Cenario | Verbo | Tipo | Status |
|---|---|---|---|
| Listar todos os carrinhos | GET | Sucesso | 200 |
| Validar campos: _id, produtos, precoTotal, quantidadeTotal, idUsuario | GET | Sucesso | 200 |
| Criar carrinho com produto valido | POST | Sucesso | 201 |
| Persistir produto no carrinho (verificar via GET) | POST | Sucesso | 201 |
| Rejeitar criacao sem token | POST | Falha | 401 |
| Rejeitar segundo carrinho para o mesmo usuario | POST | Falha | 400 |
| Buscar carrinho por ID existente | GET/:id | Sucesso | 200 |
| Validar precoTotal e quantidadeTotal calculados | GET/:id | Sucesso | 200 |
| Retornar 400 para ID inexistente | GET/:id | Falha | 400 |
| Concluir compra (remove carrinho, atualiza estoque) | DELETE /concluir | Sucesso | 200 |
| Retornar msg adequada sem carrinho ativo | DELETE /concluir | Edge case | 200 |
| Cancelar compra (remove carrinho, reintegra estoque) | DELETE /cancelar | Sucesso | 200 |

---

## Cenarios de teste - UI

### Login UI (/login)

| Cenario | Categoria | Resultado |
|---|---|---|
| Login com credenciais validas redireciona para /home | Sucesso | Pass |
| URL contem /home apos login bem-sucedido | Sucesso | Pass |
| Pagina Home carrega com conteudo visivel | Sucesso | Pass |
| Alerta de erro ao usar senha incorreta | Credenciais invalidas | Pass |
| Alerta de erro ao usar e-mail inexistente | Credenciais invalidas | Pass |
| Alerta de erro ao usar ambos os campos incorretos | Credenciais invalidas | Pass |
| Validacao de campo ao submeter sem e-mail | Campo obrigatorio | Pass |
| Validacao de campo ao submeter sem senha | Campo obrigatorio | Pass |
| 2 mensagens de erro ao submeter formulario vazio | Campo obrigatorio | Pass |
| Navegacao para cadastro ao clicar no link | Navegacao | Pass |
| Todos os campos visiveis no carregamento inicial | Elementos | Pass |

### Cadastro UI (/cadastrarusuarios)

| Cenario | Categoria | Resultado |
|---|---|---|
| Cadastrar usuario valido exibe alerta de sucesso | Sucesso | Pass |
| Link de sucesso clicavel apos cadastro | Sucesso | Pass |
| Redirecionar para /login ao clicar no link de sucesso | Sucesso | Pass |
| Cadastrar usuario administrador com sucesso | Sucesso | Pass |
| Alerta de erro ao usar e-mail ja cadastrado | E-mail duplicado | Pass |
| Erro de validacao ao submeter sem nome | Campo obrigatorio | Pass |
| Erro de validacao ao submeter sem e-mail | Campo obrigatorio | Pass |
| Erro de validacao ao submeter sem senha | Campo obrigatorio | Pass |
| 3+ erros ao submeter formulario completamente vazio | Campo obrigatorio | Pass |
| Todos os campos do formulario visiveis | Elementos | Pass |

### Home UI (/home)

| Cenario | Categoria | Resultado |
|---|---|---|
| Lista de produtos exibida com cards visiveis | Exibicao | Pass |
| Cards exibem nome do produto nao vazio | Exibicao | Pass |
| Campo de pesquisa visivel na Home | Exibicao | Pass |
| URL correta na pagina Home (/home) | Exibicao | Pass |
| Exibir resultados ao pesquisar por termo existente | Pesquisa | Pass |
| Filtrar apenas produtos correspondentes ao termo | Pesquisa | Pass |
| Limpar pesquisa e exibir todos os produtos | Pesquisa | Pass |
| Pesquisa sem resultados nao trava a pagina | Pesquisa | Pass |
| Botao adicionar ao carrinho visivel nos cards | Carrinho | Pass |
| Adicionar primeiro produto ao carrinho sem erros | Carrinho | Pass |
| Clicar em adicionar nao gera mensagem de erro | Carrinho | Pass |
| Sessao mantida ao recarregar (URL mantem /home) | Sessao | Pass |

---

## Arquitetura e padroes

**Page Object Model (POM)**
Cada tela tem uma classe dedicada (LoginPage, CadastroPage, HomePage) com metodos que
abstraem seletores e acoes, evitando duplicacao nos specs.

**Service Object Pattern**
LoginApi, UsuariosApi, ProdutosApi e CarrinhosApi encapsulam as requisicoes HTTP,
tornando os specs declarativos e independentes dos detalhes de request.

**Factory Pattern**
UserFactory, ProductFactory e CartFactory geram payloads com timestamps unicos,
garantindo que cada teste opera com dados proprios e isolados.

**Custom Commands**
Commands como autenticarViaApi, criarUsuarioViaApi e cancelarCompraViaApi
centralizam operacoes repetitivas de setup e teardown.

**Estrategia de login nos testes UI**
Testes UI que nao validam o fluxo de autenticacao usam loginViaApiENavegar,
mais rapido e robusto que navegar pela tela toda vez.

---

## Autor

Anderson Felipe - [GitHub](https://github.com/andersonfelipe15)
