import React from 'react'

import { IIcon } from '@interfaces/core'

const RedirectIcon: React.FC<IIcon> = ({ fill = '#ffffff', ...rest }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...rest}
  >
    <path
      d="M6.30222 11.1911L7.55556 12.4444L12 8L7.55556 3.55556L6.30222 4.80889L8.59556 7.11111H0V8.88889H8.59556L6.30222 11.1911ZM14.2222 0H1.77778C0.791111 0 0 0.8 0 1.77778V5.33333H1.77778V1.77778H14.2222V14.2222H1.77778V10.6667H0V14.2222C0 15.2 0.791111 16 1.77778 16H14.2222C15.2 16 16 15.2 16 14.2222V1.77778C16 0.8 15.2 0 14.2222 0Z"
      fill={fill}
    />
  </svg>
)

export default RedirectIcon
