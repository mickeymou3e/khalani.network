import React from 'react'

import { IIcon } from '@interfaces/core'
import { SvgIcon, alpha, lighten } from '@mui/material'

const CloseIcon: React.FC<IIcon> = ({ fill, sx, ...rest }) => (
  <SvgIcon
    viewBox="0 0 16 16"
    sx={{
      fill,
      cursor: 'pointer',
      width: '16px',
      height: '16px',
      '&:hover': {
        path: {
          fill: (theme) => lighten(fill ?? theme.palette.text.gray, 0.3),
        },
      },
      ...sx,
    }}
    {...rest}
  >
    <path
      d="M14.7 1.3C14.3 0.9 13.7 0.9 13.3 1.3L8 6.6L2.7 1.3C2.3 0.9 1.7 0.9 1.3 1.3C0.9 1.7 0.9 2.3 1.3 2.7L6.6 8L1.3 13.3C0.9 13.7 0.9 14.3 1.3 14.7C1.5 14.9 1.7 15 2 15C2.3 15 2.5 14.9 2.7 14.7L8 9.4L13.3 14.7C13.5 14.9 13.8 15 14 15C14.2 15 14.5 14.9 14.7 14.7C15.1 14.3 15.1 13.7 14.7 13.3L9.4 8L14.7 2.7C15.1 2.3 15.1 1.7 14.7 1.3Z"
      fill={fill ?? alpha('#FFFFFF', 0.5)}
    />
  </SvgIcon>
)

export default CloseIcon
