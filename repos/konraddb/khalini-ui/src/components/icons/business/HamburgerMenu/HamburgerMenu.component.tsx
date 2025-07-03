import React from 'react'

import { IIcon } from '@interfaces/core'

const HamburgerMenuIcon: React.FC<IIcon> = ({ fill = '#D25C96', ...rest }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...rest}
  >
    <rect
      width="15"
      height="2"
      rx="1"
      transform="matrix(-1 0 0 1 22 18)"
      fill={fill}
    />
    <rect
      width="20"
      height="2"
      rx="1"
      transform="matrix(-1 0 0 1 22 11)"
      fill={fill}
    />
    <rect
      width="15"
      height="2"
      rx="1"
      transform="matrix(-1 0 0 1 22 4)"
      fill={fill}
    />
  </svg>
)

export default HamburgerMenuIcon
