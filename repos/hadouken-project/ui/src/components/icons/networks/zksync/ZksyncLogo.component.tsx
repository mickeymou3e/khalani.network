import React from 'react'

import { IIcon } from '@interfaces/core'
import { SvgIcon, lighten, styled } from '@mui/material'

const ZksyncLogo: React.FC<IIcon> = ({ fill = '#F4B407', sx, ...rest }) => (
  <SvgIcon
    viewBox="0 0 32 32"
    sx={{ fill, width: '32px', height: '32px', ...sx }}
    {...rest}
  >
    <rect width="32" height="32" rx="16" />
    <path
      d="M25 16.0903L19.8945 11V14.727L14.8258 18.4583L19.8945 18.4626V21.1785L25 16.0903Z"
      fill="#151C52"
    />
    <path
      d="M7 16.0881L12.1054 21.1763V17.4796L17.1741 13.718L12.1054 13.7137V11L7 16.0881Z"
      fill="#151C52"
    />
  </SvgIcon>
)

const StyledZksyncLogo = styled(ZksyncLogo)(({ theme, fill }) => ({
  '&:hover': {
    fill: lighten(fill ?? theme.palette.tertiary.main, 0.3),
  },
})) as React.FC<IIcon>

export default StyledZksyncLogo
