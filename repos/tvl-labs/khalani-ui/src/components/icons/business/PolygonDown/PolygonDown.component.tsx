import React from 'react'

import { IIcon } from '@interfaces/core'

const PolygonDown: React.FC<IIcon> = ({ fill = '#FFFFFF', ...rest }) => (
  <svg
    width="48"
    height="12"
    viewBox="0 0 48 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...rest}
  >
    <path d="M24 12L0 0L48 1.21137e-06L24 12Z" fill={fill} />
  </svg>
)

export default PolygonDown
