/**
 * ProductFactory — Factory Pattern para geração de dados de produtos
 */
class ProductFactory {
  static _timestamp() {
    return Date.now()
  }

  /**
   * Cria um produto válido com dados únicos
   * @param {Object} overrides - Sobrescreve campos padrão
   * @returns {Object}
   */
  static create(overrides = {}) {
    const ts = ProductFactory._timestamp()
    return {
      nome: `Produto QA ${ts}`,
      preco: 199,
      descricao: `Produto de teste automatizado ${ts}`,
      quantidade: 50,
      ...overrides,
    }
  }

  /**
   * Cria payload inválido por cenário para testes negativos
   * @param {'semNome'|'semPreco'|'precoNegativo'|'semQuantidade'} scenario
   * @returns {Object}
   */
  static createInvalid(scenario = 'semNome') {
    const ts = ProductFactory._timestamp()
    const scenarios = {
      semNome: {
        preco: 100,
        descricao: `Produto ${ts}`,
        quantidade: 10,
      },
      semPreco: {
        nome: `Produto QA ${ts}`,
        descricao: `Produto ${ts}`,
        quantidade: 10,
      },
      precoNegativo: {
        nome: `Produto QA ${ts}`,
        preco: -1,
        descricao: `Produto ${ts}`,
        quantidade: 10,
      },
      semQuantidade: {
        nome: `Produto QA ${ts}`,
        preco: 100,
        descricao: `Produto ${ts}`,
      },
    }
    return scenarios[scenario] ?? scenarios.semNome
  }
}

module.exports = ProductFactory
