import { Box, Button, Card, Container, IconButton, Stack, Tooltip, Typography } from '@mui/material'
import {
  CheckCircle as CheckCircleIcon,
  ArrowForward as ArrowForwardIcon,
  AutoAwesome as AutoAwesomeIcon,
  Bolt as BoltIcon,
  InfoOutlined as InfoOutlinedIcon
} from '@mui/icons-material'
import { Link as RouterLink } from 'react-router-dom'

import PlansSkeleton from './skeleton'
import { resolvePlanFeature } from './featuresMap'
import {
  checkIconStyles,
  costPerEventBadgeStyles,
  featureInfoButtonStyles,
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
                {plan.features.map((feature, idx) => {
                  const isInheritanceHeader =
                    feature.toLowerCase().startsWith('tudo que tem no avulso') ||
                    feature.toLowerCase().startsWith('tudo que tem no essencial') ||
                    feature.toLowerCase().startsWith('tudo do avulso') ||
                    feature.toLowerCase().startsWith('tudo do essencial')

                  if (isInheritanceHeader) {
                    return (
                      <Box
                        key={idx}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          py: 0.85,
                          px: 1.25,
                          borderRadius: '10px',
                          bgcolor: isDark ? 'rgba(255, 214, 10, 0.12)' : 'rgba(255, 214, 10, 0.22)',
                          border: '1px solid',
                          borderColor: isDark ? 'rgba(255, 214, 10, 0.3)' : 'rgba(200, 160, 0, 0.35)',
                          mt: 0.5,
                          mb: 0.5
                        }}
                      >
                        <AutoAwesomeIcon sx={{ fontSize: 16, color: isDark ? '#ffd60a' : '#805d00' }} />
                        <Typography
                          variant="caption"
                          fontWeight={800}
                          sx={{
                            color: isDark ? '#ffd60a' : '#805d00',
                            textTransform: 'uppercase',
                            letterSpacing: '0.04em'
                          }}
                        >
                          {feature}
                        </Typography>
                      </Box>
                    )
                  }

                  const info = resolvePlanFeature(feature)

                  return (
                    <Box key={idx} sx={featureItemStyles}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
                        <CheckCircleIcon sx={checkIconStyles} />
                        <Typography
                          variant="body2"
                          sx={{
                            color: 'text.primary',
                            fontSize: '0.84rem',
                            fontWeight: 500,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                        >
                          {info.label}
                        </Typography>
                      </Box>

                      <Tooltip
                        title={info.tooltip}
                        arrow
                        placement="top"
                        enterTouchDelay={50}
                        leaveTouchDelay={3500}
                        componentsProps={{
                          tooltip: {
                            sx: {
                              bgcolor: isDark ? '#1a1813' : '#1f1d19',
                              color: '#f8fafc',
                              fontSize: '0.78rem',
                              lineHeight: 1.45,
                              p: 1.25,
                              borderRadius: '8px',
                              border: '1px solid',
                              borderColor: isDark ? 'rgba(255, 214, 10, 0.3)' : 'rgba(255, 255, 255, 0.15)',
                              boxShadow: '0 8px 24px rgba(0,0,0,0.45)',
                              maxWidth: 260
                            }
                          },
                          arrow: {
                            sx: {
                              color: isDark ? '#1a1813' : '#1f1d19'
                            }
                          }
                        }}
                      >
                        <IconButton
                          size="small"
                          aria-label={`Mais informações sobre ${info.label}`}
                          sx={featureInfoButtonStyles}
                        >
                          <InfoOutlinedIcon sx={{ fontSize: 15 }} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  )
                })}
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
