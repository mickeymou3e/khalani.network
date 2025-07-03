import React from 'react'

import { Box, Typography } from '@mui/material'

import { IInformBannerProps } from './InformBanner.types'

const InformBanner: React.FC<IInformBannerProps> = ({ children, text }) => (
  <Box
    height="100%"
    display="flex"
    alignItems="center"
    justifyContent="center"
    bgcolor={(theme) => theme.palette.info.main}
    py={2.25}
  >
    <Typography
      sx={{
        wordBreak: { xs: 'normal', md: 'break-word' },
        textAlign: 'center',
      }}
      variant="button"
    >
      {text}
    </Typography>

    {children}
  </Box>
)

export default InformBanner
