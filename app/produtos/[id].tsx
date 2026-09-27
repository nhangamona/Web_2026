import React from 'react';
import { StyleSheet, View, Text, ScrollView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProdutos } from '../../src/context/ProdutosContext';
import { formatarMoeda } from '../../src/utils/formatador';
import { Botao } from '../../src/components/Botao';

/**
 * Tela de Detalhes e Alteração da Situação do Produto.
 * Rota dinâmica: /produtos/[id]
 *
 * Atende aos requisitos RF4, RT1, RT2 e RT3:
 * - A rota recebe apenas o id como parâmetro dinâmico.
 * - Consulta os dados mais recentes diretamente no contexto (sem receber cópias estáticas).
 * - Exibe nome, preço em reais e situação por escrito ("Ativo" ou "Inativo").
 * - Botão dinâmico: "Desativar produto" se ativo, ou "Ativar produto" se inativo.
 * - Alterna a situação no provider mantendo a navegação na mesma tela.
 * - Tratamento para produto inexistente com mensagem clara "Produto não encontrado"
 *   e botão de retorno à tela inicial, preservando o aplicativo utilizável (Cenário 8).
 * - Suporta retorno mesmo sem histórico de navegação (Cenário 9).
 */
export default function TelaDetalhesProduto() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { obterProdutoPorId, alternarSituacaoProduto } = useProdutos();

  // RT1 / RT2: Consulta o produto diretamente no contexto pelo id estável
  const produto = id ? obterProdutoPorId(id) : undefined;

  // RT1 / Cenário 9: Retorno funcional mesmo se acessado sem histórico prévio
  const handleVoltar = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  const handleAlternarSituacao = () => {
    if (produto) {
      alternarSituacaoProduto(produto.id);
    }
  };

  // RF4 & Cenário 8: Caso o ID não exista no contexto
  if (!produto) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
        <View style={styles.containerErro}>
          <View style={styles.cardErro}>
            <Text style={styles.iconeAlerta}>⚠️</Text>
            <Text style={styles.tituloErro}>Produto não encontrado</Text>
            <Text style={styles.descricaoErro}>
              O identificador &quot;{id || 'indefinido'}&quot; não corresponde a nenhum produto cadastrado
              ou o aplicativo foi recarregado.
            </Text>
            <Botao
              titulo="Retornar à tela inicial"
              onPress={handleVoltar}
              variante="primary"
              style={styles.botaoRetorno}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.cardDetalhes}>
          {/* Identificador estável do produto */}
          <View style={styles.linhaId}>
            <Text style={styles.rotuloId}>ID do produto:</Text>
            <Text style={styles.valorId} numberOfLines={1}>
              {produto.id}
            </Text>
          </View>

          {/* Nome do Produto */}
          <View style={styles.secaoInformacao}>
            <Text style={styles.rotulo}>Nome do produto</Text>
            <Text style={styles.valorNome}>{produto.nome}</Text>
          </View>

          {/* Preço do Produto */}
          <View style={styles.secaoInformacao}>
            <Text style={styles.rotulo}>Preço</Text>
            <Text style={styles.valorPreco}>{formatarMoeda(produto.preco)}</Text>
          </View>

          {/* Situação do Produto por extenso */}
          <View style={styles.secaoInformacao}>
            <Text style={styles.rotulo}>Situação</Text>
            <View style={styles.situacaoContainer}>
              <View
                style={[
                  styles.badgeSituacao,
                  produto.ativo ? styles.badgeAtivo : styles.badgeInativo,
                ]}
              >
                <Text
                  style={[
                    styles.textoBadgeSituacao,
                    produto.ativo ? styles.textoAtivo : styles.textoInativo,
                  ]}
                >
                  {produto.ativo ? 'Ativo' : 'Inativo'}
                </Text>
              </View>
              <Text style={styles.textoExplicativoSituacao}>
                {produto.ativo
                  ? 'Este produto está visível na lista de ativos.'
                  : 'Este produto está arquivado na lista de inativos.'}
              </Text>
            </View>
          </View>

          {/* Botão de Alternância da Situação (RF4) */}
          <View style={styles.acoesContainer}>
            <Botao
              titulo={produto.ativo ? 'Desativar produto' : 'Ativar produto'}
              onPress={handleAlternarSituacao}
              variante={produto.ativo ? 'danger' : 'success'}
              style={styles.botaoAcao}
            />

            <Botao
              titulo="Voltar para a lista"
              onPress={handleVoltar}
              variante="secondary"
              style={styles.botaoVoltar}
            />
          </View>
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
    padding: 16,
  },
  cardDetalhes: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  linhaId: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  rotuloId: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
    marginRight: 6,
  },
  valorId: {
    fontSize: 12,
    color: '#64748B',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    flex: 1,
  },
  secaoInformacao: {
    marginBottom: 20,
  },
  rotulo: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  valorNome: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
  },
  valorPreco: {
    fontSize: 26,
    fontWeight: '800',
    color: '#2563EB',
  },
  situacaoContainer: {
    marginTop: 2,
  },
  badgeSituacao: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 6,
  },
  badgeAtivo: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  badgeInativo: {
    backgroundColor: '#F1F5F9',
    borderColor: '#CBD5E1',
  },
  textoBadgeSituacao: {
    fontSize: 14,
    fontWeight: '700',
  },
  textoAtivo: {
    color: '#047857',
  },
  textoInativo: {
    color: '#475569',
  },
  textoExplicativoSituacao: {
    fontSize: 13,
    color: '#64748B',
  },
  acoesContainer: {
    marginTop: 12,
    gap: 12,
  },
  botaoAcao: {
    width: '100%',
  },
  botaoVoltar: {
    width: '100%',
  },
  containerErro: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  cardErro: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: '#FECACA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconeAlerta: {
    fontSize: 48,
    marginBottom: 12,
  },
  tituloErro: {
    fontSize: 20,
    fontWeight: '700',
    color: '#991B1B',
    marginBottom: 8,
    textAlign: 'center',
  },
  descricaoErro: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  botaoRetorno: {
    width: '100%',
  },
});
