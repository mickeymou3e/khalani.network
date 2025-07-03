import React from 'react'

import { IIcon } from '@interfaces/core'

const InvestIcon: React.FC<IIcon> = ({ fill = '#35FFC2', ...rest }) => (
  <svg
    width="9"
    height="9"
    viewBox="0 0 9 9"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...rest}
  >
    <path
      d="M4.192 8.008V4.664H0.992V3.576H4.192V0.231999H5.408V3.576H8.608V4.664H5.408V8.008H4.192Z"
      fill={fill}
    />
  </svg>
)

export default InvestIcon
