import React from 'react'

import { Box, Typography } from '@mui/material'

import { IInformBannerProps } from './InformBanner.types'

const InformBanner: React.FC<IInformBannerProps> = ({ children, text }) => (
  <Box
    height="100%"
    display="flex"
    alignItems="center"
    justifyContent="center"
    bgcolor={(theme) => theme.palette.tertiary.main}
    py={1.5}
    px={0.5}
    minHeight={56}
  >
    <Typography
      sx={{
        wordBreak: { xs: 'normal', md: 'break-word' },

        textAlign: 'center',
      }}
      color={(theme) => theme.palette.common.black}
      variant="buttonSmall"
    >
      {text}
    </Typography>

    {children}
  </Box>
)

export default InformBanner
