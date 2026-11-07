import { Box, Button, Card, Chip, CircularProgress, Skeleton, Stack, Typography } from '@mui/material'
import { CheckCircle as CheckCircleIcon } from '@mui/icons-material'

import {
  buyButtonStyles,
  checkIconStyles,
  creditsChipStyles,
  creditsWrapperStyles,
  featureItemStyles,
  featuresStyles,
  getPlanCardStyles,
  planBadgeStyles,
  planDescriptionStyles,
  planTitleStyles,
  plansGridStyles,
  priceContainerStyles,
  priceTextStyles,
  sectionHeaderStyles,
  sectionTitleStyles
} from './styles'
import type { PlansProps } from './types'

const FREE_PLAN_ID = 'free_trial'
const SKELETON_CARDS = [0, 1, 2]

const Plans = ({
  plans,
  isLoading,
  checkoutPlanId,
  activeSubscriptionPlanIds = [],
  freeTrialClaimed = false,
  freeCredits,
  paidCredits,
  onSelectPlan
}: PlansProps) => {
  const isCheckoutRunning = checkoutPlanId !== null

  return (
    <Box id="planos" component="section">
      <Box sx={sectionHeaderStyles}>
        <Typography variant="h5" component="h2" sx={sectionTitleStyles}>
          Planos e créditos
        </Typography>

        <Box sx={creditsWrapperStyles}>
          <Chip color="primary" label={`${paidCredits} ${paidCredits === 1 ? 'crédito' : 'créditos'}`} sx={creditsChipStyles} />
          <Chip variant="outlined" label={`${freeCredits} ${freeCredits === 1 ? 'crédito grátis' : 'créditos grátis'}`} sx={creditsChipStyles} />
        </Box>
      </Box>

      <Box sx={plansGridStyles}>
        {isLoading &&
          SKELETON_CARDS.map((item) => (
            <Skeleton key={item} variant="rounded" height={360} sx={{ borderRadius: '16px' }} />
          ))}

        {!isLoading &&
          plans.map((plan) => {
            const isFreeTrial = plan.id === FREE_PLAN_ID
            const isCheckingOut = checkoutPlanId === plan.ctaHref
            const isAlreadySubscribed = activeSubscriptionPlanIds.includes(plan.id)
            const isFreeTrialAlreadyClaimed = isFreeTrial && freeTrialClaimed

            return (
              <Card key={plan.id} elevation={0} sx={getPlanCardStyles(plan.highlighted)}>
                {plan.badge && <Chip size="small" color="primary" label={plan.badge} sx={planBadgeStyles} />}

                <Typography variant="h6" component="h3" sx={planTitleStyles}>
                  {plan.title}
                </Typography>

                <Box sx={priceContainerStyles}>
                  <Typography component="span" sx={priceTextStyles}>
                    {plan.price}
                  </Typography>
                  <Typography component="span" variant="body2" color="text.secondary">
                    {plan.period}
                  </Typography>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={planDescriptionStyles}>
                  {plan.description}
                </Typography>

                <Stack spacing={1} sx={featuresStyles}>
                  {plan.features.map((feature) => (
                    <Box key={feature} sx={featureItemStyles}>
                      <CheckCircleIcon sx={checkIconStyles} />
                      <Typography variant="body2">{feature}</Typography>
                    </Box>
                  ))}
                </Stack>

                <Button
                  variant={plan.highlighted ? 'contained' : 'outlined'}
                  size="large"
                  disabled={isCheckoutRunning || isAlreadySubscribed || isFreeTrialAlreadyClaimed}
                  onClick={() => onSelectPlan(plan.ctaHref)}
                  startIcon={isCheckingOut ? <CircularProgress size={18} color="inherit" /> : undefined}
                  sx={buyButtonStyles}
                >
                  {isCheckingOut
                    ? isFreeTrial
                      ? 'Ativando teste grátis...'
                      : 'Abrindo pagamento...'
                    : isAlreadySubscribed
                      ? 'Assinatura ativa'
                      : isFreeTrialAlreadyClaimed
                        ? 'Teste grátis já resgatado'
                        : plan.ctaText}
                </Button>
              </Card>
            )
          })}
      </Box>
    </Box>
  )
}

export default Plans
