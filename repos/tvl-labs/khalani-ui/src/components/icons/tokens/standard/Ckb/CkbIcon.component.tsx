import React from 'react'

import { IIcon } from '@interfaces/core'

const CkbIcon: React.FC<IIcon> = ({ fill = '#FFFFFF', ...rest }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...rest}
  >
    <rect width="120" height="120" rx="60" fill={fill} />
    <path
      d="M25.6802 93.96H43.2002V57H56.7602L25.6802 25.92V93.96Z"
      fill="black"
    />
    <path
      d="M94.0802 25.92H76.6802V63H63.1202L94.0802 93.96V25.92Z"
      fill="black"
    />
  </svg>
)

export default CkbIcon
