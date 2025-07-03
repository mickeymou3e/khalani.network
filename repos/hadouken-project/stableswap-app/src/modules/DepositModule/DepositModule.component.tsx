import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'

import UserBalanceContainer from '@containers/UserBalanceContainer'
import UserPoolBalanceContainer from '@containers/UserPoolBalanceContainer'
import DepositContainer from '@containers/pools/DepositContainer'
import { useGetPoolIdFromSlug } from '@containers/pools/utils'
import { Grid } from '@mui/material'
import { poolsActions } from '@store/pool/pool.slice'
import { poolsModelsSelector } from '@store/pool/selectors/models/pool-model.selector'
import { poolSelectors } from '@store/pool/selectors/pool.selector'
import { StoreDispatch } from '@store/store.types'
import { tokenSelectors } from '@store/tokens/tokens.selector'
import { checkIsSupportedNetworkInUrl } from '@utils/network'

import { Page, PAGES_PATH } from '../../App'

const DepositModule: React.FC = () => {
  const dispatch = useDispatch<StoreDispatch>()
  const history = useHistory()
  const poolSelectorById = useSelector(poolSelectors.selectById)
  const selectPoolModelById = useSelector(poolsModelsSelector.selectById)
  const poolsReady = useSelector(poolSelectors.poolsReady)
  const tokensReady = useSelector(tokenSelectors.isReady)
  const [loading, setLoading] = useState<boolean>(true)

  const { pathname } = useLocation()
  const networkInUrl = checkIsSupportedNetworkInUrl(pathname)

  const poolId = useGetPoolIdFromSlug()

  const poolModel = selectPoolModelById(poolId)
  const pool = poolSelectorById(poolId)

  useEffect(() => {
    if (pool) {
      dispatch(poolsActions.updateRequest())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, poolId])

  useEffect(() => {
    if (poolsReady && tokensReady) {
      setLoading(false)
    }
  }, [poolsReady, tokensReady, pool])

  useEffect(() => {
    if (!loading && !poolModel) {
      if (networkInUrl) {
        history.push(`/${networkInUrl.name}` + PAGES_PATH[Page.Pools])
      } else {
        history.push(PAGES_PATH[Page.Pools])
      }
    }
  }, [history, loading, poolModel, networkInUrl])

  return (
    <Grid container>
      <Grid item xs={12} lg={7} xl={8}>
        <DepositContainer poolId={poolId} />
      </Grid>
      <Grid item xs={12} lg={5} xl={4}>
        <UserPoolBalanceContainer poolId={poolId} />
        <UserBalanceContainer
          tokensIds={
            poolModel?.depositTokens.map(
              ({ address, isLendingToken, unwrappedAddress }) => {
                if (isLendingToken) {
                  return unwrappedAddress ?? ''
                }
                return address
              },
            ) ?? []
          }
        />
      </Grid>
    </Grid>
  )
}

export default DepositModule
