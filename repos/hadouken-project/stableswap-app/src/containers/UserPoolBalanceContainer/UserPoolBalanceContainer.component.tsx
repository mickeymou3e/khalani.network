import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'

import { Asset, AssetsList } from '@hadouken-project/ui'
import { Box, Paper } from '@mui/material'
import { networkSelectors } from '@store/network/network.selector'
import { poolsModelsSelector } from '@store/pool/selectors/models/pool-model.selector'
import { poolSelectors } from '@store/pool/selectors/pool.selector'
import { pricesSelector } from '@store/prices/prices.selector'
import { userSharesSelectors } from '@store/userShares/userShares.selector'
import { getAssetListForUserBalances } from '@utils/userBalances'

import { messages } from './UserPoolBalanceContainer.messages'
import { IUserPoolBalanceContainerProps } from './UserPoolBalanceContainer.types'

const UserPoolBalanceContainer: React.FC<IUserPoolBalanceContainerProps> = ({
  poolId,
}) => {
  const isFetching = useSelector(userSharesSelectors.isFetching)
  const selectPoolModel = useSelector(poolsModelsSelector.selectById)
  const selectPoolById = useSelector(poolSelectors.selectById)
  const selectManyPricesByIds = useSelector(pricesSelector.selectManyByIdsNEW)
  const applicationChainId = useSelector(networkSelectors.applicationChainId)

  const balances = useSelector(userSharesSelectors.depositTokenBalances)

  const pool = selectPoolById(poolId)
  const poolModel = selectPoolModel(poolId)

  const tokens = poolModel?.depositTokens
  const prices = selectManyPricesByIds(tokens?.map(({ id }) => id) ?? [])

  const assets: Asset[] = useMemo(
    () =>
      getAssetListForUserBalances(
        tokens,
        balances,
        prices,
        applicationChainId,
        pool,
      ),
    [tokens, balances, prices, applicationChainId, pool],
  )

  return (
    <Box mb={4}>
      <Box pt={{ xs: 2, lg: 3 }} mt={{ lg: 5 }} pl={{ xs: 0, lg: 4 }}>
        <Paper elevation={3}>
          <AssetsList
            assets={assets}
            isFetching={isFetching}
            totalBalanceMessage={messages.TITLE}
            totalBalanceDecimals={27}
            totalBalanceOnTop
          />
        </Paper>
      </Box>
    </Box>
  )
}

export default UserPoolBalanceContainer
