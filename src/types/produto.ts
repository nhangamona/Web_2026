/**
 * Definição dos tipos do domínio de Produto e do Contrato do Contexto.
 * Atende aos requisitos funcionais RF1 e técnicos RT2 e RT3.
 */

export interface Produto {
  /** Identificador estável gerado no momento do cadastro */
  id: string;
  /** Nome do produto (pelo menos 1 caractere não vazio) */
  nome: string;
  /** Preço numérico em reais */
  preco: number;
  /** Situação booleana: true para ativo, false para inativo */
  ativo: boolean;
}

export interface NovoProdutoInput {
  nome: string;
  preco: number;
  ativo: boolean;
}

export interface AtualizarProdutoInput {
  nome: string;
  preco: number;
  ativo?: boolean;
}

export interface ProdutosContextData {
  /** Lista centralizada de todos os produtos cadastrados */
  produtos: Produto[];
  /** Produtos com ativo === true (calculados/derivados do estado central) */
  produtosAtivos: Produto[];
  /** Produtos com ativo === false (calculados/derivados do estado central) */
  produtosInativos: Produto[];
  /** Adiciona um novo produto de forma imutável à lista */
  adicionarProduto: (dados: NovoProdutoInput) => Produto;
  /** Atualiza os dados de um produto existente sem mutação direta */
  atualizarProduto: (id: string, dados: AtualizarProdutoInput) => void;
  /** Remove um produto da lista de forma imutável */
  excluirProduto: (id: string) => void;
  /** Alterna a situação de ativo/inativo de um produto pelo id sem mutação */
  alternarSituacaoProduto: (id: string) => void;
  /** Busca um produto pelo identificador */
  obterProdutoPorId: (id: string) => Produto | undefined;
}
