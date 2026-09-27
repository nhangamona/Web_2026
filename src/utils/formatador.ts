/**
 * Utilitários de formatação de valores monetários.
 * Atende ao requisito funcional RF3:
 * Formata em reais com duas casas decimais e vírgula como separador decimal.
 * Exemplo: R$ 12,50
 */

export function formatarMoeda(valor: number): string {
  if (isNaN(valor)) {
    return 'R$ 0,00';
  }
  return `R$ ${valor.toFixed(2).replace('.', ',')}`;
}
