import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
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
 **/
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
          <Image
            source={require('../../assets/images/empty-box.png')}
            style={styles.iconeCaixaVazia}
            resizeMode="contain"
          />
          <Text style={styles.mensagemVazio}>{mensagemVazio}</Text>
        </View>
      ) : (
        <View style={styles.gridCards}>
          {produtos.map((produto) => (
            <ProdutoCard
              key={produto.id}
              produto={produto}
              onPress={() => onSelecionarProduto(produto.id)}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
  },
  cabecalhoSecao: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  titulo: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginRight: 8,
  },
  contador: {
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    minWidth: 22,
    height: 22,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contadorTexto: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  gridCards: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  cardVazio: {
    width: '100%',
    backgroundColor: '#FAFCFE',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconeCaixaVazia: {
    width: 60,
    height: 60,
    opacity: 0.65,
    marginBottom: 12,
  },
  mensagemVazio: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    fontWeight: '500',
  },
});
