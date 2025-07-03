import React from 'react'

import ErrorIcon from '@components/icons/business/Error'
import { alpha, Box, Typography, useTheme } from '@mui/material'

import { IErrorBannerProps } from './ErrorBanner.types'

const ErrorBanner: React.FC<IErrorBannerProps> = ({
  children,
  text,
  noFill,
  backgroundImageUrl,
}) => {
  const theme = useTheme()

  return (
    <Box
      height="100%"
      display="grid"
      alignItems="center"
      gridAutoRows="1fr"
      gridTemplateColumns={`auto ${noFill ? '0' : '1fr'}`}
      bgcolor={(theme) => alpha(theme.palette.common.black, 0.3)}
      border={(theme) => `1px solid ${theme.palette.error.main}`}
      borderRadius="3px"
      p="2px"
    >
      <Box
        height="100%"
        display="flex"
        flexDirection={{ xs: 'column', md: 'row' }}
        flexBasis={noFill ? '100%' : 'auto'}
        flexWrap="nowrap"
        alignItems="center"
        justifyContent="space-between"
        py={1.5}
        px={2}
      >
        <Box
          display="flex"
          flexDirection={{ xs: 'column', md: 'row' }}
          alignItems="center"
        >
          <Box
            marginRight={{ xs: 0, md: 2 }}
            display="flex"
            alignItems="center"
            paddingBottom={{ xs: 0.5, md: 0 }}
          >
            <ErrorIcon fill={theme.palette.error.main} />
          </Box>

          <Typography
            sx={{
              wordBreak: { xs: 'normal', md: 'break-word' },
              color: (theme) => theme.palette.error.main,
              textAlign: 'center',
            }}
            variant="paragraphTiny"
          >
            {text}
          </Typography>
        </Box>
        {children ? (
          <Box
            paddingTop={{ xs: 2.5, md: 0 }}
            paddingLeft={{ xs: 0, md: 2 }}
            display="flex"
            alignItems="center"
          >
            {children}
          </Box>
        ) : null}
      </Box>

      <Box
        height="100%"
        width={{ xs: '0%', md: '100%' }}
        sx={{
          background: `url(${backgroundImageUrl})`,
          '&&': {
            backgroundSize: 'contain',
          },
        }}
      />
    </Box>
  )
}

export default ErrorBanner
