import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Produto } from '../types/produto';
import { formatarMoeda } from '../utils/formatador';

interface ProdutoCardProps {
  produto: Produto;
  onPress: () => void;
}

/**
 * Card para exibição de item na lista da tela inicial.
 * Atende aos requisitos RF3 e RT3:
 * - Apresenta nome e preço formatado em reais (ex: R$ 12,50).
 * - Identificador estável usado como chave na listagem.
 * - Toque no item aciona a navegação para os detalhes.
 * - Rótulo de situação por extenso ("Ativo" / "Inativo"), não apenas por cor.
 */
export const ProdutoCard: React.FC<ProdutoCardProps> = ({ produto, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`Produto ${produto.nome}, Preço ${formatarMoeda(produto.preco)}, Situação ${produto.ativo ? 'Ativo' : 'Inativo'}`}
      accessibilityHint="Toque para ver os detalhes deste produto"
    >
      <View style={styles.conteudo}>
        <View style={styles.dadosPrincipais}>
          <Text style={styles.nome} numberOfLines={2}>
            {produto.nome}
          </Text>
          <Text style={styles.preco}>
            {formatarMoeda(produto.preco)}
          </Text>
        </View>

        <View style={[styles.badge, produto.ativo ? styles.badgeAtivo : styles.badgeInativo]}>
          <Text
            style={[
              styles.badgeTexto,
              produto.ativo ? styles.badgeTextoAtivo : styles.badgeTextoInativo,
            ]}
          >
            {produto.ativo ? 'Ativo' : 'Inativo'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  conteudo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dadosPrincipais: {
    flex: 1,
    marginRight: 12,
  },
  nome: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 4,
  },
  preco: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2563EB',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    borderWidth: 1,
  },
  badgeAtivo: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  badgeInativo: {
    backgroundColor: '#F1F5F9',
    borderColor: '#CBD5E1',
  },
  badgeTexto: {
    fontSize: 12,
    fontWeight: '600',
  },
  badgeTextoAtivo: {
    color: '#047857',
  },
  badgeTextoInativo: {
    color: '#475569',
  },
});
