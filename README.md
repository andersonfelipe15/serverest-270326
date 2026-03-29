# Serverest Automation
Automação de Testes – API e Frontend (Cypress)

Repositório destinado à automação de testes funcionais da aplicação Serverest, abrangendo cenários de API e Interface Web, com o objetivo de garantir qualidade, estabilidade e rastreabilidade das entregas.

# 📌 1. Clonando o Repositório
git clone https://github.com/andersonfelipe15/serverest-automation-101225.git

# 📚 2. Objetivo do Projeto

Este projeto tem como finalidade:

Validar serviços REST da plataforma Serverest

Garantir integridade dos fluxos críticos de interface

Padronizar execução e reporte de testes

Facilitar CI/CD em pipelines

Prover uma base consistente para evolução contínua do QA

A automação cobre os principais módulos do sistema, com cenários positivos e negativos, garantindo robustez e confiabilidade.

# 🧩 3. Escopo da Automação
✔ Testes de API

Endpoints cobertos:

Usuários

Login

Produtos

Carrinho

✔ Testes de Frontend

Fluxos validados:

Login

Cadastro de usuário

Listagem de produtos

Fluxo de compra

# 🗂️ 4. Estrutura do Projeto
```bash
serverest-automation/
│
├── cypress/
│   ├── e2e/
│   │   ├── api/
│   │   │   ├── usuarios.cy.js
│   │   │   ├── login.cy.js
│   │   │   ├── produtos.cy.js
│   │   │   └── carrinho.cy.js
│   │   ├── frontend/
│   │   │   ├── login-ui.cy.js
│   │   │   ├── cadastro-usuario-ui.cy.js
│   │   │   ├── lista-produtos-ui.cy.js
│   │   │   └── fluxo-compra-ui.cy.js
│   ├── fixtures/
│   ├── support/
│   │   ├── commands.js
│   │   ├── api-commands.js
│   │   └── utils.js
│
├── package.json
├── cypress.config.js
└── README.md
```
# ⚙️ 5. Tecnologias Utilizadas
Tecnologia	Finalidade
Cypress	Automação de testes Web e API
Node.js	Ambiente de execução
JavaScript	Linguagem dos testes
Faker.js	Geração de massa dinâmica
Serverest API	Backend utilizado como alvo dos cenários

# 🚀 6. Instalação e Execução
Instalar dependências:

npm init -y

E DEPOIS RODE:

npm install cypress --save-dev

▶️ Rodar Front:

npm run test:front

▶️ Rodar API:

npm run test:api

▶️ Abrir Cypress interativo:

npm run cy:open

# 🧪 7. Cenários Automatizados

A seguir estão descritos os principais cenários cobertos — apresentados no padrão corporativo de QA.

# 🔹 7.1. Testes de API
Usuários

Cenários Positivos

Criar usuário com dados válidos

Consultar lista de usuários

Buscar usuário por ID

Atualizar usuário existente

Excluir usuário ativo

Cenários Negativos

Criar usuário com e-mail já cadastrado

Consultar usuário inexistente

Atualizar usuário inválido

Excluir usuário inexistente

Login

Cenários Positivos

Login com credenciais válidas

Login como administrador

Cenários Negativos

Login com senha incorreta

Login com e-mail inválido

Login com campos obrigatórios ausentes

Produtos

Cenários Positivos

Criar produto com sucesso

Consultar lista de produtos

Atualizar produto válido

Excluir produto sem vínculo com carrinho

Cenários Negativos

Criar produto com nome duplicado

Atualizar produto inexistente

Excluir produto com carrinho associado

Carrinho

Cenários Positivos

Criar carrinho com 1 ou mais produtos

Finalizar compra com sucesso

Cancelar compra

Cenários Negativos

Criar carrinho com produto inexistente

Criar carrinho com quantidade negativa

Finalizar compra sem carrinho criado

# 🎨 7.2. Testes de Frontend (UI)
Login – UI

Cenários Positivos

Acessar página de login

Autenticar com credenciais válidas

Redirecionar usuário administrador para dashboard

Cenários Negativos

Senha incorreta

E-mail inválido

Não preencher campos obrigatórios

Cadastro de Usuário – UI

Cenários Positivos

Preencher e enviar formulário com sucesso

Exibir mensagem de confirmação

Cenários Negativos

E-mail duplicado

Campos obrigatórios vazios

Validação visual inadequada

Listagem de Produtos – UI

Cenários Positivos

Exibir produtos corretamente

Filtrar produtos

Acessar detalhes de um produto

Cenários Negativos

Produto sem imagem

Preço inválido exibido

Fluxo de Compra – UI

Cenários Positivos

Adicionar item ao carrinho

Visualizar carrinho

Finalizar compra

Cenários Negativos

Finalizar compra sem itens

Carrinho vazio após remoção

# 🛠️ 8. Comandos Customizados

O projeto inclui comandos reutilizáveis para melhorar a manutenção:

cy.loginAPI()

cy.createUser()

cy.createProduct()

cy.createCart()

cy.loginUI()

# 📦 9. Massa de Dados

Fontes utilizadas:

fixtures para massa fixa

Faker.js para dados dinâmicos

Intercepts para mockar respostas quando necessário

# 🧾 10. Boas Práticas do Projeto

O projeto segue padrões corporativos de QA:

Testes independentes entre si

Massa de dados isolada por cenário

Padronização de comandos reutilizáveis

Separação API vs UI

Nomeação consistente de arquivos e testes

Organização semântica nas pastas

Estrutura escalável para squads e pipelines

