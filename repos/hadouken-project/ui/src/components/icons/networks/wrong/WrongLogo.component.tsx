import React from 'react'

import { IIcon } from '@interfaces/core'
import { SvgIcon, lighten, styled } from '@mui/material'

const WrongLogo: React.FC<IIcon> = ({ fill = '#F4B407', sx, ...rest }) => (
  <SvgIcon
    viewBox="0 0 32 32"
    sx={{ fill, width: '32px', height: '32px', ...sx }}
    {...rest}
  >
    <rect width="32" height="32" rx="16" />
    <path
      d="M15.5 24C10.529 24 6.5 19.971 6.5 15C6.5 10.029 10.529 6 15.5 6C20.471 6 24.5 10.029 24.5 15"
      stroke="#151C52"
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7.01318 12H23.9872"
      stroke="#151C52"
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7.01416 18H16.5002"
      stroke="#151C52"
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M19.5 15.0002C19.5 12.2362 18.777 9.47224 17.333 7.06024C16.486 5.64724 14.514 5.64724 13.668 7.06024C10.778 11.8852 10.778 18.1162 13.668 22.9412C14.091 23.6472 14.796 24.0012 15.501 24.0012"
      stroke="#151C52"
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M24 21H20C19.1716 21 18.5 21.6716 18.5 22.5V24.5C18.5 25.3284 19.1716 26 20 26H24C24.8284 26 25.5 25.3284 25.5 24.5V22.5C25.5 21.6716 24.8284 21 24 21Z"
      stroke="#151C52"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M20 21V19.5C20 18.9696 20.2107 18.4609 20.5858 18.0858C20.9609 17.7107 21.4696 17.5 22 17.5V17.5C22.5304 17.5 23.0391 17.7107 23.4142 18.0858C23.7893 18.4609 24 18.9696 24 19.5V21"
      stroke="#151C52"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </SvgIcon>
)

const StyledWrongLogo = styled(WrongLogo)(({ theme, fill }) => ({
  '&:hover': {
    fill: lighten(fill ?? theme.palette.tertiary.main, 0.3),
  },
})) as React.FC<IIcon>

export default StyledWrongLogo
