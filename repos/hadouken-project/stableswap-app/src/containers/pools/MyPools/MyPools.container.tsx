import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Link as RouterLink } from 'react-router-dom'

import { useSwapFeePercentage } from '@components/PoolTable/PoolTable.hooks'
import { generatePoolAssets } from '@components/PoolTable/PoolTable.table'
import {
  AprTooltip,
  convertNumberToStringWithCommas,
  IRow,
  Link,
  LinkEnum,
  Table,
  TableSkeleton,
} from '@hadouken-project/ui'
import { PoolType } from '@interfaces/pool'
import { Box, Paper, Typography } from '@mui/material'
import { metricsSelectors } from '@store/metrics/metrics.selectors'
import { networkSelectors } from '@store/network/network.selector'
import { poolsModelsSelector } from '@store/pool/selectors/models/pool-model.selector'
import { IPoolModel } from '@store/pool/selectors/models/types'
import { pricesSelector } from '@store/prices/prices.selector'
import { userSharesSelectors } from '@store/userShares/userShares.selector'
import { BigDecimal } from '@utils/math'
import { formatNetworkName, getNetworkName } from '@utils/network'
import { getAssetListForUserBalances } from '@utils/userBalances'

import { MESSAGES } from './MyPools.messages'
import { COLUMNS } from './MyPools.table'

export const MyPoolsContainer: React.FC = () => {
  const balances = useSelector(userSharesSelectors.depositTokenBalances)
  const userShares = useSelector(userSharesSelectors.selectAllUserPoolsShares)
  const isFetching = useSelector(userSharesSelectors.isFetching)

  const selectPoolApr = useSelector(metricsSelectors.selectPoolAPR)
  const selectPoolModel = useSelector(poolsModelsSelector.selectByAddress)
  const selectManyPricesByIds = useSelector(pricesSelector.selectManyByIdsNEW)

  const applicationChainId = useSelector(networkSelectors.applicationChainId)
  const feePercentage = useSwapFeePercentage()

  const poolAddressesWithUserShare: string[] = useMemo(() => {
    if (userShares) {
      return Object.entries(userShares.sharesOwned)
        .map((pool) => {
          const [address, value] = pool

          if (value.gt(BigDecimal.from(0, 18))) {
            return address
          }
        })
        .filter((address) => !!address) as string[]
    }

    return []
  }, [userShares])

  const pools = poolAddressesWithUserShare
    .map((poolId) => selectPoolModel(poolId))
    .filter(
      (poolModel) =>
        poolModel && poolModel.pool.poolType !== PoolType.AaveLinear,
    ) as IPoolModel[]

  let totalLiquidityInUSD = BigDecimal.from(0, 27)

  const rows: IRow[] = pools.map((poolModel) => {
    const apr = selectPoolApr(poolModel.pool.id, feePercentage)

    const showAprTooltip = apr.swapApr && apr.lendingApr

    const prices = selectManyPricesByIds(
      poolModel.depositTokens.map(({ id }) => id) ?? [],
    )

    const userPoolTokensBalance = getAssetListForUserBalances(
      poolModel.depositTokens,
      balances,
      prices,
      applicationChainId,
      poolModel.pool,
    )

    const totalPoolLiquidityInUSD = userPoolTokensBalance.reduce(
      (totalAmount, token) =>
        totalAmount.add(BigDecimal.from(token.balanceInDollars, 27)),

      BigDecimal.from(0, 27),
    )

    totalLiquidityInUSD = totalLiquidityInUSD.add(totalPoolLiquidityInUSD)

    return {
      id: poolModel.id,
      cells: {
        asset: {
          value: (
            <Link
              sx={{ textDecoration: 'none' }}
              RouterLink={RouterLink}
              linkType={LinkEnum.Internal}
              url={`/${formatNetworkName(
                getNetworkName(applicationChainId),
              )}/pools/${poolModel.id}`}
            >
              <Box
                display="flex"
                alignItems="center"
                sx={{ cursor: 'pointer' }}
              >
                {generatePoolAssets([poolModel.pool], poolModel)}
                <Typography
                  sx={{ textDecoration: 'none' }}
                  color="textPrimary"
                  ml={2}
                >
                  {poolModel.pool.displayName ?? ''}
                </Typography>
              </Box>
            </Link>
          ),
        },
        amount: {
          value: (
            <Box>
              <Typography variant="paragraphMedium">
                {userPoolTokensBalance.map((token, key) => (
                  <React.Fragment key={key}>
                    {convertNumberToStringWithCommas(
                      BigDecimal.from(token.balance, token.decimals).toNumber(),
                      4,
                      true,
                    )}{' '}
                    {token.symbol}
                    {key !== userPoolTokensBalance.length - 1 ? ' + ' : ''}
                  </React.Fragment>
                ))}
              </Typography>
              <Typography
                variant="paragraphMedium"
                color={(theme) => theme.palette.text.secondary}
              >
                $
                {convertNumberToStringWithCommas(
                  totalPoolLiquidityInUSD.toNumber(),
                )}
              </Typography>
            </Box>
          ),
        },
        apy: {
          value: (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: 0.5,
                pl: showAprTooltip ? 3 : 0,
              }}
            >
              {apr.totalApr.toNumber().toFixed(2)}%
              {showAprTooltip ? (
                <AprTooltip
                  apr={{
                    swapApr: apr.swapApr.toNumber(),
                    lendingApr: apr.lendingApr.toNumber(),
                    totalApr: apr.totalApr.toNumber(),
                  }}
                />
              ) : null}
            </Box>
          ),
        },
      },
    }
  })

  return (
    <Box width="100%" display="flex" justifyContent="center" mt={6}>
      <Box width={{ xs: '100%', md: 'inherit' }} maxWidth={1024}>
        <Typography ml={4} variant="h1">
          {MESSAGES.LABEL}
        </Typography>
        <Box mt={2}>
          <Paper>
            {isFetching ? (
              <TableSkeleton columns={COLUMNS} />
            ) : (
              <>
                <Table columns={COLUMNS} rows={rows} />

                {pools.length > 0 ? (
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    mt={3}
                  >
                    <Typography variant="paragraphSmall">
                      {MESSAGES.TOTAL}
                    </Typography>
                    <Typography variant="paragraphBig">
                      $
                      {convertNumberToStringWithCommas(
                        totalLiquidityInUSD.toNumber(),
                      )}
                    </Typography>
                  </Box>
                ) : (
                  <Typography
                    mt={3}
                    p={3}
                    align="center"
                    variant="h2"
                    color={(theme) => theme.palette.text.secondary}
                  >
                    {MESSAGES.NO_LIQUIDITY}
                  </Typography>
                )}
              </>
            )}
          </Paper>
        </Box>
      </Box>
    </Box>
  )
}
