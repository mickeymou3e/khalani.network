import React from 'react'

import { IIcon } from '@interfaces/core'
import { lighten, styled } from '@mui/material'

const GodwokenTestnetLogo: React.FC<IIcon> = ({
  fill = '#F4B407',
  ...rest
}) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill={fill}
    xmlns="http://www.w3.org/2000/svg"
    {...rest}
  >
    <rect width="32" height="32" rx="16" />
    <path
      d="M14.4118 7.69238C10.3254 7.69238 7.01165 11.0975 7.00034 15.3022H7V20.1211H9.54126V15.3242C9.54126 12.5544 11.7219 10.309 14.4118 10.309H25V7.69238H14.4118Z"
      fill="#151C52"
    />
    <path
      d="M22.459 11.8789H14.4118C12.6034 11.8789 11.1311 13.3563 11.0689 15.2027L11.0658 15.202V15.3242V20.1301H17.6648C17.8541 20.1301 17.9483 19.8936 17.8135 19.7567L16.2695 18.1889L15.1317 17.0337C15.1317 17.0337 14.4218 16.2536 14.1575 15.9784C14.0433 15.8593 13.7763 15.6294 13.7763 15.3242C13.7763 14.963 14.0608 14.67 14.4116 14.67H17.6966H22.4588V16.6759C22.4588 19.4457 20.2781 21.691 17.5882 21.691H7V24.3077H17.5882C21.6747 24.3077 24.9883 20.9025 24.9997 16.6979H25V14.67V11.8789H22.459Z"
      fill="#151C52"
    />
  </svg>
)

const StyledGodwokenTestnetLogo = styled(GodwokenTestnetLogo)(
  ({ theme, fill }) => ({
    '&:hover': {
      fill: lighten(fill ?? theme.palette.tertiary.main, 0.3),
    },
  }),
) as React.FC<IIcon>

export default StyledGodwokenTestnetLogo
