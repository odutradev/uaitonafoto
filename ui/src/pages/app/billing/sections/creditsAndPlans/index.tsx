import {
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Skeleton,
  Typography
} from '@mui/material'
import { Check as CheckIcon } from '@mui/icons-material'

import { formatPriceInBrl } from '@pages/public/landingPage/sections/plans/utils'

import {
  blockWrapperStyles,
  cardTopMetaRowStyles,
  checkIconStyles,
  ctaButtonStyles,
  featureRowStyles,
  featuresListStyles,
  getPlanCardStyles,
  getSingleCreditsGridStyles,
  priceLineStyles,
  priceNumberStyles,
  singleCreditActionColStyles,
  singleCreditButtonStyles,
  singleCreditCardStyles,
  singleCreditInfoStyles,
  singleCreditTitleRowStyles,
  storeWrapperStyles,
  subscriptionPlansGridStyles
} from './styles'
import type { CreditsAndPlansProps } from './types'

const EXTRA_CREDIT_ID = 'prod_agency_extra_credit'

const CreditsAndPlans = ({
  plans,
  isLoading,
  checkoutPlanId,
  activeSubscriptionPlanIds,
  hasActiveSubscription,
  onSelectPlan
}: CreditsAndPlansProps) => {
  const isCheckoutBusy = checkoutPlanId !== null

  const singlePurchasePlans = plans.filter((plan) => {
    const isExtraCredit = plan.abacateProductId === EXTRA_CREDIT_ID || plan.id === EXTRA_CREDIT_ID
    if (isExtraCredit) return hasActiveSubscription
    return plan.type === 'ONE_TIME'
  })

  const subscriptionPlans = plans.filter((plan) => plan.type === 'SUBSCRIPTION')

  return (
    <Box component="section" sx={storeWrapperStyles}>
      <Box sx={blockWrapperStyles}>
        <Typography variant="h6" component="h2">
          Créditos avulsos
        </Typography>

        <Box sx={getSingleCreditsGridStyles(isLoading ? 2 : singlePurchasePlans.length)}>
          {isLoading && (
            <Skeleton variant="rounded" height={96} sx={{ borderRadius: '20px' }} />
          )}

          {!isLoading &&
            singlePurchasePlans.map((plan) => {
              const targetId = plan.ctaHref || plan.id
              const isCurrentCheckingOut = checkoutPlanId === targetId
              const isExtraCredit = plan.abacateProductId === EXTRA_CREDIT_ID || plan.id === EXTRA_CREDIT_ID

              return (
                <Card key={plan.id} elevation={0} sx={singleCreditCardStyles}>
                  <Box sx={singleCreditInfoStyles}>
                    <Box sx={singleCreditTitleRowStyles}>
                      <Typography variant="subtitle1" component="h3" fontWeight={800}>
                        {plan.title || plan.name}
                      </Typography>
                      <Chip
                        size="small"
                        color={isExtraCredit ? 'primary' : 'default'}
                        variant={isExtraCredit ? 'filled' : 'outlined'}
                        label={`+${plan.credits} ${plan.credits === 1 ? 'crédito' : 'créditos'}`}
                        sx={{ fontWeight: 700, height: 22 }}
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {plan.subBadge || plan.description}
                    </Typography>
                  </Box>

                  <Box sx={singleCreditActionColStyles}>
                    <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                      <Typography variant="h6" component="p" fontWeight={800} sx={{ lineHeight: 1.1 }}>
                        {formatPriceInBrl(plan.price)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {plan.period || 'pagamento único'}
                      </Typography>
                    </Box>

                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      disabled={isCheckoutBusy}
                      onClick={() => onSelectPlan(targetId)}
                      startIcon={isCurrentCheckingOut ? <CircularProgress size={16} color="inherit" /> : undefined}
                      sx={singleCreditButtonStyles}
                    >
                      {isCurrentCheckingOut ? 'Iniciando...' : 'Comprar'}
                    </Button>
                  </Box>
                </Card>
              )
            })}
        </Box>
      </Box>

      <Box sx={blockWrapperStyles}>
        <Typography variant="h6" component="h2">
          Planos mensais
        </Typography>

        <Box sx={subscriptionPlansGridStyles}>
          {isLoading &&
            [0, 1].map((skeletonKey) => (
              <Skeleton key={skeletonKey} variant="rounded" height={300} sx={{ borderRadius: '20px' }} />
            ))}

          {!isLoading &&
            subscriptionPlans.map((plan) => {
              const targetId = plan.ctaHref || plan.id
              const isCurrentCheckingOut = checkoutPlanId === targetId
              const isSubscribedToThis = activeSubscriptionPlanIds.includes(plan.id)

              return (
                <Card key={plan.id} elevation={0} sx={getPlanCardStyles(plan.highlighted)}>
                  <Box>
                    <Box sx={cardTopMetaRowStyles}>
                      <Typography variant="h6" component="h3">
                        {plan.title || plan.name}
                      </Typography>
                      {(isSubscribedToThis || plan.highlighted) && (
                        <Chip
                          size="small"
                          color={isSubscribedToThis ? 'success' : 'primary'}
                          label={isSubscribedToThis ? 'Plano atual' : 'Mais escolhido'}
                          sx={{ fontWeight: 700, height: 22 }}
                        />
                      )}
                    </Box>

                    <Box sx={{ ...priceLineStyles, mt: 1 }}>
                      <Typography component="span" sx={priceNumberStyles}>
                        {formatPriceInBrl(plan.price)}
                      </Typography>
                      <Typography component="span" variant="body2" color="text.secondary">
                        {plan.period || '/mês'}
                      </Typography>
                    </Box>

                    {plan.costPerEvent && (
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.25 }}>
                        {plan.costPerEvent}
                      </Typography>
                    )}
                  </Box>

                  <Box sx={featuresListStyles}>
                    {plan.features.map((feature) => (
                      <Box key={feature} sx={featureRowStyles}>
                        <CheckIcon sx={checkIconStyles} />
                        <Typography variant="body2" color="text.secondary">
                          {feature}
                        </Typography>
                      </Box>
                    ))}
                  </Box>

                  <Button
                    variant={plan.highlighted ? 'contained' : 'outlined'}
                    color="primary"
                    disabled={isCheckoutBusy || isSubscribedToThis}
                    onClick={() => onSelectPlan(targetId)}
                    startIcon={isCurrentCheckingOut ? <CircularProgress size={16} color="inherit" /> : undefined}
                    sx={ctaButtonStyles}
                  >
                    {isCurrentCheckingOut
                      ? 'Abrindo...'
                      : isSubscribedToThis
                        ? 'Plano atual'
                        : 'Assinar plano'}
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
