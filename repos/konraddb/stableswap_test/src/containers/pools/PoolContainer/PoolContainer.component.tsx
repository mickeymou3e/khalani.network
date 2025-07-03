import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import { Page } from '@constants/Page'
import UserPoolActionsContainer from '@containers/UserPoolActions'
import PoolCompositionContainer from '@containers/pools/PoolComposition'
import PoolParametersContainer from '@containers/pools/PoolParameters/PoolParameters.container'
import { Grid } from '@mui/material'
import { poolsActions } from '@store/pool/pool.slice'
import { poolSelectors } from '@store/pool/selectors/pool.selector'
import { StoreDispatch } from '@store/store.types'
import { useDeepCompareEffect } from '@utils/hooks'

import { PAGES_PATH } from '../../../App'
import { setPoolIdToSlug, useGetPoolIdFromSlug } from '../utils'

const PoolContainer: React.FC = () => {
  const dispatch = useDispatch<StoreDispatch>()
  const history = useHistory()
  const poolSelectorById = useSelector(poolSelectors.selectById)
  const poolsInitialized = useSelector(poolSelectors.poolsReady)

  const [loading, setLoading] = useState<boolean>(true)

  const poolId = useGetPoolIdFromSlug()
  useEffect(() => {
    if (!loading && !poolId) {
      history.push('/')
    }
  }, [history, loading, poolId])

  const pool = poolSelectorById(poolId)

  useDeepCompareEffect(() => {
    if (pool) {
      dispatch(poolsActions.updateRequest())
    }
  }, [dispatch, pool])

  useEffect(() => {
    if (poolsInitialized) {
      setLoading(false)
    }
  }, [poolsInitialized, pool])

  useEffect(() => {
    if (!loading && !pool) {
      history.push('/')
    }
  }, [history, loading, pool])

  const poolDepositSlug = setPoolIdToSlug(PAGES_PATH[Page.Deposit], poolId)
  const onDeposit = () => {
    history.push(poolDepositSlug)
  }
  const poolWithdrawSlug = setPoolIdToSlug(PAGES_PATH[Page.Withdraw], poolId)
  const onWithdraw = () => {
    history.push(poolWithdrawSlug)
  }

  return (
    <Grid container>
      <Grid item xs={12} lg={7} xl={8}>
        <PoolParametersContainer poolId={poolId} />
        <PoolCompositionContainer poolId={poolId} />
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
