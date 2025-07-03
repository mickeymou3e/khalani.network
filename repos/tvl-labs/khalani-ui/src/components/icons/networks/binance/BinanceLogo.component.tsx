import React from 'react'

import { IIcon } from '@interfaces/core'

const BinanceLogo: React.FC<IIcon> = ({
  fill = '#FFFFFF',
  bgFill = '#F4B407',
  ...rest
}) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 32 32"
    fill={bgFill}
    xmlns="http://www.w3.org/2000/svg"
    {...rest}
  >
    <rect width="32" height="32" rx="16" />
    <g clipPath="url(#clip0_1392_10486)">
      <path
        d="M11.6325 14.2446L15.9049 9.97233L20.1796 14.2468L22.6656 11.7608L15.9049 5L9.14648 11.7586L11.6325 14.2446Z"
        fill={fill}
      />
      <path
        d="M9.87706 15.9996L7.39111 13.5137L4.90504 15.9997L7.39099 18.4857L9.87706 15.9996Z"
        fill={fill}
      />
      <path
        d="M11.6327 17.7555L15.9051 22.0278L20.1796 17.7534L22.667 20.238L22.6658 20.2394L15.9051 27.0001L9.14654 20.2417L9.14307 20.2382L11.6327 17.7555Z"
        fill={fill}
      />
      <path
        d="M24.4192 18.487L26.9053 16.001L24.4193 13.515L21.9333 16.0011L24.4192 18.487Z"
        fill={fill}
      />
      <path
        d="M18.4268 15.9987H18.4279L15.9052 13.4761L14.0409 15.3404H14.0408L13.8267 15.5546L13.3848 15.9965L13.3813 15.9999L13.3848 16.0036L15.9052 18.524L18.4279 16.0013L18.4291 15.9999L18.4268 15.9987Z"
        fill={fill}
      />
    </g>
    <defs>
      <clipPath id="clip0_1392_10486">
        <rect width="22" height="22" fill="white" transform="translate(5 5)" />
      </clipPath>
    </defs>
  </svg>
)

export default BinanceLogo
