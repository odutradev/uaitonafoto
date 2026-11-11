import { Box, Card, Container, Stack, Typography } from '@mui/material'
import BoltIcon from '@mui/icons-material/Bolt'

import Skeleton from '@components/skeleton'

import { getPlanCardStyles, getSectionBoxStyles, plansGridStyles, sectionHeaderStyles, sectionSubtitleStyles, sectionTitleStyles, tagBadgeStyles } from './styles'
export interface PlansSkeletonProps {
  data: {
    tag: string
    title: string
    subtitle: string
  }
  isDark: boolean
}

export const PlansSkeleton = ({ data, isDark }: PlansSkeletonProps) => {
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
          {[0, 1, 2, 3].map((index) => {
            const isPopular = index === 2
            return (
              <Card
                key={index}
                elevation={0}
                sx={getPlanCardStyles(isPopular, isDark)}
              >
                <Skeleton width={80} height={18} sx={{ mb: 1.5 }} />
                <Skeleton width={140} height={32} sx={{ mb: 1.5 }} />

                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 1.5 }}>
                  <Skeleton width={100} height={40} />
                  <Skeleton width={60} height={20} />
                </Box>

                <Box sx={{ minHeight: 28, mb: 2 }}>
                  <Skeleton width={150} height={24} borderRadius="8px" />
                </Box>

                <Box sx={{ mb: 2.5, minHeight: { xs: 'auto', md: '56px' } }}>
                  <Skeleton width="100%" height={16} sx={{ mb: 0.75 }} />
                  <Skeleton width="75%" height={16} />
                </Box>

                <Stack spacing={1.5} sx={{ mb: 4, flex: 1 }}>
                  {[1, 2, 3, 4, 5].map((item) => (
                    <Box key={item} sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                      <Skeleton variant="circular" width={18} height={18} sx={{ flexShrink: 0 }} />
                      <Skeleton width={`${85 - item * 6}%`} height={16} />
                    </Box>
                  ))}
                </Stack>

                <Skeleton
                  variant="rounded"
                  width="100%"
                  height={52}
                  borderRadius="12px"
                />
              </Card>
            )
          })}
        </Box>
      </Container>
    </Box>
  )
}

export default PlansSkeleton
