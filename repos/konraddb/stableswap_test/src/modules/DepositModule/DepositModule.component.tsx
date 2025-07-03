import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import { Page } from '@constants/Page'
import UserBalanceContainer from '@containers/UserBalance'
import UserPoolBalanceContainer from '@containers/UserPoolBalance'
import DepositContainer from '@containers/pools/DepositContainer'
import { useGetPoolIdFromSlug } from '@containers/pools/utils'
import { Grid } from '@mui/material'
import { poolsActions } from '@store/pool/pool.slice'
import { poolsModelsSelector } from '@store/pool/selectors/models/pool-model.selector'
import { poolSelectors } from '@store/pool/selectors/pool.selector'
import { StoreDispatch } from '@store/store.types'

import { PAGES_PATH } from '../../App'

const DepositModule: React.FC = () => {
  const dispatch = useDispatch<StoreDispatch>()
  const history = useHistory()
  const poolSelectorById = useSelector(poolSelectors.selectById)
  const selectPoolModelById = useSelector(poolsModelsSelector.selectById)
  const poolsReady = useSelector(poolSelectors.poolsReady)

  const [loading, setLoading] = useState<boolean>(true)

  const poolId = useGetPoolIdFromSlug()

  const poolModel = selectPoolModelById(poolId)
  const pool = poolSelectorById(poolId)

  useEffect(() => {
    if (pool) {
      dispatch(poolsActions.updateRequest())
    }
  }, [dispatch, poolId])

  useEffect(() => {
    if (poolsReady) {
      setLoading(false)
    }
  }, [poolsReady, pool])

  useEffect(() => {
    if (!loading && !poolModel) {
      history.push(PAGES_PATH[Page.Pools])
    }
  }, [history, loading, poolModel])

  return (
    <Grid container>
      <Grid item xs={12} lg={7} xl={8}>
        <DepositContainer poolId={poolId} />
      </Grid>
      <Grid item xs={12} lg={5} xl={4}>
        <UserPoolBalanceContainer poolId={poolId} />
        <UserBalanceContainer
          tokensIds={
            poolModel?.depositTokens.map(({ address }) => address) ?? []
          }
        />
      </Grid>
    </Grid>
  )
}

export default DepositModule
