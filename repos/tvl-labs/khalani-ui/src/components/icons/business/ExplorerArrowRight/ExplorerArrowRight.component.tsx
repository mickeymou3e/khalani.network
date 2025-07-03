import React from 'react'

import { IIcon } from '@interfaces/core'

const ExplorerArrowRightIcon: React.FC<IIcon> = ({
  fill = '#FFFFFF',
  ...rest
}) => (
  <svg
    width="9"
    height="8"
    viewBox="0 0 9 8"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8.35355 4.09562C8.54882 3.90036 8.54882 3.58377 8.35355 3.38851L5.17157 0.206532C4.97631 0.0112693 4.65973 0.0112693 4.46447 0.206532C4.2692 0.401794 4.2692 0.718376 4.46447 0.913638L7.29289 3.74207L4.46447 6.57049C4.2692 6.76575 4.2692 7.08234 4.46447 7.2776C4.65973 7.47286 4.97631 7.47286 5.17157 7.2776L8.35355 4.09562ZM0 4.24207H8V3.24207H0V4.24207Z"
      fill={fill}
      {...rest}
    />
  </svg>
)

export default ExplorerArrowRightIcon
