import React from 'react'
import { useSelector } from 'react-redux'

import { BigNumber } from 'ethers'

import { Asset, AssetsList } from '@hadouken-project/ui'
import { Box, Paper, Typography } from '@mui/material'
import { userBalancesSelectors } from '@store/balances/selectors/user/balances.selector'
import { poolsModelsSelector } from '@store/pool/selectors/models/pool-model.selector'
import { pricedBalancesSelectors } from '@store/pricedBalances/selectors/priceBalances.selector'
import { tokenSelectors } from '@store/tokens/tokens.selector'
import { BigDecimal } from '@utils/math'
import { sortAssetsByBusinessOrder } from '@utils/token'

import { messages } from './UserBalanceContainer.messages'
import { IUserBalanceContainerProps } from './UserBalanceContainer.types'

const UserBalanceContainer: React.FC<IUserBalanceContainerProps> = ({
  tokensIds,
}) => {
  const isFetching = useSelector(poolsModelsSelector.isFetching)
  const selectTokens = useSelector(tokenSelectors.selectMany)
  const selectUserTokensBalances = useSelector(
    userBalancesSelectors.selectUserTokensBalances,
  )
  const selectUserTokensValuesUSD = useSelector(
    pricedBalancesSelectors.selectUserTokensValuesUSD,
  )

  const tokens = selectTokens(tokensIds)

  const userBalances = selectUserTokensBalances(tokensIds)
  const userBalancesValuesUSD = selectUserTokensValuesUSD(tokensIds)

  const assets: Asset[] = tokens
    ? tokens
        .map(
          (token): Asset => {
            const userBalance =
              userBalances?.[token.address] ?? BigDecimal.from(0)
            const userValueUSD =
              userBalancesValuesUSD?.[token.address] ?? BigDecimal.from(0)

            return {
              address: token.address,
              decimals: token.decimals,
              symbol: token.symbol,
              symbolDescription: token.name,
              balance: userBalance.toBigNumber(),
              balanceInDollars: userValueUSD
                .toBigNumber()
                .mul(BigNumber.from(10).pow(18))
                .div(BigNumber.from(10).pow(userValueUSD.decimals)),
              displayName: token.displayName ?? '',
              source: token.source ?? '',
            }
          },
        )
        .sort((tokenA, tokenB) =>
          sortAssetsByBusinessOrder(tokenA.symbol, tokenB.symbol),
        )
    : []

  return (
    <Box>
      <Box pt={2} ml={{ xs: 3, lg: 6 }}>
        <Typography variant="h4Bold">{messages.TITLE}</Typography>
      </Box>

      <Box pt={{ xs: 2, lg: 3 }} pl={{ xs: 0, lg: 4 }}>
        <Paper elevation={3}>
          <AssetsList
            assets={assets}
            isFetching={isFetching}
            totalBalanceMessage={messages.TOTAL_BALANCE_LABEL}
          />
        </Paper>
      </Box>
    </Box>
  )
}

export default UserBalanceContainer
