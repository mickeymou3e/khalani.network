import React from 'react'
import { useSelector } from 'react-redux'

import { BigNumber } from 'ethers'

import { Asset, AssetsList } from '@hadouken-project/ui'
import { IToken } from '@interfaces/token'
import { Box, Paper, Typography } from '@mui/material'
import { userBalancesSelectors } from '@store/balances/selectors/user/balances.selector'
import { poolsModelsSelector } from '@store/pool/selectors/models/pool-model.selector'
import { userBalancesValuesUSDSelectors } from '@store/pricedBalances/selectors/user/balancesValuesUSD.selector'
import { tokenSelectors } from '@store/tokens/tokens.selector'
import { BigDecimal } from '@utils/math'

import { messages } from './UserBalanceContainer.messages'

export interface IUserBalanceContainerProps {
  tokensIds: IToken['id'][]
}

const UserBalanceContainer: React.FC<IUserBalanceContainerProps> = ({
  tokensIds,
}) => {
  const isFetching = useSelector(poolsModelsSelector.isFetching)
  const selectTokens = useSelector(tokenSelectors.selectMany)
  const selectUserTokensBalances = useSelector(
    userBalancesSelectors.selectUserTokensBalances,
  )
  const selectUserTokensValuesUSD = useSelector(
    userBalancesValuesUSDSelectors.selectUserTokensValuesUSD,
  )

  const tokens = selectTokens(tokensIds)

  const userBalances = selectUserTokensBalances(tokensIds)
  const userBalancesValuesUSD = selectUserTokensValuesUSD(tokensIds)

  const assets: Asset[] = tokens
    ? tokens.map(
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
          }
        },
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
