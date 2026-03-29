/**
 * UserFactory — Factory Pattern para geração de dados de usuários
 *
 * Centraliza a criação de payloads de usuário, garantindo
 * unicidade e consistência nos dados de teste.
 */
class UserFactory {
  static _timestamp() {
    return Date.now()
  }

  /**
   * Cria um usuário padrão (não administrador)
   * @param {Object} overrides - Sobrescreve campos padrão
   * @returns {Object}
   */
  static create(overrides = {}) {
    const ts = UserFactory._timestamp()
    return {
      nome: `QA User ${ts}`,
      email: `qa.user.${ts}@serverest.dev`,
      password: 'Test@2024',
      administrador: 'false',
      ...overrides,
    }
  }

  /**
   * Cria um usuário administrador
   * @param {Object} overrides - Sobrescreve campos padrão
   * @returns {Object}
   */
  static createAdmin(overrides = {}) {
    return UserFactory.create({ administrador: 'true', ...overrides })
  }

  /**
   * Cria payload inválido por cenário para testes negativos
   * @param {'semNome'|'semEmail'|'semSenha'|'emailInvalido'} scenario
   * @returns {Object}
   */
  static createInvalid(scenario = 'semEmail') {
    const ts = UserFactory._timestamp()
    const scenarios = {
      semNome: {
        nome: '',
        email: `qa.user.${ts}@serverest.dev`,
        password: 'Test@2024',
        administrador: 'false',
      },
      semEmail: {
        nome: `QA User ${ts}`,
        email: '',
        password: 'Test@2024',
        administrador: 'false',
      },
      semSenha: {
        nome: `QA User ${ts}`,
        email: `qa.user.${ts}@serverest.dev`,
        password: '',
        administrador: 'false',
      },
      emailInvalido: {
        nome: `QA User ${ts}`,
        email: 'email-invalido',
        password: 'Test@2024',
        administrador: 'false',
      },
    }
    return scenarios[scenario] ?? scenarios.semEmail
  }
}

module.exports = UserFactory
