import React from 'react'

import CancelIcon from '@mui/icons-material/Cancel'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CloseIcon from '@mui/icons-material/Close'
import InfoIcon from '@mui/icons-material/Info'
import WarningIcon from '@mui/icons-material/Warning'
import { alpha, Box, Typography, useTheme } from '@mui/material'

import { IToastProps, ToastVariant } from './Toast.types'

const GenerateText = (variant: ToastVariant) => {
  switch (variant) {
    case ToastVariant.Success:
      return (
        <Typography
          variant="paragraphSmall"
          color={(theme) => theme.palette.success.main}
        >
          Success
        </Typography>
      )
    case ToastVariant.Warning:
      return (
        <Typography
          variant="paragraphSmall"
          color={(theme) => theme.palette.warning.main}
        >
          Warning
        </Typography>
      )
    case ToastVariant.Error:
      return (
        <Typography
          variant="paragraphSmall"
          color={(theme) => theme.palette.error.main}
        >
          Error
        </Typography>
      )

    case ToastVariant.Info:
      return (
        <Typography
          variant="paragraphSmall"
          color={(theme) => theme.palette.info.main}
        >
          Info
        </Typography>
      )
  }
}

const GenerateColor = (variant: ToastVariant) => {
  const theme = useTheme()
  switch (variant) {
    case ToastVariant.Success:
      return `linear-gradient(0deg, ${alpha(
        theme.palette.success.main,
        0.2,
      )}, ${alpha(theme.palette.success.main, 0.2)}), ${
        theme.palette.common.black
      }`
    case ToastVariant.Warning:
      return `linear-gradient(0deg, ${alpha(
        theme.palette.warning.main,
        0.2,
      )}, ${alpha(theme.palette.warning.main, 0.2)}), ${
        theme.palette.common.black
      }`
    case ToastVariant.Error:
      return `linear-gradient(0deg, ${alpha(
        theme.palette.error.main,
        0.2,
      )}, ${alpha(theme.palette.error.main, 0.2)}), ${
        theme.palette.common.black
      }`

    case ToastVariant.Info:
      return `linear-gradient(0deg, ${alpha(
        theme.palette.info.main,
        0.2,
      )}, ${alpha(theme.palette.info.main, 0.2)}), ${
        theme.palette.common.black
      }`
  }
}

const IconWrapper: React.FC = ({ children }) => (
  <Box display="flex" justifyContent="center" alignItems="flex-start">
    {children}
  </Box>
)

const Toast: React.FC<IToastProps> = ({ message, variant, onClick }) => (
  <>
    <Box
      sx={{
        border: (theme) => `2px solid ${theme.palette.common.black}`,
        boxShadow: (theme) => `4px 4px 0px ${theme.palette.common.black}`,
        background: GenerateColor(variant),
      }}
      p={1}
    >
      <Box width="100%" position="relative">
        <CloseIcon
          onClick={onClick}
          style={{
            width: 16,
            height: 16,
            position: 'absolute',
            cursor: 'pointer',
            right: 0,
          }}
        />
      </Box>
      <Box display="flex">
        <Box height="100%">
          <IconWrapper>
            {variant === ToastVariant.Success && (
              <CheckCircleIcon
                sx={{
                  color: (theme) => theme.palette.success.main,
                  height: '16px',
                  width: '16px',
                }}
              />
            )}
            {variant === ToastVariant.Error && (
              <CancelIcon
                sx={{
                  color: (theme) => theme.palette.error.main,
                  height: '16px',
                  width: '16px',
                }}
              />
            )}
            {variant === ToastVariant.Warning && (
              <WarningIcon
                sx={{
                  color: (theme) => theme.palette.warning.main,
                  height: '16px',
                  width: '16px',
                }}
              />
            )}
            {variant === ToastVariant.Info && (
              <InfoIcon
                sx={{
                  color: (theme) => theme.palette.info.main,
                  height: '16px',
                  width: '16px',
                }}
              />
            )}
          </IconWrapper>
        </Box>

        <Box ml={1}>
          <Box alignItems="center">{GenerateText(variant)}</Box>

          <Typography
            variant="paragraphTiny"
            color={(theme) => theme.palette.text.gray}
          >
            {message}
          </Typography>
        </Box>
      </Box>
    </Box>
  </>
)

export default Toast
