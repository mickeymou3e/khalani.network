import React from 'react'

import WarningIcon from '@components/icons/business/Warning'
import { Box, Typography } from '@mui/material'

import { IWarningBannerProps } from './WarningBanner.types'

const WarningBanner: React.FC<IWarningBannerProps> = ({
  title,
  description,
  icon,
}) => (
  <Box
    height="100%"
    bgcolor={(theme) => theme.palette.tertiary.main}
    py={1.5}
    px={2}
    minHeight={56}
  >
    <Box display="flex" alignItems="center">
      {icon ? icon : <WarningIcon />}
      <Typography
        sx={{ ml: 1 }}
        color={(theme) => theme.palette.primary.main}
        variant="paragraphSmall"
      >
        {title}
      </Typography>
    </Box>
    <Box>
      <Typography
        color={(theme) => theme.palette.primary.main}
        variant="caption"
      >
        {description}
      </Typography>
    </Box>
  </Box>
)

export default WarningBanner
