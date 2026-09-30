import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { Produto } from '../types/produto';
import { formatarMoeda } from '../utils/formatador';

interface ProdutoCardProps {
  produto: Produto;
  onPress: () => void;
}

/**
 * Card para exibição de item na lista da tela inicial.
 * Design alinhado com layout moderno em grid:
 * - Ícone miniatura à esquerda
 * - Nome e Preço formatado
 * - Badge com indicador colorido e rótulo textual ("● Ativo" / "● Inativo")
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
        {/* Miniatura do produto à esquerda */}
        <View style={styles.iconeWrapper}>
          <Image
            source={require('../../assets/images/placeholder-image.png')}
            style={styles.iconeImagem}
            resizeMode="contain"
          />
        </View>

        {/* Nome e Preço */}
        <View style={styles.dadosPrincipais}>
          <Text style={styles.nome} numberOfLines={1}>
            {produto.nome}
          </Text>
          <Text style={styles.preco}>
            {formatarMoeda(produto.preco)}
          </Text>
        </View>

        {/* Badge de Situação com Ponto indicador */}
        <View style={[styles.badge, produto.ativo ? styles.badgeAtivo : styles.badgeInativo]}>
          <View
            style={[
              styles.pontoIndicador,
              produto.ativo ? styles.pontoAtivo : styles.pontoInativo,
            ]}
          />
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
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    flexGrow: 1,
    flexBasis: 280,
    maxWidth: 420,
    minWidth: 260,
  },
  conteudo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconeWrapper: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconeImagem: {
    width: 26,
    height: 26,
    opacity: 0.75,
  },
  dadosPrincipais: {
    flex: 1,
    marginRight: 10,
  },
  nome: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  preco: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2563EB',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    borderWidth: 1,
  },
  badgeAtivo: {
    backgroundColor: '#ECFDF5',
    borderColor: '#D1FAE5',
  },
  badgeInativo: {
    backgroundColor: '#F1F5F9',
    borderColor: '#E2E8F0',
  },
  pontoIndicador: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 6,
  },
  pontoAtivo: {
    backgroundColor: '#10B981',
  },
  pontoInativo: {
    backgroundColor: '#94A3B8',
  },
  badgeTexto: {
    fontSize: 12,
    fontWeight: '600',
  },
  badgeTextoAtivo: {
    color: '#059669',
  },
  badgeTextoInativo: {
    color: '#64748B',
  },
});
