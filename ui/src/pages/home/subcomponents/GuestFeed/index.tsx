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
      <Typography variant="h3" sx={{ fontSize: { xs: '1.75rem', sm: '2.2rem' }, color: 'text.primary' }}>
        {data.title}
      </Typography>
      <Typography variant="body1" sx={{ lineHeight: 1.6, color: 'text.secondary' }}>
        {data.description}
      </Typography>

      <Box sx={getActivityBoxStyles(isDark)}>
        <Stack spacing={0.5}>
          <Typography variant="subtitle1" fontWeight={800} color="text.primary">
            {data.activityCard.action}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {data.activityCard.timeAgo}
          </Typography>
        </Stack>
        <Box sx={heartIconBoxStyles}>
          <FavoriteIcon sx={{ fontSize: 22 }} />
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
