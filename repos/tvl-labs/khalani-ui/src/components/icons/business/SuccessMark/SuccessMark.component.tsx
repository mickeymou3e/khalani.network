import React from 'react'

import { IIcon } from '@interfaces/core'

const SuccessMark: React.FC<IIcon> = ({ fill = '#000000', ...rest }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    {...rest}
  >
    <path
      d="M12 2C6.486 2 2 6.486 2 12C2 17.514 6.486 22 12 22C17.514 22 22 17.514 22 12C22 6.486 17.514 2 12 2ZM12 20C7.589 20 4 16.411 4 12C4 7.589 7.589 4 12 4C16.411 4 20 7.589 20 12C20 16.411 16.411 20 12 20Z"
      fill={fill}
    />
    <path
      d="M9.99902 13.587L7.70002 11.292L6.28802 12.708L10.001 16.413L16.707 9.70703L15.293 8.29303L9.99902 13.587Z"
      fill={fill}
    />
  </svg>
)

export default SuccessMark
