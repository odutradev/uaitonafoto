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

interface FormattedPlanCard {
  id: string
  badge?: string
  tag: string
  title: string
  price: string
  period: string
  subBadge?: string
  costPerEvent?: string
  description: string
  features: string[]
  ctaText: string
  ctaHref: string
  highlighted: boolean
}

const formatPlanCard = (plan: PlanApiItem): FormattedPlanCard => {
  const isFree = plan.type === 'FREE' || plan.price === 0
  const isSubscription = plan.type === 'SUBSCRIPTION'
  const isPro = plan.abacateProductId === 'prod_agency_pro'
  const isEssential = plan.abacateProductId === 'prod_agency_essential'
  const isPass = plan.abacateProductId === 'prod_b2c_event_pass'
  const isFreeTrial = plan.abacateProductId === 'free_trial' || isFree

  const priceDisplay = isFree
    ? 'Grátis'
    : (plan.price / 100).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        maximumFractionDigits: 0
      })

  const periodDisplay = isFree
    ? 'sem cartão'
    : isSubscription
      ? '/mês'
      : 'pagamento único'

  const tagDisplay = isFreeTrial
    ? 'Degustação'
    : isPass
      ? 'Evento Único'
      : isEssential
        ? 'Cerimonialistas'
        : isPro
          ? 'Alta Demanda'
          : isSubscription
            ? 'Assinatura'
            : 'Avulso'

  const costPerEvent = isEssential
    ? 'R$ 61,75 por evento (58% de economia)'
    : isPro
      ? 'R$ 44,70 por evento (70% de economia)'
      : undefined

  const subBadge = isFreeTrial
    ? 'Até 25 fotos para testar'
    : isPass
      ? 'Fotos e convidados ilimitados'
      : undefined

  const features = isFreeTrial
    ? [
        'Até 25 fotos compartilhadas no mural',
        'Modo Telão ao vivo com marca d\'água',
        'Código QR pronto para os convidados',
        'Mural no celular com curtidas em tempo real',
        'Galeria ativa por 7 dias'
      ]
    : isPass
      ? [
          '1 evento completo com fotos ilimitadas',
          'Convidados ilimitados sem precisar baixar aplicativo',
          'Modo Telão ao vivo sem marcas d\'água',
          'Moderação de fotos com senha de segurança',
          'Baixe todas as fotos em alta resolução (.zip)',
          'Galeria ativa por 90 dias'
        ]
      : isEssential
        ? [
            '4 eventos inclusos por mês',
            'Sua própria marca no telão e no aplicativo',
            'Link para seu WhatsApp ou Instagram no telão',
            'Créditos acumulativos por 60 dias (contra baixa temporada)',
            'Acesso de moderação com senha para sua equipe',
            'Crédito extra avulso por R$ 69,00'
          ]
        : isPro
          ? [
              '10 eventos inclusos por mês',
              'Sua marca em destaque para atrair novos clientes',
              'Botão direto para seu WhatsApp no mural de fotos',
              'Créditos acumulativos por 60 dias (até 20 eventos)',
              'Painel de moderação para recepcionistas na festa',
              'Crédito extra avulso por apenas R$ 49,00',
              'Suporte prioritário via WhatsApp'
            ]
          : [`${plan.credits} eventos inclusos`, plan.description]

  const ctaText = isFreeTrial
    ? 'Começar grátis'
    : isPass
      ? 'Criar meu evento'
      : isEssential
        ? 'Assinar Essencial'
        : isPro
          ? 'Assinar Agência Pro'
          : 'Escolher plano'

  return {
    id: plan.abacateProductId || plan.productId || plan.name,
    badge: isPro ? 'Mais Escolhido' : undefined,
    tag: tagDisplay,
    title: plan.name,
    price: priceDisplay,
    period: periodDisplay,
    subBadge,
    costPerEvent,
    description: plan.description,
    features,
    ctaText,
    ctaHref: '/signup',
    highlighted: isPro
  }
}

export const Plans = ({ data, isDark }: PlansSectionProps) => {
  const [plans, setPlans] = useState<PlanApiItem[] | null>(null)

  useEffect(() => {
    let isMounted = true

    getPlans()
      .then((items) => {
        if (isMounted && Array.isArray(items)) {
          setPlans(items)
        }
      })
      .catch(() => {
        if (isMounted) {
          setPlans([])
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  if (plans === null) {
    return <PlansSkeleton data={data} isDark={isDark} />
  }

  if (plans.length === 0) {
    return null
  }

  const upsell = plans.find(
    (p) => p.type === 'UPSELL' || p.abacateProductId === 'prod_b2c_upsell_year'
  )
  const displayPlans = plans.filter(
    (p) => p.type !== 'UPSELL' && p.abacateProductId !== 'prod_agency_extra_credit'
  )

  if (displayPlans.length === 0) {
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
          {displayPlans.map((planItem) => {
            const plan = formatPlanCard(planItem)

            return (
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
            )
          })}
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
                    Complemento Exclusivo
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 800, color: 'text.primary' }}>
                    • + {(upsell.price / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </Typography>
                </Stack>
                <Typography variant="h6" sx={{ fontSize: '1.05rem', color: 'text.primary' }}>
                  {upsell.name}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 700 }}>
                  {upsell.description}
                </Typography>
              </Box>
            </Stack>

            <Button
              component={RouterLink}
              to="/signup"
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
              Adicionar ao pedido
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  )
}

export default Plans
