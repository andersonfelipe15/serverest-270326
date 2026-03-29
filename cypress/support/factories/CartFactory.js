/**
 * CartFactory — Factory Pattern para geração de dados de carrinhos
 */
class CartFactory {
  /**
   * Cria payload de carrinho com um produto
   * @param {string} idProduto - ID do produto a adicionar
   * @param {number} quantidade - Quantidade do produto
   * @param {Object} overrides - Sobrescreve campos padrão
   * @returns {Object}
   */
  static create(idProduto, quantidade = 1, overrides = {}) {
    return {
      produtos: [{ idProduto, quantidade }],
      ...overrides,
    }
  }

  /**
   * Cria payload de carrinho com múltiplos produtos
   * @param {Array<{idProduto: string, quantidade: number}>} produtos
   * @returns {Object}
   */
  static createWithMultiple(produtos = []) {
    return { produtos }
  }
}

module.exports = CartFactory
