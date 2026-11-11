export const formatCurrencyBRL = (amountInCents: number): string =>
  (amountInCents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
