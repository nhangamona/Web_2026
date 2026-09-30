import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  Switch,
  Platform,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProdutos } from '../../src/context/ProdutosContext';
import { formatarMoeda } from '../../src/utils/formatador';
import { validarNome, validarPreco } from '../../src/utils/validador';
import { Botao } from '../../src/components/Botao';

/**
 * Tela de Detalhes, Edição, Exclusão e Alteração da Situação do Produto.
 * Rota dinâmica: /produtos/[id]
 *
 * Funcionalidades:
 * - Consulta os dados mais recentes diretamente no contexto (sem receber cópias estáticas).
 * - Exibe nome, preço em reais e situação por escrito ("Ativo" ou "Inativo").
 * - Botão dinâmico: "Desativar produto" se ativo, ou "Ativar produto" se inativo.
 * - Edição de dados do produto (Nome, Preço e Situação) com validações completas.
 * - Exclusão de produto com confirmação prévia e retorno seguro à tela inicial.
 * - Tratamento para produto inexistente com mensagem clara "Produto não encontrado".
 * - Suporta retorno mesmo sem histórico de navegação.
 */
export default function TelaDetalhesProduto() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    obterProdutoPorId,
    alternarSituacaoProduto,
    atualizarProduto,
    excluirProduto,
  } = useProdutos();

  // Consulta o produto diretamente no contexto pelo id estável
  const produto = id ? obterProdutoPorId(id) : undefined;

  // Estados de Edição
  const [modoEdicao, setModoEdicao] = useState(false);
  const [nomeEditado, setNomeEditado] = useState('');
  const [precoEditado, setPrecoEditado] = useState('');
  const [ativoEditado, setAtivoEditado] = useState(true);
  const [erroNome, setErroNome] = useState<string | null>(null);
  const [erroPreco, setErroPreco] = useState<string | null>(null);

  // Estado de Confirmação de Exclusão
  const [modalExclusaoVisivel, setModalExclusaoVisivel] = useState(false);

  // Sincroniza campos quando o produto for carregado ou quando entrar em modo de edição
  useEffect(() => {
    if (produto) {
      setNomeEditado(produto.nome);
      setPrecoEditado(produto.preco.toFixed(2).replace('.', ','));
      setAtivoEditado(produto.ativo);
      setErroNome(null);
      setErroPreco(null);
    }
  }, [produto, modoEdicao]);

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

  const handleIniciarEdicao = () => {
    if (produto) {
      setNomeEditado(produto.nome);
      setPrecoEditado(produto.preco.toFixed(2).replace('.', ','));
      setAtivoEditado(produto.ativo);
      setErroNome(null);
      setErroPreco(null);
      setModoEdicao(true);
    }
  };

  const handleCancelarEdicao = () => {
    setModoEdicao(false);
    setErroNome(null);
    setErroPreco(null);
  };

  const handleSalvarEdicao = () => {
    if (!produto) return;

    const valNome = validarNome(nomeEditado);
    const valPreco = validarPreco(precoEditado);

    setErroNome(valNome.erro || null);
    setErroPreco(valPreco.erro || null);

    if (!valNome.valido || !valPreco.valido || valPreco.valor === undefined) {
      return;
    }

    atualizarProduto(produto.id, {
      nome: valNome.valor!,
      preco: valPreco.valor,
      ativo: ativoEditado,
    });

    setModoEdicao(false);
  };

  const handleConfirmarExclusao = () => {
    if (produto) {
      excluirProduto(produto.id);
      setModalExclusaoVisivel(false);
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/');
      }
    }
  };

  // Caso o ID não exista no contexto
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
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.cardDetalhes}>
          {/* Identificador estável do produto */}
          <View style={styles.linhaId}>
            <Text style={styles.rotuloId}>ID do produto:</Text>
            <Text style={styles.valorId} numberOfLines={1}>
              {produto.id}
            </Text>
          </View>

          {modoEdicao ? (
            /* ================= FORMULÁRIO DE EDIÇÃO ================= */
            <View style={styles.containerEdicao}>
              <Text style={styles.tituloSecaoEdicao}>Editar Informações do Produto</Text>

              {/* Campo Nome */}
              <View style={styles.grupoCampo}>
                <Text style={styles.rotulo}>
                  Nome do produto <Text style={styles.obrigatorio}>*</Text>
                </Text>
                <TextInput
                  style={[styles.input, erroNome ? styles.inputErro : null]}
                  value={nomeEditado}
                  onChangeText={(t) => {
                    setNomeEditado(t);
                    if (erroNome) setErroNome(null);
                  }}
                  placeholder="Nome do produto"
                  placeholderTextColor="#94A3B8"
                  accessibilityLabel="Nome do produto"
                />
                {erroNome ? <Text style={styles.textoErro}>{erroNome}</Text> : null}
              </View>

              {/* Campo Preço */}
              <View style={styles.grupoCampo}>
                <Text style={styles.rotulo}>
                  Preço em reais (R$) <Text style={styles.obrigatorio}>*</Text>
                </Text>
                <TextInput
                  style={[styles.input, erroPreco ? styles.inputErro : null]}
                  value={precoEditado}
                  onChangeText={(t) => {
                    setPrecoEditado(t);
                    if (erroPreco) setErroPreco(null);
                  }}
                  placeholder="Ex: 10,50"
                  placeholderTextColor="#94A3B8"
                  accessibilityLabel="Preço em reais"
                />
                {erroPreco ? <Text style={styles.textoErro}>{erroPreco}</Text> : null}
              </View>

              {/* Switch Situação */}
              <View style={styles.grupoSituacao}>
                <Text style={styles.rotulo}>Situação:</Text>
                <View style={styles.switchLinha}>
                  <Text style={[styles.situacaoTexto, ativoEditado ? styles.textoAtivo : styles.textoInativo]}>
                    {ativoEditado ? 'Ativo' : 'Inativo'}
                  </Text>
                  <Switch
                    value={ativoEditado}
                    onValueChange={setAtivoEditado}
                    trackColor={{ false: '#CBD5E1', true: '#93C5FD' }}
                    thumbColor={ativoEditado ? '#2563EB' : '#64748B'}
                  />
                </View>
              </View>

              {/* Ações de Edição */}
              <View style={styles.acoesEdicaoContainer}>
                <Botao
                  titulo="Salvar alterações"
                  onPress={handleSalvarEdicao}
                  variante="primary"
                  style={styles.botaoAcao}
                />
                <Botao
                  titulo="Cancelar edição"
                  onPress={handleCancelarEdicao}
                  variante="secondary"
                  style={styles.botaoAcao}
                />
              </View>
            </View>
          ) : (
            /* ================= VISUALIZAÇÃO DE DETALHES ================= */
            <>
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

              {/* Situação do Produto */}
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

              {/* Ações do Produto */}
              <View style={styles.acoesContainer}>
                {/* Botão Editar Produto */}
                <Botao
                  titulo="✏️ Editar produto"
                  onPress={handleIniciarEdicao}
                  variante="primary"
                  style={styles.botaoAcao}
                />

                {/* Botão de Alternância da Situação (RF4) */}
                <Botao
                  titulo={produto.ativo ? 'Desativar produto' : 'Ativar produto'}
                  onPress={handleAlternarSituacao}
                  variante={produto.ativo ? 'danger' : 'success'}
                  style={styles.botaoAcao}
                />

                {/* Botão Excluir Produto */}
                <TouchableOpacity
                  style={styles.botaoExcluir}
                  onPress={() => setModalExclusaoVisivel(true)}
                  activeOpacity={0.8}
                  accessibilityRole="button"
                  accessibilityLabel="Excluir produto"
                >
                  <Text style={styles.textoBotaoExcluir}>🗑️ Excluir produto</Text>
                </TouchableOpacity>

                {/* Botão Voltar */}
                <Botao
                  titulo="Voltar para a lista"
                  onPress={handleVoltar}
                  variante="secondary"
                  style={styles.botaoVoltar}
                />
              </View>
            </>
          )}
        </View>
      </ScrollView>

      {/* Modal de Confirmação de Exclusão */}
      <Modal
        visible={modalExclusaoVisivel}
        transparent
        animationType="fade"
        onRequestClose={() => setModalExclusaoVisivel(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalIcone}>🗑️</Text>
            <Text style={styles.modalTitulo}>Excluir Produto</Text>
            <Text style={styles.modalMensagem}>
              Tem certeza que deseja excluir o produto &quot;{produto.nome}&quot;? Esta ação removerá o item do catálogo e não poderá ser desfeita.
            </Text>

            <View style={styles.modalAcoes}>
              <TouchableOpacity
                style={styles.modalBotaoCancelar}
                onPress={() => setModalExclusaoVisivel(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.modalTextoCancelar}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalBotaoConfirmar}
                onPress={handleConfirmarExclusao}
                activeOpacity={0.8}
              >
                <Text style={styles.modalTextoConfirmar}>Sim, excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
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
  },
  secaoInformacao: {
    marginBottom: 18,
  },
  rotulo: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  obrigatorio: {
    color: '#EF4444',
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
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  badgeSituacao: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  badgeAtivo: {
    backgroundColor: '#DCFCE7',
  },
  badgeInativo: {
    backgroundColor: '#F1F5F9',
  },
  textoBadgeSituacao: {
    fontSize: 13,
    fontWeight: '700',
  },
  textoAtivo: {
    color: '#15803D',
  },
  textoInativo: {
    color: '#64748B',
  },
  textoExplicativoSituacao: {
    fontSize: 13,
    color: '#64748B',
  },
  acoesContainer: {
    marginTop: 24,
    gap: 12,
  },
  botaoAcao: {
    width: '100%',
  },
  botaoVoltar: {
    width: '100%',
    marginTop: 4,
  },
  botaoExcluir: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: '#FEF2F2',
    borderWidth: 1.5,
    borderColor: '#FCA5A5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoBotaoExcluir: {
    fontSize: 15,
    fontWeight: '700',
    color: '#DC2626',
  },
  /* Estilos de Edição */
  containerEdicao: {
    marginTop: 8,
  },
  tituloSecaoEdicao: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 16,
  },
  grupoCampo: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: '#0F172A',
    backgroundColor: '#F8FAFC',
  },
  inputErro: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  textoErro: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
    fontWeight: '500',
  },
  grupoSituacao: {
    marginBottom: 20,
  },
  switchLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 4,
  },
  situacaoTexto: {
    fontSize: 14,
    fontWeight: '600',
  },
  acoesEdicaoContainer: {
    gap: 10,
    marginTop: 10,
  },
  /* Modal de Exclusão */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 420,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  modalIcone: {
    fontSize: 40,
    marginBottom: 12,
  },
  modalTitulo: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  modalMensagem: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  modalAcoes: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalBotaoCancelar: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
  },
  modalTextoCancelar: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  modalBotaoConfirmar: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#DC2626',
    alignItems: 'center',
  },
  modalTextoConfirmar: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  /* Estados de Erro */
  containerErro: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  cardErro: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FECACA',
    width: '100%',
    maxWidth: 400,
  },
  iconeAlerta: {
    fontSize: 48,
    marginBottom: 12,
  },
  tituloErro: {
    fontSize: 18,
    fontWeight: '700',
    color: '#B91C1C',
    marginBottom: 8,
  },
  descricaoErro: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  botaoRetorno: {
    width: '100%',
  },
});
