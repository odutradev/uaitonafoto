import { Box, Button, Card, Container, Stack, Typography } from '@mui/material'
import {
  CheckCircle as CheckCircleIcon,
  ArrowForward as ArrowForwardIcon,
  Bolt as BoltIcon
} from '@mui/icons-material'
import { Link as RouterLink } from 'react-router-dom'

import PlansSkeleton from './skeleton'
import {
  checkIconStyles,
  costPerEventBadgeStyles,
  featureItemStyles,
  getPlanCardStyles,
  getPlanCtaButtonStyles,
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
  subBadgeContainerStyles,
  subBadgeNeutralStyles,
  tagBadgeStyles
} from './styles'
import type { PlansSectionProps } from './types'

export const Plans = ({
  data,
  plans,
  isDark,
  isLoading = false,
  isAuthenticated = false,
  onSelectPlan
}: PlansSectionProps) => {
  if (isLoading) {
    return <PlansSkeleton data={data} isDark={isDark} />
  }

  if (!plans || plans.length === 0) {
    return null
  }

  return (
    <Box id="planos" component="section" sx={getSectionBoxStyles(isDark)}>
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
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
          {plans.map((plan) => (
            <Card
              key={plan.id}
              elevation={0}
              sx={getPlanCardStyles(plan.highlighted, isDark)}
            >
              {plan.badge && <Box sx={popularBadgeStyles}>{plan.badge}</Box>}

              <Typography sx={planTagStyles}>{plan.tag}</Typography>
              <Typography variant="h4" sx={planTitleStyles}>
                {plan.title}
              </Typography>

              <Box sx={priceContainerStyles}>
                <Typography component="span" sx={priceTextStyles}>
                  {plan.price}
                </Typography>
                <Typography component="span" sx={periodTextStyles}>
                  {plan.period}
                </Typography>
              </Box>

              <Box sx={subBadgeContainerStyles}>
                {plan.costPerEvent ? (
                  <Box sx={costPerEventBadgeStyles}>{plan.costPerEvent}</Box>
                ) : plan.subBadge ? (
                  <Box sx={subBadgeNeutralStyles}>{plan.subBadge}</Box>
                ) : null}
              </Box>

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
                to={
                  isAuthenticated
                    ? `/app/billing?checkout=${encodeURIComponent(plan.ctaHref)}`
                    : `/signin?planId=${encodeURIComponent(plan.ctaHref)}`
                }
                onClick={() => onSelectPlan?.(plan)}
                variant={plan.highlighted ? 'contained' : 'outlined'}
                disableElevation
                fullWidth
                endIcon={<ArrowForwardIcon />}
                sx={getPlanCtaButtonStyles(plan.highlighted, isDark)}
              >
                {plan.ctaText}
              </Button>
            </Card>
          ))}
        </Box>
      </Container>
    </Box>
  )
}

export default Plans
