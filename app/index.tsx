import React from 'react';
import { StyleSheet, View, ScrollView, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProdutos } from '../src/context/ProdutosContext';
import { SecaoProdutos } from '../src/components/SecaoProdutos';
import { Botao } from '../src/components/Botao';

/**
 * Tela Inicial do Aplicativo.
 * Atende aos requisitos RF3, RT1 e RT2:
 * - Apresenta as listas separadas por "Produtos ativos" e "Produtos inativos".
 * - Cada produto pertence exclusivamente a uma das seções.
 * - Mensagens explicativas claras para seções sem produtos.
 * - Toque no item navega para a rota dinâmica /produtos/[id].
 * - Botão destacado para navegar até o formulário de cadastro.
 */
export default function TelaInicial() {
  const router = useRouter();
  const { produtosAtivos, produtosInativos } = useProdutos();

  const handleIrParaCadastro = () => {
    router.push('/cadastro');
  };

  const handleSelecionarProduto = (id: string) => {
    router.push(`/produtos/${id}`);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.banner}>
          <Text style={styles.bannerSubtitulo}>
            Controle de catálogo e consulta de itens
          </Text>
        </View>

        <View style={styles.acaoCadastro}>
          <Botao
            titulo="+ Cadastrar Novo Produto"
            onPress={handleIrParaCadastro}
            variante="primary"
          />
        </View>

        <SecaoProdutos
          titulo="Produtos ativos"
          produtos={produtosAtivos}
          mensagemVazio="Nenhum produto ativo cadastrado no momento."
          onSelecionarProduto={handleSelecionarProduto}
        />

        <SecaoProdutos
          titulo="Produtos inativos"
          produtos={produtosInativos}
          mensagemVazio="Nenhum produto inativo cadastrado no momento."
          onSelecionarProduto={handleSelecionarProduto}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  banner: {
    marginBottom: 16,
  },
  bannerSubtitulo: {
    fontSize: 14,
    color: '#64748B',
  },
  acaoCadastro: {
    marginBottom: 24,
  },
});
