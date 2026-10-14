/**
 * Funções de validação de dados para o cadastro de produtos.
 * Atende aos requisitos RF2 e aos testes da Tabela 2 (Cenários 2, 3 e 4).
 */

export interface ResultadoValidacao<T = unknown> {
  valido: boolean;
  valor?: T;
  erro?: string;
}

/**
 * Valida o nome do produto 
 * Deve ter pelo menos um caractere após remover espaços das extremidades.
 */
export function validarNome(nome: string): ResultadoValidacao<string> {
  const nomeLimpo = nome.trim();
  if (nomeLimpo.length === 0) {
    return {
      valido: false,
      erro: 'O nome do produto é obrigatório e não pode conter apenas espaços.',
    };
  }
  return {
    valido: true,
    valor: nomeLimpo,
  };
}

/**
 * Valida o preço do produto 
 * - Obrigatório
 * - Numérico
 * - Positivo sem sinal
 * - Separador decimal vírgula ou ponto
 **/
export function validarPreco(precoTexto: string): ResultadoValidacao<number> {
  const texto = precoTexto.trim();

  if (texto.length === 0) {
    return {
      valido: false,
      erro: 'O preço do produto é obrigatório.',
    };
  }

  // Verifica se há sinal explícito (+ ou -)
  if (texto.startsWith('-') || texto.startsWith('+')) {
    return {
      valido: false,
      erro: 'O preço não pode conter sinal (+ ou -) e deve ser positivo.',
    };
  }

  // Verifica se há caracteres não numéricos além de vírgula e ponto
  if (/[^\d.,]/.test(texto)) {
    return {
      valido: false,
      erro: 'O preço deve ser numérico e não pode conter letras ou outros caracteres.',
    };
  }

  // Verifica se há múltiplos separadores
  const contagemSeparadores = (texto.match(/[.,]/g) || []).length;
  if (contagemSeparadores > 1) {
    return {
      valido: false,
      erro: 'O preço deve conter no máximo um separador decimal.',
    };
  }

  // Validação estrita do padrão numérico com até 2 casas decimais
  const regexPreco = /^\d+([.,]\d{1,2})?$/;
  if (!regexPreco.test(texto)) {
    // Caso tenha mais de 2 casas decimais
    if (/^\d+[.,]\d{3,}$/.test(texto)) {
      return {
        valido: false,
        erro: 'O preço aceita no máximo duas casas decimais.',
      };
    }
    return {
      valido: false,
      erro: 'Formato de preço inválido. Exemplos válidos: 12, 12.5, 12,50 ou 12.50.',
    };
  }

  // Normaliza vírgula para ponto e converte para número
  const normalizado = texto.replace(',', '.');
  const numero = parseFloat(normalizado);

  if (isNaN(numero)) {
    return {
      valido: false,
      erro: 'Preço numérico inválido.',
    };
  }

  // Conforme Cenário 4 do Roteiro de Conferência da prova,
  // "0" é testado entre as entradas inválidas e deve ser recusado.
  if (numero <= 0) {
    return {
      valido: false,
      erro: 'O preço deve ser maior que zero.',
    };
  }

  return {
    valido: true,
    valor: numero,
  };
}
