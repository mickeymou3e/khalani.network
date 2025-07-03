import React from 'react'
import { useSelector } from 'react-redux'

import { BigNumber } from 'ethers'

import { Asset, AssetsList, getTokenComponent } from '@hadouken-project/ui'
import { GENERIC_POOL_SYMBOL, IPool } from '@interfaces/pool'
import { Box, Paper, Typography } from '@mui/material'
import { userBalancesSelectors } from '@store/balances/selectors/user/balances.selector'
import { poolsModelsSelector } from '@store/pool/selectors/models/pool-model.selector'
import { CompositionType, IPoolModel } from '@store/pool/selectors/models/types'
import { poolSelectors } from '@store/pool/selectors/pool.selector'
import { poolBalancesValuesUSDSelectors } from '@store/pricedBalances/selectors/pool/balancesValuesUSD.selector'
import { pricesSelector } from '@store/prices/prices.selector'
import { userSharesSelectors } from '@store/userShares/userShares.selector'
import { BigDecimal } from '@utils/math'

import { messages } from './UserPoolBalanceContainer.messages'

export interface IUserPoolBalanceContainerProps {
  poolId: IPool['id']
}

const UserPoolBalanceContainer: React.FC<IUserPoolBalanceContainerProps> = ({
  poolId,
}) => {
  const isFetching = useSelector(poolsModelsSelector.isFetching)
  const selectPoolModel = useSelector(poolsModelsSelector.selectById)
  const selectPoolById = useSelector(poolSelectors.selectById)
  const selectPriceById = useSelector(pricesSelector.selectById)

  const selectPoolValuesUSDByAddress = useSelector(
    poolBalancesValuesUSDSelectors.selectPoolValuesUSDByAddress,
  )

  const selectUserPoolShare = useSelector(
    userSharesSelectors.selectUserPoolShare,
  )
  const selectUserPoolBalances = useSelector(
    userBalancesSelectors.selectUserPoolBalances,
  )

  const pool = selectPoolById(poolId)
  const poolModel = selectPoolModel(poolId)

  const userPoolBalances = poolModel && selectUserPoolBalances(poolId)
  const userPoolShare = selectUserPoolShare(poolId)

  const tokens = poolModel?.tokens

  const scaleFactor =
    pool && userPoolShare
      ? userPoolShare.div(pool.totalShares)
      : BigDecimal.from(0)

  const assets: Asset[] = tokens
    ? tokens.map(
        (token): Asset => {
          const userPoolBalance =
            userPoolBalances?.[token.address] ?? BigDecimal.from(0)

          const block = poolModel.compositionBlocks.find(
            ({ value }) => value.address === token.address,
          )

          let valueUSD = BigDecimal.from(0)

          if (block?.type === CompositionType.TOKEN) {
            const priceEntity = selectPriceById(token.address)

            if (priceEntity) {
              valueUSD = priceEntity?.price.mul(userPoolBalance)
            }
          } else if (block?.type === CompositionType.POOL) {
            const nestedPoolModel = block.value as IPoolModel

            const poolValuesUSD = selectPoolValuesUSDByAddress(
              poolModel.address,
              nestedPoolModel.id,
            )

            valueUSD = poolValuesUSD
              ? Object.keys(poolValuesUSD)
                  .reduce((nestedValueUSD, id) => {
                    const valueUSD = poolValuesUSD[id]

                    return valueUSD
                      ? nestedValueUSD.add(valueUSD)
                      : nestedValueUSD
                  }, BigDecimal.from(0))
                  .mul(scaleFactor)
              : valueUSD
          }

          return {
            address: token.address,
            decimals: userPoolBalance.decimals,
            symbol: token.symbol,
            icon:
              block?.type === CompositionType.POOL
                ? getTokenComponent(GENERIC_POOL_SYMBOL)
                : undefined,
            symbolDescription: token.name,
            balance: userPoolBalance?.toBigNumber(),
            balanceInDollars: valueUSD
              ?.toBigNumber()
              .mul(BigNumber.from(10).pow(18))
              .div(BigNumber.from(10).pow(valueUSD.decimals)),
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

export default UserPoolBalanceContainer
