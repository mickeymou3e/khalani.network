import React from 'react'

import { IIcon } from '@interfaces/core'
import QuestionMarkIcon from '@mui/icons-material/QuestionMark'

const WrongLogo: React.FC<IIcon> = ({ bgFill = '#1E2032', ...rest }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 32 32"
    fill={bgFill}
    xmlns="http://www.w3.org/2000/svg"
    {...rest}
  >
    <rect width="32" height="32" rx="16" />
    <QuestionMarkIcon color="secondary" />
  </svg>
)

export default WrongLogo
