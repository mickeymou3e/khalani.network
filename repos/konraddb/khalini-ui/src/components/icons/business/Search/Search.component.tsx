import React from 'react'

import { IIcon } from '@interfaces/core'

const SearchIcon: React.FC<IIcon> = ({ fill = '#CAF5FF', ...rest }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill={fill}
    xmlns="http://www.w3.org/2000/svg"
    {...rest}
  >
    <path d="M7 14C3.14 14 0 10.86 0 7C0 3.14 3.14 0 7 0C10.86 0 14 3.14 14 7C14 10.86 10.86 14 7 14ZM7 2C4.243 2 2 4.243 2 7C2 9.757 4.243 12 7 12C9.757 12 12 9.757 12 7C12 4.243 9.757 2 7 2Z" />
    <path d="M15.707 14.293L13.314 11.9C12.903 12.429 12.429 12.903 11.9 13.314L14.293 15.707C14.488 15.902 14.744 16 15 16C15.256 16 15.512 15.902 15.707 15.707C16.098 15.316 16.098 14.684 15.707 14.293Z" />
  </svg>
)

export default SearchIcon
