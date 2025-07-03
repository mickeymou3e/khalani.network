import React from 'react'

import { IIcon } from '@interfaces/core'

const SwapHorizontalIcon: React.FC<IIcon> = ({ fill = '#C5CEFA', ...rest }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...rest}
  >
    <path d="M9 19L17 12L9 5V19Z" fill={fill} />
  </svg>
)

export default SwapHorizontalIcon
