import React from 'react'

import { IIcon } from '@interfaces/core'
import { SvgIcon, lighten, styled } from '@mui/material'

const EthereumLogo: React.FC<IIcon> = ({ fill = '#F4B407', sx, ...rest }) => (
  <SvgIcon
    viewBox="0 0 32 32"
    sx={{ fill, width: '32px', height: '32px', ...sx }}
    {...rest}
  >
    <rect width="32" height="32" rx="16" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10 14.9409L16.0245 11.351L21.9998 14.9632L15.9983 5L10 14.9409ZM10.2297 15.9775L16.031 12.4731L21.7567 15.9515L16.0343 19.4596L10.2297 15.9775ZM10 16.9808C12.1143 18.2518 14.3206 19.5822 16.0245 20.6116L21.9998 16.9808C19.8363 20.619 18.0338 23.6477 16.0245 26.9998L14.7931 24.9535L14.7929 24.9532C13.1375 22.2027 11.4303 19.3662 10 16.9808Z"
      fill="#151C52"
    />
    <path
      opacity="0.2"
      fillRule="evenodd"
      clipRule="evenodd"
      d="M16 5L16.0225 11.351L21.9999 14.9632L16 5ZM16.0281 12.4731L21.7917 15.9515L16.0309 19.4596L16.0281 12.4731ZM16.0223 20.6117L21.9997 16.981C20.1457 20.6191 16.0223 26.9999 16.0223 26.9999V20.6117Z"
      fill="black"
    />
  </SvgIcon>
)

const StyledEthereumLogo = styled(EthereumLogo)(({ theme, fill }) => ({
  '&:hover': {
    fill: lighten(fill ?? theme.palette.tertiary.main, 0.3),
  },
})) as React.FC<IIcon>

export default StyledEthereumLogo
