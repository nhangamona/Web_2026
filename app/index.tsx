import React from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProdutos } from '../src/context/ProdutosContext';
import { SecaoProdutos } from '../src/components/SecaoProdutos';

/**
 * Tela Inicial do Aplicativo.
 * Design atualizado fiel ao layout solicitado:
 * - Cabeçalho superior com título e botão "+ Cadastrar Novo Produto" lado a lado
 * - Subtítulo descritivo logo abaixo do título
 * - Seções separadas para "Produtos ativos" e "Produtos inativos"
 * - Grid responsivo de cards com miniatura e badges
 * - Caixa vazia com borda tracejada e ícone ilustrativo
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
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.conteudoPrincipal}>
          {/* Top Header: Título à esquerda e Botão de Ação à direita */}
          <View style={styles.topoContainer}>
            <View style={styles.topoTextos}>
              <Text style={styles.tituloApp}>Produtos do Comerciante</Text>
              <Text style={styles.subtituloApp}>
                Controle de catálogo e consulta de itens
              </Text>
            </View>

            <TouchableOpacity
              style={styles.botaoCadastrar}
              onPress={handleIrParaCadastro}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Cadastrar Novo Produto"
            >
              <Text style={styles.textoBotaoCadastrar}>+ Cadastrar Novo Produto</Text>
            </TouchableOpacity>
          </View>

          {/* Seção 1: Produtos Ativos */}
          <SecaoProdutos
            titulo="Produtos ativos"
            produtos={produtosAtivos}
            mensagemVazio="Nenhum produto ativo no momento."
            onSelecionarProduto={handleSelecionarProduto}
          />

          {/* Seção 2: Produtos Inativos */}
          <SecaoProdutos
            titulo="Produtos inativos"
            produtos={produtosInativos}
            mensagemVazio="Nenhum produto inativo no momento."
            onSelecionarProduto={handleSelecionarProduto}
          />
        </View>
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
    paddingVertical: 20,
    paddingHorizontal: 20,
    minHeight: '100%',
  },
  conteudoPrincipal: {
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
  },
  topoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 28,
    flexWrap: 'wrap',
    gap: 12,
  },
  topoTextos: {
    flex: 1,
    minWidth: 240,
  },
  tituloApp: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  subtituloApp: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 6,
  },
  botaoCadastrar: {
    backgroundColor: '#2563EB',
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  textoBotaoCadastrar: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
