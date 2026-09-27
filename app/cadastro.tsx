import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Switch,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProdutos } from '../src/context/ProdutosContext';
import { validarNome, validarPreco } from '../src/utils/validador';
import { Botao } from '../src/components/Botao';

/**
 * Tela de Cadastro de Produto.
 * Atende aos requisitos RF2, RT1, RT2 e RT3:
 * - Formulário com campos controlados para nome, preço e situação (ativo/inativo).
 * - A situação inicia como ativa (true) e permite alteração antes do envio.
 * - Validação estrita de nome e preço (aceita ponto ou vírgula, até 2 decimais, recusa caracteres inválidos, 0 e negativos).
 * - Erros exibidos claramente junto aos campos.
 * - Preserva dados digitados em caso de falha de validação e recusa o cadastro.
 * - Ao concluir com sucesso: adiciona ao provider, limpa o formulário e redireciona para a tela inicial.
 * - Acessível com teclado aberto via KeyboardAvoidingView e ScrollView.
 */
export default function TelaCadastro() {
  const router = useRouter();
  const { adicionarProduto } = useProdutos();

  // Estados locais do formulário (RF2 / RT2: valores em edição no estado local)
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [ativo, setAtivo] = useState(true);

  // Estados de erro para feedback visual
  const [erroNome, setErroNome] = useState<string | null>(null);
  const [erroPreco, setErroPreco] = useState<string | null>(null);
  const [submetido, setSubmetido] = useState(false);

  // Atualização dos campos preservando o estado e revalidando se já houve tentativa
  const handleMudarNome = (texto: string) => {
    setNome(texto);
    if (submetido || erroNome) {
      const res = validarNome(texto);
      setErroNome(res.valido ? null : (res.erro ?? null));
    }
  };

  const handleMudarPreco = (texto: string) => {
    setPreco(texto);
    if (submetido || erroPreco) {
      const res = validarPreco(texto);
      setErroPreco(res.valido ? null : (res.erro ?? null));
    }
  };

  const handleCadastrar = () => {
    setSubmetido(true);

    const validacaoNome = validarNome(nome);
    const validacaoPreco = validarPreco(preco);

    const novoErroNome = validacaoNome.valido ? null : (validacaoNome.erro ?? null);
    const novoErroPreco = validacaoPreco.valido ? null : (validacaoPreco.erro ?? null);

    setErroNome(novoErroNome);
    setErroPreco(novoErroPreco);

    // Se houver qualquer erro, recusa o cadastro preservando os campos
    if (!validacaoNome.valido || !validacaoPreco.valido || validacaoPreco.valor === undefined) {
      return;
    }

    // Cadastro válido: inclui no provider compartilhado
    adicionarProduto({
      nome: validacaoNome.valor!,
      preco: validacaoPreco.valor,
      ativo,
    });

    // Limpeza do formulário para os valores padrão iniciais (RF2)
    setNome('');
    setPreco('');
    setAtivo(true);
    setErroNome(null);
    setErroPreco(null);
    setSubmetido(false);

    // Direciona o usuário para a tela inicial sem necessidade de mensagem extra (RF2)
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  const handleCancelar = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formularioCard}>
            <Text style={styles.instrucoes}>
              Preencha as informações abaixo para adicionar um produto ao catálogo.
            </Text>

            {/* Campo Nome */}
            <View style={styles.grupoCampo}>
              <Text style={styles.rotulo}>
                Nome do produto <Text style={styles.obrigatorio}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, erroNome ? styles.inputErro : null]}
                value={nome}
                onChangeText={handleMudarNome}
                placeholder="Ex: Arroz 1 kg, Café 250 g"
                placeholderTextColor="#94A3B8"
                autoCapitalize="sentences"
                accessibilityLabel="Nome do produto"
              />
              {erroNome ? (
                <Text style={styles.textoErro}>{erroNome}</Text>
              ) : null}
            </View>

            {/* Campo Preço */}
            <View style={styles.grupoCampo}>
              <Text style={styles.rotulo}>
                Preço em reais (R$) <Text style={styles.obrigatorio}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, erroPreco ? styles.inputErro : null]}
                value={preco}
                onChangeText={handleMudarPreco}
                placeholder="Ex: 12,50 ou 12.50"
                placeholderTextColor="#94A3B8"
                autoCapitalize="none"
                autoCorrect={false}
                accessibilityLabel="Preço do produto em reais"
              />
              <Text style={styles.dicaCampo}>
                Use vírgula ou ponto para centavos (ex: 7,50 ou 12.90). Máximo de duas casas decimais.
              </Text>
              {erroPreco ? (
                <Text style={styles.textoErro}>{erroPreco}</Text>
              ) : null}
            </View>

            {/* Controle de Situação (Ativo / Inativo) */}
            <View style={styles.grupoSituacao}>
              <View style={styles.situacaoTextoContainer}>
                <Text style={styles.rotulo}>Situação inicial:</Text>
                <Text
                  style={[
                    styles.situacaoValor,
                    ativo ? styles.situacaoAtiva : styles.situacaoInativa,
                  ]}
                >
                  {ativo ? 'Ativo (disponível no catálogo)' : 'Inativo (indisponível)'}
                </Text>
              </View>

              <View style={styles.switchWrapper}>
                <Switch
                  value={ativo}
                  onValueChange={setAtivo}
                  trackColor={{ false: '#CBD5E1', true: '#93C5FD' }}
                  thumbColor={ativo ? '#2563EB' : '#64748B'}
                  accessibilityLabel="Situação inicial do produto: Ativo ou Inativo"
                />
              </View>
            </View>

            {/* Ações do Formulário */}
            <View style={styles.acoesContainer}>
              <Botao
                titulo="Cadastrar produto"
                onPress={handleCadastrar}
                variante="primary"
                style={styles.botaoCadastrar}
              />

              <Botao
                titulo="Cancelar"
                onPress={handleCancelar}
                variante="secondary"
                style={styles.botaoCancelar}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  formularioCard: {
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
  instrucoes: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 20,
  },
  grupoCampo: {
    marginBottom: 18,
  },
  rotulo: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
  },
  obrigatorio: {
    color: '#DC2626',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 14,
    fontSize: 16,
    color: '#0F172A',
    backgroundColor: '#FFFFFF',
  },
  inputErro: {
    borderColor: '#DC2626',
    backgroundColor: '#FEF2F2',
  },
  dicaCampo: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
  textoErro: {
    fontSize: 13,
    color: '#DC2626',
    marginTop: 6,
    fontWeight: '500',
  },
  grupoSituacao: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 24,
  },
  situacaoTextoContainer: {
    flex: 1,
    paddingRight: 8,
  },
  situacaoValor: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
  },
  situacaoAtiva: {
    color: '#059669',
  },
  situacaoInativa: {
    color: '#64748B',
  },
  switchWrapper: {
    marginLeft: 8,
  },
  acoesContainer: {
    marginTop: 8,
    gap: 12,
  },
  botaoCadastrar: {
    width: '100%',
  },
  botaoCancelar: {
    width: '100%',
  },
});
