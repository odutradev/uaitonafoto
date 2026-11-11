import env from '@config/env'

export const DefaultCheckoutExpirationHours = 24

export const resolveCheckoutExpirationHours = (): number => env.CHECKOUT_EXPIRATION_HOURS ?? DefaultCheckoutExpirationHours

export const formatPaymentMethodLabel = (method?: string): string => {
  if (method === 'PIX') return 'PIX'
  if (method === 'CARD') return 'Cartão de crédito'
  return 'Cartão/PIX'
}
