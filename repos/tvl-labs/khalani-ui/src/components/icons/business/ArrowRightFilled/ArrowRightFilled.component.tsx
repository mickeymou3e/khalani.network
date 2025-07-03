import React from 'react'

import { IIcon } from '@interfaces/core'

const ArrowRightFilled: React.FC<IIcon> = ({ fill = '#C5CEFA', ...rest }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="30"
    height="22"
    viewBox="0 0 30 22"
    fill="none"
    {...rest}
  >
    <path d="M11.25 17.125L21.25 11L11.25 4.875V17.125Z" fill={fill} />
  </svg>
)

export default ArrowRightFilled
