import React from 'react'

import { IIcon } from '@interfaces/core'

const CompletedIcon: React.FC<IIcon> = ({ fill = '#4CA05E', ...rest }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="0.5"
      y="0.5"
      width="23"
      height="23"
      rx="11.5"
      fill={fill}
      fillOpacity="0.35"
      {...rest}
    />
    <path
      d="M17.4609 6.96094L9.75 14.6719L6.53906 11.4609L5.46094 12.5391L9.21094 16.2891L9.75 16.8047L10.2891 16.2891L18.5391 8.03906L17.4609 6.96094Z"
      fill="white"
    />
    <rect x="0.5" y="0.5" width="23" height="23" rx="11.5" stroke="#00FF95" />
  </svg>
)

export default CompletedIcon
