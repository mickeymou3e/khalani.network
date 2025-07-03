import React from 'react'
import Confetti from 'react-confetti'
import { useWindowSize } from 'react-use'

import { Portal } from '@mui/material'

const HappyReaction: React.FC = () => {
  const { width, height } = useWindowSize()

  return (
    <Portal>
      <Confetti width={width - 17} height={height} />
    </Portal>
  )
}

export default HappyReaction
