import React from 'react'

import { IIcon } from '@interfaces/core'
import { SvgIcon, lighten, styled } from '@mui/material'

const TestnetLogo: React.FC<IIcon> = ({ fill = '#F4B407', sx, ...rest }) => (
  <SvgIcon
    viewBox="0 0 13 13"
    sx={{ fill, width: '13px', height: '13px', ...sx }}
    {...rest}
  >
    <circle cx="6.5" cy="6.5" r="6.5" />
    <path
      d="M3.35511 4.99503V3.72727H9.32812V4.99503H7.10156V11H5.58168V4.99503H3.35511Z"
      fill="white"
    />
  </SvgIcon>
)

const StyledTestnetLogo = styled(TestnetLogo)(({ theme, fill }) => ({
  '&:hover': {
    fill: lighten(fill ?? theme.palette.tertiary.main, 0.3),
  },
})) as React.FC<IIcon>

export default StyledTestnetLogo
