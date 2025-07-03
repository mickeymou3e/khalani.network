import React from 'react'

import { IIcon } from '@interfaces/core'

const WithdrawIcon: React.FC<IIcon> = ({ fill = '#FF3D2A', ...rest }) => (
  <svg
    width="6"
    height="2"
    viewBox="0 0 6 2"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...rest}
  >
    <path d="M0.48 1.808V0.464H5.12V1.808H0.48Z" fill={fill} />
  </svg>
)

export default WithdrawIcon
