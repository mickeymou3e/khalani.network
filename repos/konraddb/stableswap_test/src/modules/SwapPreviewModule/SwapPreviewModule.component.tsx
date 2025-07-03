import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import { Page } from '@constants/Page'
import SwapPreviewContainer from '@containers/SwapPreviewContainer/SwapPreviewContainer.component'
import UserBalanceContainer from '@containers/UserBalance'
import { Grid } from '@mui/material'
import { swapSelectors } from '@store/swap/swap.selector'

import { PAGES_PATH } from '../../App'

const SwapPreviewModule: React.FC = () => {
  const history = useHistory()

  const swap = useSelector(swapSelectors.swap)
  const swapReady = useSelector(swapSelectors.swapReady)

  useEffect(() => {
    if (!swapReady) {
      history.push(PAGES_PATH[Page.Home])
    }
  }, [history, swapReady])

  return (
    <>
      {swapReady && (
        <Grid container>
          <Grid item xs={12} lg={7} xl={8}>
            <SwapPreviewContainer />
          </Grid>
          <Grid item xs={12} lg={5} xl={4}>
            <UserBalanceContainer tokensIds={[swap.inToken, swap.outToken]} />
          </Grid>
        </Grid>
      )}
    </>
  )
}

export default SwapPreviewModule
