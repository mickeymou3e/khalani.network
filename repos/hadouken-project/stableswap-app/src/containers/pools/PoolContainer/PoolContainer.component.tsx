import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'

import UserPoolActionsContainer from '@containers/UserPoolActionsContainer'
import PoolCompositionContainer from '@containers/pools/PoolComposition'
import PoolParametersContainer from '@containers/pools/PoolParameters/PoolParameters.container'
import { Box, Grid } from '@mui/material'
import { networkSelectors } from '@store/network/network.selector'
import { poolsActions } from '@store/pool/pool.slice'
import { poolSelectors } from '@store/pool/selectors/pool.selector'
import { StoreDispatch } from '@store/store.types'
import { useDeepCompareEffect } from '@utils/hooks'
import { checkIsSupportedNetworkInUrl, formatNetworkName } from '@utils/network'

import { Page, PAGES_PATH } from '../../../App'
import PoolDetailsContainer from '../PoolDetailsContainer'
import PoolLiquidityContainer from '../PoolLiquidity'
import { PoolSwapsContainer } from '../PoolSwaps'
import { setPoolIdToSlug, useGetPoolIdFromSlug } from '../utils'

const PoolContainer: React.FC = () => {
  const dispatch = useDispatch<StoreDispatch>()
  const history = useHistory()
  const poolSelectorById = useSelector(poolSelectors.selectById)
  const poolsInitialized = useSelector(poolSelectors.poolsReady)
  const applicationNetworkName = useSelector(
    networkSelectors.applicationNetworkName,
  )

  const { pathname } = useLocation()

  const networkInUrl = checkIsSupportedNetworkInUrl(pathname)

  const [loading, setLoading] = useState<boolean>(true)

  const poolId = useGetPoolIdFromSlug()

  const redirectWhenPoolIsNotFound = useCallback(() => {
    if (networkInUrl) {
      history.push(`/${networkInUrl.name}`)
    } else {
      history.push('/')
    }
  }, [history, networkInUrl])

  useEffect(() => {
    if (!loading && !poolId) {
      redirectWhenPoolIsNotFound()
    }
  }, [history, loading, poolId, redirectWhenPoolIsNotFound])

  const pool = poolSelectorById(poolId)

  const poolCompare = useCallback(() => {
    if (pool) {
      dispatch(poolsActions.updateRequest())
    }
  }, [pool, dispatch])

  useDeepCompareEffect(poolCompare, [dispatch, pool])

  useEffect(() => {
    if (poolsInitialized) {
      setLoading(false)
    }
  }, [poolsInitialized, pool])

  useEffect(() => {
    if (!loading && !pool) {
      redirectWhenPoolIsNotFound()
    }
  }, [history, loading, pool, redirectWhenPoolIsNotFound])

  const poolDepositSlug = setPoolIdToSlug(
    `/${formatNetworkName(applicationNetworkName ?? '')}` +
      PAGES_PATH[Page.Invest],
    poolId,
  )
  const onDeposit = () => {
    history.push(poolDepositSlug)
  }
  const poolWithdrawSlug = setPoolIdToSlug(
    `/${formatNetworkName(applicationNetworkName ?? '')}` +
      PAGES_PATH[Page.Withdraw],
    poolId,
  )
  const onWithdraw = () => {
    history.push(poolWithdrawSlug)
  }

  return (
    <Grid container>
      <Grid item xs={12} lg={7} xl={8}>
        <PoolParametersContainer poolId={poolId} />
        <Box pt={6}>
          <PoolCompositionContainer poolId={poolId} />
        </Box>

        <Box pt={6}>
          <PoolDetailsContainer poolId={poolId} />
        </Box>

        <Box pt={6}>
          <PoolLiquidityContainer poolId={poolId} />
        </Box>

        <Box pt={6}>
          <PoolSwapsContainer poolId={poolId} />
        </Box>
      </Grid>

      <Grid item xs={12} lg={5} xl={4}>
        <UserPoolActionsContainer
          poolId={poolId}
          onDeposit={onDeposit}
          onWithdraw={onWithdraw}
        />
      </Grid>
    </Grid>
  )
}

export default PoolContainer
