import React from 'react'

import { IIcon } from '@interfaces/core'
import { SvgIcon } from '@mui/material'

const HamburgerMenuIcon: React.FC<IIcon> = ({
  fill = '#D25C96',
  sx,
  ...rest
}) => (
  <SvgIcon
    viewBox="0 0 24 24"
    sx={{ fill: 'none', width: '24px', height: '24px', ...sx }}
    {...rest}
  >
    <rect
      width="15"
      height="2"
      rx="1"
      transform="matrix(-1 0 0 1 22 18)"
      fill={fill}
    />
    <rect
      width="20"
      height="2"
      rx="1"
      transform="matrix(-1 0 0 1 22 11)"
      fill={fill}
    />
    <rect
      width="15"
      height="2"
      rx="1"
      transform="matrix(-1 0 0 1 22 4)"
      fill={fill}
    />
  </SvgIcon>
)

export default HamburgerMenuIcon
