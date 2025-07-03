import React from 'react'

import { IIcon } from '@interfaces/core'

const BusdIcon: React.FC<IIcon> = ({ fill = '#EDF0F4', ...rest }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...rest}
  >
    <circle cx="60" cy="60" r="60" fill={fill} />
    <path
      d="M59.8214 20L69.6876 30.1039L44.8437 54.9478L34.9775 45.0816L59.8214 20Z"
      fill="#F0B90B"
      stroke="#F0B90B"
    />
    <path
      d="M74.799 34.9777L84.6652 45.0816L44.8437 84.903L34.9775 75.0368L74.799 34.9777Z"
      fill="#F0B90B"
      stroke="#F0B90B"
    />
    <path
      d="M29.8662 49.9552L39.7324 60.0591L29.8662 69.9254L20 60.0591L29.8662 49.9552Z"
      fill="#F0B90B"
      stroke="#F0B90B"
    />
    <path
      d="M89.7765 49.9552L99.6427 60.0591L59.8213 99.8806L49.9551 90.0144L89.7765 49.9552Z"
      fill="#F0B90B"
      stroke="#F0B90B"
    />
  </svg>
)

export default BusdIcon
