import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ProdutosProvider } from '../src/context/ProdutosContext';

/**
 * Layout raiz da aplicação.
 * Atende aos requisitos RT1 e RT2:
 * - O ProdutosProvider é montado como instância única no topo da hierarquia,
 *   cobrindo todas as telas e rotas da aplicação.
 * - Utiliza a navegação Stack baseada em arquivos do Expo Router.
 * - Não utiliza abas (Tabs/NativeTabs).
 */
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ProdutosProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: '#FFFFFF',
            },
            headerTintColor: '#1E293B',
            headerTitleStyle: {
              fontWeight: '700',
              fontSize: 18,
            },
            headerShadowVisible: false,
            contentStyle: {
              backgroundColor: '#F8FAFC',
            },
          }}
        >
          <Stack.Screen
            name="index"
            options={{
              title: 'Produtos do Comerciante',
            }}
          />
          <Stack.Screen
            name="cadastro"
            options={{
              title: 'Novo Produto',
            }}
          />
          <Stack.Screen
            name="produtos/[id]"
            options={{
              title: 'Detalhes do Produto',
            }}
          />
        </Stack>
      </ProdutosProvider>
    </SafeAreaProvider>
  );
}
