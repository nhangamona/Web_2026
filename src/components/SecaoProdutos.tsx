import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Produto } from '../types/produto';
import { ProdutoCard } from './ProdutoCard';

interface SecaoProdutosProps {
  titulo: string;
  produtos: Produto[];
  mensagemVazio: string;
  onSelecionarProduto: (id: string) => void;
}

/**
 * Seção de exibição de lista para produtos ativos ou inativos.
 * Atende ao requisito funcional RF3:
 * - Apresenta cabeçalho com o título da seção ("Produtos ativos" ou "Produtos inativos").
 * - Se estiver vazia, exibe mensagem explicativa clara na parte correspondente.
 * - Utiliza a chave estável (produto.id) na renderização dos itens.
 */
export const SecaoProdutos: React.FC<SecaoProdutosProps> = ({
  titulo,
  produtos,
  mensagemVazio,
  onSelecionarProduto,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.cabecalhoSecao}>
        <Text style={styles.titulo}>{titulo}</Text>
        <View style={styles.contador}>
          <Text style={styles.contadorTexto}>{produtos.length}</Text>
        </View>
      </View>

      {produtos.length === 0 ? (
        <View style={styles.cardVazio}>
          <Text style={styles.mensagemVazio}>{mensagemVazio}</Text>
        </View>
      ) : (
        produtos.map((produto) => (
          <ProdutoCard
            key={produto.id}
            produto={produto}
            onPress={() => onSelecionarProduto(produto.id)}
          />
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  cabecalhoSecao: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  titulo: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginRight: 8,
  },
  contador: {
    backgroundColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  contadorTexto: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  cardVazio: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mensagemVazio: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
