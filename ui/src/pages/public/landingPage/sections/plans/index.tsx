import { Box, Button, Card, Container, Stack, Typography } from '@mui/material'
import {
  CheckCircle as CheckCircleIcon,
  ArrowForward as ArrowForwardIcon,
  AutoAwesome as AutoAwesomeIcon,
  Bolt as BoltIcon
} from '@mui/icons-material'
import { Link as RouterLink } from 'react-router-dom'

import PlansSkeleton from './skeleton'
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
  subBadgeContainerStyles,
  subBadgeNeutralStyles,
  tagBadgeStyles,
  upsellCardStyles
} from './styles'
import type { PlansSectionProps } from './types'

export const Plans = ({
  data,
  plans,
  upsell,
  isDark,
  isLoading = false
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
                to={plan.ctaHref}
                variant={plan.highlighted ? 'contained' : 'outlined'}
                color={plan.highlighted ? 'primary' : 'inherit'}
                fullWidth
                size="large"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 700
                }}
              >
                {plan.ctaText}
              </Button>
            </Card>
          ))}
        </Box>

        {upsell && (
          <Box sx={upsellCardStyles(isDark)}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              alignItems={{ xs: 'flex-start', sm: 'center' }}
              sx={{ minWidth: 0, flex: 1 }}
            >
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
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" sx={{ mb: 0.5 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      color: 'primary.main'
                    }}
                  >
                    {upsell.badge}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 800, color: 'text.primary' }}>
                    • {upsell.price}
                  </Typography>
                </Stack>
                <Typography variant="h6" sx={{ fontSize: '1.05rem', color: 'text.primary' }}>
                  {upsell.title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 700 }}>
                  {upsell.description}
                </Typography>
              </Box>
            </Stack>

            <Button
              component={RouterLink}
              to={upsell.ctaHref}
              variant="outlined"
              size="medium"
              sx={{
                flexShrink: 0,
                px: 3.5,
                py: 1.25,
                fontWeight: 700,
                whiteSpace: 'nowrap',
                alignSelf: { xs: 'stretch', md: 'center' }
              }}
            >
              {upsell.ctaText}
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  )
}

export default Plans
