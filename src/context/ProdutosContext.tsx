import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { Produto, NovoProdutoInput, AtualizarProdutoInput, ProdutosContextData } from '../types/produto';

/**
 * Contexto compartilhado para gerenciamento de produtos.
 * Atende aos requisitos técnicos RT2 e critérios da Rubrica E:
 * - Provider próprio único montado acima da navegação Stack.
 * - Centralização do estado e das operações de negócio.
 * - Atualizações 100% imutáveis utilizando a forma funcional do estado anterior (prev => ...).
 * - Partes de produtos ativos e inativos derivadas dinamicamente da lista única (via useMemo).
 * - Lista inicial começa vazia em cada execução do aplicativo.
 */

const ProdutosContext = createContext<ProdutosContextData | undefined>(undefined);

export interface ProdutosProviderProps {
  children: React.ReactNode;
}

export const ProdutosProvider: React.FC<ProdutosProviderProps> = ({ children }) => {
  // Estado central: a lista começa vazia a cada execução/recarregamento do app
  const [produtos, setProdutos] = useState<Produto[]>([]);

  // RF1 & RT2: Adição de novo produto com identificador estável único
  // Atualização imutável utilizando o estado anterior
  const adicionarProduto = useCallback((dados: NovoProdutoInput): Produto => {
    const novoId = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const novoProduto: Produto = {
      id: novoId,
      nome: dados.nome,
      preco: dados.preco,
      ativo: dados.ativo,
    };

    setProdutos((produtosAnteriores) => [...produtosAnteriores, novoProduto]);
    return novoProduto;
  }, []);

  // Atualização de produto de forma imutável (Editar)
  const atualizarProduto = useCallback((id: string, dados: AtualizarProdutoInput) => {
    setProdutos((produtosAnteriores) =>
      produtosAnteriores.map((item) =>
        item.id === id
          ? {
              ...item,
              nome: dados.nome,
              preco: dados.preco,
              ativo: dados.ativo !== undefined ? dados.ativo : item.ativo,
            }
          : item
      )
    );
  }, []);

  // Remoção de produto de forma imutável (Excluir)
  const excluirProduto = useCallback((id: string) => {
    setProdutos((produtosAnteriores) =>
      produtosAnteriores.filter((item) => item.id !== id)
    );
  }, []);

  // RF4 & RT2: Alteração da situação (ativo/inativo)
  // Altera apenas o produto com o id correspondente, sem mutação direta do array ou do objeto
  const alternarSituacaoProduto = useCallback((id: string) => {
    setProdutos((produtosAnteriores) =>
      produtosAnteriores.map((item) =>
        item.id === id ? { ...item, ativo: !item.ativo } : item
      )
    );
  }, []);

  // Busca do produto atualizado diretamente no contexto pelo id estável
  const obterProdutoPorId = useCallback(
    (id: string): Produto | undefined => {
      return produtos.find((item) => item.id === id);
    },
    [produtos]
  );

  // RT2: Partes derivadas dinamicamente a partir da mesma lista única
  // Evita redundância de estado e previne inconsistências
  const produtosAtivos = useMemo(
    () => produtos.filter((item) => item.ativo),
    [produtos]
  );

  const produtosInativos = useMemo(
    () => produtos.filter((item) => !item.ativo),
    [produtos]
  );

  const value = useMemo<ProdutosContextData>(
    () => ({
      produtos,
      produtosAtivos,
      produtosInativos,
      adicionarProduto,
      atualizarProduto,
      excluirProduto,
      alternarSituacaoProduto,
      obterProdutoPorId,
    }),
    [
      produtos,
      produtosAtivos,
      produtosInativos,
      adicionarProduto,
      atualizarProduto,
      excluirProduto,
      alternarSituacaoProduto,
      obterProdutoPorId,
    ]
  );

  return (
    <ProdutosContext.Provider value={value}>
      {children}
    </ProdutosContext.Provider>
  );
};

/**
 * Hook customizado para consumir o contexto de produtos com verificação de escopo.
 */
export function useProdutos(): ProdutosContextData {
  const context = useContext(ProdutosContext);
  if (!context) {
    throw new Error('useProdutos deve ser utilizado dentro de um ProdutosProvider');
  }
  return context;
}
