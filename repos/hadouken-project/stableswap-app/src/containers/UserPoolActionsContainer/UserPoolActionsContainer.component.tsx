import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'

import { BigNumber } from 'ethers'

import {
  Asset,
  AssetsList,
  Button,
  convertNumberToStringWithCommas,
} from '@hadouken-project/ui'
import { Box, Divider, Paper, Skeleton, Typography } from '@mui/material'
import { networkSelectors } from '@store/network/network.selector'
import { poolsModelsSelector } from '@store/pool/selectors/models/pool-model.selector'
import { poolSelectors } from '@store/pool/selectors/pool.selector'
import { pricedBalancesSelectors } from '@store/pricedBalances/selectors/priceBalances.selector'
import { pricesSelector } from '@store/prices/prices.selector'
import { tokenSelectors } from '@store/tokens/tokens.selector'
import { userSharesSelectors } from '@store/userShares/userShares.selector'
import { BigDecimal } from '@utils/math'
import { isPoolVulnerable } from '@utils/pool'
import { getAssetListForUserBalances } from '@utils/userBalances'

import { messages } from './UserPoolActionsContainer.messages'
import { IUserPoolActionsContainerProps } from './UserPoolActionsContainer.types'

const UserPoolActionsContainer: React.FC<IUserPoolActionsContainerProps> = ({
  poolId,
  onDeposit,
  onWithdraw,
}) => {
  const selectPoolModel = useSelector(poolsModelsSelector.selectById)
  const pools = useSelector(poolSelectors.pools)
  const selectPoolById = useSelector(poolSelectors.selectById)
  const selectManyPricesByIds = useSelector(pricesSelector.selectManyByIdsNEW)
  const selectManyTokens = useSelector(tokenSelectors.selectMany)
  const balances = useSelector(userSharesSelectors.depositTokenBalances)
  const isFetching = useSelector(userSharesSelectors.isFetching)
  const applicationChainId = useSelector(networkSelectors.applicationChainId)

  const selectUserTokensValuesUSD = useSelector(
    pricedBalancesSelectors.selectUserTokensValuesUSD,
  )

  const selectUserPoolShare = useSelector(
    userSharesSelectors.selectUserPoolShare,
  )

  const pool = selectPoolById(poolId)
  const poolModel = selectPoolModel(poolId)
  const isVulnerable = isPoolVulnerable(pools, pool)

  const userPoolShare = selectUserPoolShare(poolId)

  const tokens =
    poolModel &&
    selectManyTokens(poolModel.depositTokens.map(({ address }) => address))

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
    <Box>
      <Box pt={{ xs: 2, lg: 3 }} mt={{ xs: 4, lg: 10 }} pl={{ xs: 0, lg: 4 }}>
        <Paper elevation={3}>
          <AssetsList
            assets={assets}
            totalBalanceMessage={messages.TITLE}
            totalBalanceOnTop
            totalBalanceDecimals={27}
            isFetching={isFetching}
          />

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
                  $
                  {convertNumberToStringWithCommas(
                    totalUserDepositValueUSD.toNumber(),
                  )}
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
              disabled={isVulnerable}
            />
            <Button
              sx={{ ml: 2 }}
              fullWidth
              size="small"
              text={messages.WITHDRAW_BUTTON}
              variant="contained"
              onClick={onWithdraw}
              disabled={
                !userPoolShare ||
                userPoolShare.toBigNumber().eq(BigNumber.from(0))
              }
            />
          </Box>
        </Paper>
      </Box>
    </Box>
  )
}

export default UserPoolActionsContainer
