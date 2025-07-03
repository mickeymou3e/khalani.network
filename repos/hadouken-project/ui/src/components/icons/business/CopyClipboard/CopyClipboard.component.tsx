import React from 'react'

import { IIcon } from '@interfaces/core'
import { SvgIcon } from '@mui/material'

const CopyClipboardIcon: React.FC<IIcon> = ({
  fill = '#CAF5FF',
  sx,
  ...rest
}) => (
  <SvgIcon
    viewBox="0 0 16 16"
    sx={{ fill: 'none', width: '16px', height: '16px', ...sx }}
    {...rest}
  >
    <path
      d="M10 4H2C1.4 4 1 4.4 1 5V15C1 15.6 1.4 16 2 16H10C10.6 16 11 15.6 11 15V5C11 4.4 10.6 4 10 4Z"
      fill={fill}
    />
    <path d="M14 0H4V2H13V13H15V1C15 0.4 14.6 0 14 0Z" fill={fill} />
  </SvgIcon>
)

export default CopyClipboardIcon
