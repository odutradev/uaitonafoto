import {
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Skeleton,
  Typography
} from '@mui/material'
import { CheckCircle as CheckIcon } from '@mui/icons-material'

import { formatPriceInBrl } from '@pages/public/landingPage/sections/plans/utils'

import {
  blockWrapperStyles,
  cardTopMetaRowStyles,
  checkIconStyles,
  ctaButtonStyles,
  featureRowStyles,
  featuresListStyles,
  getProductCardStyles,
  priceLineStyles,
  priceNumberStyles,
  singleCreditsGridStyles,
  storeWrapperStyles,
  subscriptionPlansGridStyles
} from './styles'
import type { CreditsAndPlansProps } from './types'

const FREE_PLAN_ID = 'free_trial'
const EXTRA_CREDIT_ID = 'prod_agency_extra_credit'

const CreditsAndPlans = ({
  plans,
  isLoading,
  checkoutPlanId,
  activeSubscriptionPlanIds,
  hasActiveSubscription,
  freeTrialClaimed,
  onSelectPlan
}: CreditsAndPlansProps) => {
  const isCheckoutBusy = checkoutPlanId !== null

  const singlePurchasePlans = plans.filter((plan) => {
    const isExtraCredit = plan.abacateProductId === EXTRA_CREDIT_ID || plan.id === EXTRA_CREDIT_ID
    if (isExtraCredit) return hasActiveSubscription

    return (
      plan.type === 'ONE_TIME' ||
      (plan.type === 'FREE' && !freeTrialClaimed)
    )
  })

  const subscriptionPlans = plans.filter((plan) => plan.type === 'SUBSCRIPTION')

  return (
    <Box id="loja-creditos" component="section" sx={storeWrapperStyles}>
      <Box sx={blockWrapperStyles}>
        <Box>
          <Typography variant="h5" component="h2">
            Comprar créditos avulsos
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Adquira créditos individuais para eventos únicos{hasActiveSubscription ? ' ou créditos extras de assinante' : ''}.
          </Typography>
        </Box>

        <Box sx={singleCreditsGridStyles}>
          {isLoading &&
            [0, 1, 2].map((skeletonKey) => (
              <Skeleton key={skeletonKey} variant="rounded" height={320} sx={{ borderRadius: '20px' }} />
            ))}

          {!isLoading &&
            singlePurchasePlans.map((plan) => {
              const targetId = plan.ctaHref || plan.id
              const isCurrentCheckingOut = checkoutPlanId === targetId
              const isExtraCredit = plan.abacateProductId === EXTRA_CREDIT_ID || plan.id === EXTRA_CREDIT_ID

              const periodLabel =
                plan.period ||
                (plan.type === 'FREE' ? 'sem cartão' : 'pagamento único')

              return (
                <Card
                  key={plan.id}
                  elevation={0}
                  sx={getProductCardStyles(isExtraCredit)}
                >
                  <Box sx={cardTopMetaRowStyles}>
                    <Chip
                      size="small"
                      variant={isExtraCredit ? 'filled' : 'outlined'}
                      color={isExtraCredit ? 'primary' : 'default'}
                      label={plan.tag || plan.badge || 'Avulso'}
                      sx={{ fontWeight: 700 }}
                    />
                    {plan.credits > 0 && (
                      <Typography variant="caption" fontWeight={800} color="text.secondary">
                        +{plan.credits} {plan.credits === 1 ? 'crédito' : 'créditos'}
                      </Typography>
                    )}
                  </Box>

                  <Box>
                    <Typography variant="h6" component="h3">
                      {plan.title || plan.name}
                    </Typography>
                    <Box sx={priceLineStyles}>
                      <Typography component="span" sx={priceNumberStyles}>
                        {formatPriceInBrl(plan.price)}
                      </Typography>
                      <Typography component="span" variant="body2" color="text.secondary">
                        {periodLabel}
                      </Typography>
                    </Box>
                  </Box>

                  <Typography variant="body2" color="text.secondary">
                    {plan.description}
                  </Typography>

                  <Box sx={featuresListStyles}>
                    {plan.features.map((feature) => (
                      <Box key={feature} sx={featureRowStyles}>
                        <CheckIcon sx={checkIconStyles} />
                        <Typography variant="body2">{feature}</Typography>
                      </Box>
                    ))}
                  </Box>

                  <Button
                    variant={plan.id === FREE_PLAN_ID ? 'outlined' : 'contained'}
                    color="primary"
                    disabled={isCheckoutBusy}
                    onClick={() => onSelectPlan(targetId)}
                    startIcon={isCurrentCheckingOut ? <CircularProgress size={18} color="inherit" /> : undefined}
                    sx={ctaButtonStyles}
                  >
                    {isCurrentCheckingOut
                      ? 'Iniciando...'
                      : plan.id === FREE_PLAN_ID
                        ? 'Resgatar grátis'
                        : 'Comprar agora'}
                  </Button>
                </Card>
              )
            })}
        </Box>
      </Box>

      <Box sx={blockWrapperStyles}>
        <Box>
          <Typography variant="h5" component="h2">
            Planos mensais recorrentes (Assessorias e Agências)
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Receba franquia mensal de eventos com rollover automático de 30 dias, selo White-Label e desconto em créditos extras.
          </Typography>
        </Box>

        <Box sx={subscriptionPlansGridStyles}>
          {isLoading &&
            [0, 1].map((skeletonKey) => (
              <Skeleton key={skeletonKey} variant="rounded" height={380} sx={{ borderRadius: '20px' }} />
            ))}

          {!isLoading &&
            subscriptionPlans.map((plan) => {
              const targetId = plan.ctaHref || plan.id
              const isCurrentCheckingOut = checkoutPlanId === targetId
              const isSubscribedToThis = activeSubscriptionPlanIds.includes(plan.id)

              return (
                <Card key={plan.id} elevation={0} sx={getProductCardStyles(plan.highlighted)}>
                  <Box sx={cardTopMetaRowStyles}>
                    <Chip
                      size="small"
                      color={plan.highlighted ? 'primary' : 'default'}
                      variant={plan.highlighted ? 'filled' : 'outlined'}
                      label={plan.badge || plan.tag || 'Mensal'}
                      sx={{ fontWeight: 700 }}
                    />
                    {plan.costPerEvent && (
                      <Typography variant="caption" fontWeight={700} color="success.main">
                        {plan.costPerEvent}
                      </Typography>
                    )}
                  </Box>

                  <Box>
                    <Typography variant="h5" component="h3">
                      {plan.title || plan.name}
                    </Typography>
                    <Box sx={priceLineStyles}>
                      <Typography component="span" sx={priceNumberStyles}>
                        {formatPriceInBrl(plan.price)}
                      </Typography>
                      <Typography component="span" variant="body2" color="text.secondary">
                        {plan.period || '/mês'}
                      </Typography>
                    </Box>
                  </Box>

                  <Typography variant="body2" color="text.secondary">
                    {plan.description}
                  </Typography>

                  <Box sx={featuresListStyles}>
                    {plan.features.map((feature) => (
                      <Box key={feature} sx={featureRowStyles}>
                        <CheckIcon sx={checkIconStyles} />
                        <Typography variant="body2">{feature}</Typography>
                      </Box>
                    ))}
                  </Box>

                  <Button
                    variant={plan.highlighted ? 'contained' : 'outlined'}
                    color="primary"
                    disabled={isCheckoutBusy || isSubscribedToThis}
                    onClick={() => onSelectPlan(targetId)}
                    startIcon={isCurrentCheckingOut ? <CircularProgress size={18} color="inherit" /> : undefined}
                    sx={ctaButtonStyles}
                  >
                    {isCurrentCheckingOut
                      ? 'Abrindo pagamento...'
                      : isSubscribedToThis
                        ? 'Plano ativo atual'
                        : plan.ctaText || 'Assinar plano'}
                  </Button>
                </Card>
              )
            })}
        </Box>
      </Box>
    </Box>
  )
}

export default CreditsAndPlans
