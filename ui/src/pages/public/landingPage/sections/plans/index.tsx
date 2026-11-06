import { useEffect, useState } from 'react'
import { Box, Button, Card, Container, Stack, Typography } from '@mui/material'
import {
  CheckCircle as CheckCircleIcon,
  ArrowForward as ArrowForwardIcon,
  AutoAwesome as AutoAwesomeIcon,
  Bolt as BoltIcon
} from '@mui/icons-material'
import { Link as RouterLink } from 'react-router-dom'

import { getPlans } from '@actions/payments'
import type { PlanApiItem } from '@actions/payments/types'

import {
  checkIconStyles,
  costPerEventBadgeStyles,
  featureItemStyles,
  getPlanCardStyles,
  getSectionBoxStyles,
  periodTextStyles,
  planDescriptionStyles,
  plansGridStyles,
  planTagStyles,
  planTitleStyles,
  popularBadgeStyles,
  priceContainerStyles,
  priceTextStyles,
  sectionHeaderStyles,
  sectionSubtitleStyles,
  sectionTitleStyles,
  tagBadgeStyles,
  upsellCardStyles
} from './styles'
import type { PlansSectionProps } from './types'

export const Plans = ({ data, isDark }: PlansSectionProps) => {
  const [livePlans, setLivePlans] = useState<PlanApiItem[]>([])

  useEffect(() => {
    let isMounted = true

    getPlans()
      .then((plans) => {
        if (isMounted && Array.isArray(plans)) {
          setLivePlans(plans)
        }
      })
      .catch(() => {
        // Usa os dados estáticos definidos em data.ts caso a API esteja indisponível
      })

    return () => {
      isMounted = false
    }
  }, [])

  const resolvePrice = (planId: string, defaultPrice: string): string => {
    if (planId === 'free_trial' || !planId) return defaultPrice

    const live = livePlans.find(
      (p) => p.abacateProductId === planId || p.productId === planId
    )
    if (live?.price) {
      const formatted = (live.price / 100).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        maximumFractionDigits: 0
      })
      return formatted
    }
    return defaultPrice
  }

  return (
    <Box id="planos" component="section" sx={getSectionBoxStyles(isDark)}>
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3 } }}>
        <Stack spacing={1.75} sx={sectionHeaderStyles}>
          <Box sx={tagBadgeStyles}>
            <BoltIcon sx={{ fontSize: 16, color: 'primary.main' }} />
            {data.tag}
          </Box>
          <Typography variant="h2" sx={sectionTitleStyles}>
            {data.title}
          </Typography>
          <Typography variant="body1" sx={sectionSubtitleStyles}>
            {data.subtitle}
          </Typography>
        </Stack>

        <Box sx={plansGridStyles}>
          {data.plans.map((plan) => {
            const isHighlighted = !!plan.highlighted
            const priceDisplay = resolvePrice(plan.abacateProductId, plan.price)

            return (
              <Card
                key={plan.id}
                elevation={0}
                sx={getPlanCardStyles(isHighlighted, isDark)}
              >
                {plan.badge && <Box sx={popularBadgeStyles}>{plan.badge}</Box>}

                <Typography sx={planTagStyles}>{plan.tag}</Typography>
                <Typography variant="h4" sx={planTitleStyles}>
                  {plan.title}
                </Typography>

                <Box sx={priceContainerStyles}>
                  <Typography component="span" sx={priceTextStyles}>
                    {priceDisplay}
                  </Typography>
                  <Typography component="span" sx={periodTextStyles}>
                    {plan.period}
                  </Typography>
                </Box>

                {plan.costPerEvent && (
                  <Box sx={costPerEventBadgeStyles}>{plan.costPerEvent}</Box>
                )}

                <Typography sx={planDescriptionStyles}>
                  {plan.description}
                </Typography>

                <Stack spacing={1.5} sx={{ mb: 4, flex: 1 }}>
                  {plan.features.map((feature, idx) => (
                    <Box key={idx} sx={featureItemStyles}>
                      <CheckCircleIcon sx={checkIconStyles} />
                      <Typography variant="body2" sx={{ color: 'text.primary' }}>
                        {feature}
                      </Typography>
                    </Box>
                  ))}
                </Stack>

                <Button
                  component={RouterLink}
                  to={plan.cta.href}
                  variant={isHighlighted ? 'contained' : 'outlined'}
                  color={isHighlighted ? 'primary' : 'inherit'}
                  fullWidth
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 700
                  }}
                >
                  {plan.cta.text}
                </Button>
              </Card>
            )
          })}
        </Box>

        {data.upsell && (
          <Box sx={upsellCardStyles(isDark)}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '14px',
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <AutoAwesomeIcon />
              </Box>
              <Box>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      color: 'primary.main'
                    }}
                  >
                    {data.upsell.badge}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 800, color: 'text.primary' }}>
                    • {data.upsell.price}
                  </Typography>
                </Stack>
                <Typography variant="h6" sx={{ fontSize: '1.05rem', color: 'text.primary' }}>
                  {data.upsell.title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 700 }}>
                  {data.upsell.description}
                </Typography>
              </Box>
            </Stack>

            <Button
              component={RouterLink}
              to="/signup"
              variant="outlined"
              size="medium"
              sx={{ flexShrink: 0, px: 3, fontWeight: 700 }}
            >
              Adicionar no checkout
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  )
}

export default Plans

