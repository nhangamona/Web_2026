import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  ActivityIndicator,
} from 'react-native';

interface BotaoProps extends TouchableOpacityProps {
  titulo: string;
  variante?: 'primary' | 'secondary' | 'danger' | 'success';
  carregando?: boolean;
}

/**
 * Componente de botão reutilizável e acessível.
 * Atende aos requisitos técnicos RT3:
 * - Textos claros nos botões.
 * - Feedback visual de interação e estado desabilitado.
 * - Boas práticas de acessibilidade.
 */
export const Botao: React.FC<BotaoProps> = ({
  titulo,
  variante = 'primary',
  carregando = false,
  disabled,
  style,
  ...rest
}) => {
  const estaDesabilitado = disabled || carregando;

  return (
    <TouchableOpacity
      style={[
        styles.botao,
        styles[variante],
        estaDesabilitado && styles.desabilitado,
        style,
      ]}
      disabled={estaDesabilitado}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityState={{ disabled: estaDesabilitado }}
      {...rest}
    >
      {carregando ? (
        <ActivityIndicator
          color={variante === 'secondary' ? '#2563EB' : '#FFFFFF'}
          size="small"
        />
      ) : (
        <Text
          style={[
            styles.texto,
            variante === 'secondary' ? styles.textoSecundario : styles.textoPrimario,
            estaDesabilitado && styles.textoDesabilitado,
          ]}
        >
          {titulo}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  botao: {
    height: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    flexDirection: 'row',
  },
  primary: {
    backgroundColor: '#2563EB',
  },
  secondary: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  danger: {
    backgroundColor: '#DC2626',
  },
  success: {
    backgroundColor: '#16A34A',
  },
  desabilitado: {
    backgroundColor: '#CBD5E1',
    borderColor: '#CBD5E1',
  },
  texto: {
    fontSize: 16,
    fontWeight: '600',
  },
  textoPrimario: {
    color: '#FFFFFF',
  },
  textoSecundario: {
    color: '#1E293B',
  },
  textoDesabilitado: {
    color: '#64748B',
  },
});
