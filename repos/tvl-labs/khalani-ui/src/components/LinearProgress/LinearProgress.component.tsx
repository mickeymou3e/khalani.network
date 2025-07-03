import React from 'react'

import { Box } from '@mui/material'
import { bigIntToNumber } from '@utils/text'

import { CustomizedLinearProgress } from './LinearProgress.styled'
import { LinearProgressProps } from './LinearProgress.types'

const LinearProgress: React.FC<LinearProgressProps> = (props) => {
  const { value, decimals } = props

  return (
    <Box position="relative">
      <CustomizedLinearProgress
        variant="determinate"
        value={bigIntToNumber(value, decimals)}
      />
    </Box>
  )
}

export default LinearProgress
