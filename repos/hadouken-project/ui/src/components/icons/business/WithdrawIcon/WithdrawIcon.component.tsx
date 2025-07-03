import React from 'react'

import { IIcon } from '@interfaces/core'
import { SvgIcon } from '@mui/material'

const WithdrawIcon: React.FC<IIcon> = ({ fill = '#FF3D2A', sx, ...rest }) => (
  <SvgIcon
    viewBox="0 0 6 2"
    sx={{ fill: 'none', width: '6px', height: '2px', ...sx }}
    {...rest}
  >
    <path d="M0.48 1.808V0.464H5.12V1.808H0.48Z" fill={fill} />
  </SvgIcon>
)

export default WithdrawIcon
