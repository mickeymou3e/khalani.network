import React from 'react'

import { IIcon } from '@interfaces/core'
import { SvgIcon } from '@mui/material'

const ErrorIcon: React.FC<IIcon> = ({ fill = '#FF3D2A', sx, ...rest }) => (
  <SvgIcon
    viewBox="0 0 24 24"
    sx={{ fill: 'none', width: '24px', height: '24px', ...sx }}
    {...rest}
  >
    <path
      d="M13.7228 12.9999V11.7229C13.7228 10.8189 12.9518 9.99991 11.9998 9.99991C11.0478 9.99991 10.2768 10.7709 10.2768 11.7229V12.9999M14.0258 16.9999H9.97382C9.43582 16.9999 8.99982 16.5639 8.99982 16.0259V13.9739C8.99982 13.4359 9.43582 12.9999 9.97382 12.9999H14.0258C14.5638 12.9999 14.9998 13.4359 14.9998 13.9739V16.0259C14.9998 16.5639 14.5638 16.9999 14.0258 16.9999ZM15.1058 5.42591L20.5358 15.0779C21.8728 17.4539 20.1558 20.3919 17.4288 20.3919H6.57082C3.84282 20.3919 2.12682 17.4559 3.46382 15.0779L8.89382 5.42591C10.2538 3.00191 13.7428 3.00191 15.1058 5.42591Z"
      stroke={fill}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </SvgIcon>
)

export default ErrorIcon
