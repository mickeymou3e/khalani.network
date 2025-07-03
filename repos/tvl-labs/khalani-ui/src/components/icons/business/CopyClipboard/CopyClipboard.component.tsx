import React from 'react'

import { IIcon } from '@interfaces/core'

const CopyClipboardIcon: React.FC<IIcon> = ({ fill = '#000000', ...rest }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...rest}
  >
    <g clipPath="url(#clip0_26_50)">
      <path
        d="M10.6666 0.666687H2.66665C1.93331 0.666687 1.33331 1.26669 1.33331 2.00002V11.3334H2.66665V2.00002H10.6666V0.666687ZM12.6666 3.33335H5.33331C4.59998 3.33335 3.99998 3.93335 3.99998 4.66669V14C3.99998 14.7334 4.59998 15.3334 5.33331 15.3334H12.6666C13.4 15.3334 14 14.7334 14 14V4.66669C14 3.93335 13.4 3.33335 12.6666 3.33335ZM12.6666 14H5.33331V4.66669H12.6666V14Z"
        fill={fill}
      />
    </g>
    <defs>
      <clipPath id="clip0_26_50">
        <rect width="16" height="16" fill={fill} />
      </clipPath>
    </defs>
  </svg>
)

export default CopyClipboardIcon
