import React from 'react'

import SwapContainer from '@containers/pools/SwapContainer'
import { Box } from '@mui/material'

const Home: React.FC = () => {
  return (
    <>
      <Box marginBottom={5}>
        <SwapContainer />
      </Box>
      {/* <Box pb={5}>
        <PoolsContainer />
      </Box> */}
    </>
  )
}

export default Home
