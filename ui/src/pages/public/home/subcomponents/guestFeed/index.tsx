import { Box, Button, Chip, Stack, Typography } from '@mui/material'
import { Favorite as FavoriteIcon } from '@mui/icons-material'
import { Link as RouterLink } from 'react-router-dom'

import {
  getActivityBoxStyles,
  getGuestFeedChipStyles,
  guestFeedButtonStyles,
  guestFeedContainerStyles,
  heartIconBoxStyles
} from './styles'
import type { GuestFeedProps } from './types'

export const GuestFeed = ({ data, isDark }: GuestFeedProps) => {
  return (
    <Box sx={guestFeedContainerStyles}>
      <Chip label={data.badge} sx={getGuestFeedChipStyles(isDark)} />
      <Typography variant="h3" sx={{ fontSize: { xs: '1.45rem', sm: '1.85rem', md: '2.2rem' }, color: 'text.primary', letterSpacing: '-0.035em' }}>
        {data.title}
      </Typography>
      <Typography variant="body1" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' }, lineHeight: 1.55, color: 'text.secondary' }}>
        {data.description}
      </Typography>

      <Box sx={getActivityBoxStyles(isDark)}>
        <Stack spacing={0.25}>
          <Typography variant="subtitle1" fontWeight={800} color="text.primary" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
            {data.activityCard.action}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {data.activityCard.timeAgo}
          </Typography>
        </Stack>
        <Box sx={heartIconBoxStyles}>
          <FavoriteIcon sx={{ fontSize: { xs: 18, sm: 22 } }} />
        </Box>
      </Box>

      <Button
        component={RouterLink}
        to={data.cta.href}
        variant="contained"
        color="primary"
        size="large"
        fullWidth
        sx={guestFeedButtonStyles}
      >
        {data.cta.text}
      </Button>
    </Box>
  )
}

export default GuestFeed
