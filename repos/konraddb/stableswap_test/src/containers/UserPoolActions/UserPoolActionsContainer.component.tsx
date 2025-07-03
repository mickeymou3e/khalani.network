import React from 'react'
import { useSelector } from 'react-redux'

import { BigNumber } from 'ethers'

import {
  Asset,
  AssetListSkeleton,
  AssetsList,
  Button,
  getTokenComponent,
} from '@hadouken-project/ui'
import { GENERIC_POOL_SYMBOL, IPool } from '@interfaces/pool'
import { Box, Divider, Paper, Skeleton, Typography } from '@mui/material'
import { userBalancesSelectors } from '@store/balances/selectors/user/balances.selector'
import { poolsModelsSelector } from '@store/pool/selectors/models/pool-model.selector'
import { CompositionType, IPoolModel } from '@store/pool/selectors/models/types'
import { poolSelectors } from '@store/pool/selectors/pool.selector'
import { poolBalancesValuesUSDSelectors } from '@store/pricedBalances/selectors/pool/balancesValuesUSD.selector'
import { userBalancesValuesUSDSelectors } from '@store/pricedBalances/selectors/user/balancesValuesUSD.selector'
import { pricesSelector } from '@store/prices/prices.selector'
import { tokenSelectors } from '@store/tokens/tokens.selector'
import { userSharesSelectors } from '@store/userShares/userShares.selector'
import { BigDecimal } from '@utils/math'

import { messages } from './UserPoolActionsContainer.messages'

export interface IUserPoolActionsContainerProps {
  poolId: IPool['id']
  onDeposit: () => void
  onWithdraw: () => void
}

const UserPoolActionsContainer: React.FC<IUserPoolActionsContainerProps> = ({
  poolId,
  onDeposit,
  onWithdraw,
}) => {
  const selectPoolModel = useSelector(poolsModelsSelector.selectById)
  const selectPoolById = useSelector(poolSelectors.selectById)
  const selectManyPricesByIds = useSelector(pricesSelector.selectManyByIdsNEW)
  const selectManyTokens = useSelector(tokenSelectors.selectMany)

  const isFetching = false

  const selectUserTokensValuesUSD = useSelector(
    userBalancesValuesUSDSelectors.selectUserTokensValuesUSD,
  )
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

  const tokens =
    poolModel &&
    selectManyTokens(poolModel.tokens.map(({ address }) => address))

  const prices = selectManyPricesByIds(tokens?.map(({ id }) => id) ?? [])

  const userDepositTokensValuesUSD =
    poolModel?.depositTokens &&
    selectUserTokensValuesUSD(
      poolModel.depositTokens.map(({ address }) => address),
    )

  // TODO: Refactor Wallet Store to User store move all user data onto User selector layer
  const totalUserDepositValueUSD =
    (userDepositTokensValuesUSD &&
      Object.keys(userDepositTokensValuesUSD)?.reduce(
        (totalValueUSD, tokenAddress) => {
          const tokenValueUSD = userDepositTokensValuesUSD[tokenAddress]
          return tokenValueUSD
            ? totalValueUSD.add(tokenValueUSD)
            : totalValueUSD
        },
        BigDecimal.from(0),
      )) ??
    BigDecimal.from(0)

  const scaleFactor =
    pool && userPoolShare
      ? userPoolShare.div(pool.totalShares)
      : BigDecimal.from(0)

  const assets: Asset[] = tokens
    ? tokens.map(
        (token): Asset => {
          const userPoolBalance =
            userPoolBalances?.[token.address] ?? BigDecimal.from(0)
          let valueUSD = BigDecimal.from(0)

          const block = poolModel.compositionBlocks.find(
            ({ value }) => value.address === token.address,
          )

          if (block?.type === CompositionType.TOKEN) {
            const priceEntity = prices[token.id]
            valueUSD =
              priceEntity?.price.mul(userPoolBalance) ?? BigDecimal.from(0)
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
            decimals: token.decimals,
            symbol: token.symbol,
            icon:
              block?.type === CompositionType.POOL
                ? getTokenComponent(GENERIC_POOL_SYMBOL)
                : undefined,
            symbolDescription: token.name,
            balance: userPoolBalance
              ?.toBigNumber()
              .mul(BigNumber.from(10).pow(token.decimals))
              .div(BigNumber.from(10).pow(userPoolBalance.decimals)),
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
          {!isFetching && (
            <AssetsList
              assets={assets}
              totalBalanceMessage={messages.TITLE}
              totalBalanceOnTop
            />
          )}
          {isFetching && (
            <>
              <AssetListSkeleton columnsCount={1} rowsCount={3} />
            </>
          )}
          <Divider />
          <Box pb={3}>
            <Typography color="textGray" variant="paragraphTiny">
              {messages.INVEST_BALANCE_DESCRIPTION}
            </Typography>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="paragraphSmall">
                {messages.INVEST_BALANCE}
              </Typography>
              {isFetching && <Skeleton width={100} />}
              {!isFetching && (
                <Typography variant="paragraphBig">
                  ${totalUserDepositValueUSD.toFixed(2)}
                </Typography>
              )}
            </Box>
          </Box>

          <Box display="flex">
            <Button
              fullWidth
              size="small"
              text={messages.INVEST_BUTTON}
              variant="contained"
              onClick={onDeposit}
            />
            <Button
              sx={{ ml: 2 }}
              fullWidth
              size="small"
              text={messages.WITHDRAW_BUTTON}
              variant="contained"
              onClick={onWithdraw}
            />
          </Box>
        </Paper>
      </Box>
    </Box>
  )
}

export default UserPoolActionsContainer
