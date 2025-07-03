import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'

import UserBalanceContainer from '@containers/UserBalanceContainer'
import SwapPreviewContainer from '@containers/preview/SwapPreviewContainer'
import { Grid } from '@mui/material'
import { swapSelectors } from '@store/swap/swap.selector'
import { checkIsSupportedNetworkInUrl, formatNetworkName } from '@utils/network'

import { PAGES_PATH, Page } from '../../App'

const SwapPreviewModule: React.FC = () => {
  const history = useHistory()

  const swap = useSelector(swapSelectors.swap)
  const swapReady = useSelector(swapSelectors.swapReady)
  const { pathname } = useLocation()

  const networkInUrl = checkIsSupportedNetworkInUrl(pathname)

  useEffect(() => {
    if (!swapReady) {
      if (networkInUrl) {
        history.push(
          `/${formatNetworkName(networkInUrl.name)}` + PAGES_PATH[Page.Home],
        )
      } else {
        history.push('/')
      }
    }
  }, [history, swapReady, networkInUrl])

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
