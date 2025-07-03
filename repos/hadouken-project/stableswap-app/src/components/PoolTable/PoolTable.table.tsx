import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'

import { orderBy } from 'lodash'

import { isCustomLinearPool } from '@containers/pools/utils'
import {
  AprTooltip,
  convertNumberToStringWithCommas,
  IColumn,
  IRow,
  TokenIconWithChain,
} from '@hadouken-project/ui'
import { IPool, PoolType } from '@interfaces/pool'
import { IToken } from '@interfaces/token'
import { Box, Grid, Tooltip, Typography } from '@mui/material'
import { metricsSelectors } from '@store/metrics/metrics.selectors'
import { networkSelectors } from '@store/network/network.selector'
import { poolsModelsSelector } from '@store/pool/selectors/models/pool-model.selector'
import { IPoolModel } from '@store/pool/selectors/models/types'
import { userSharesSelectors } from '@store/userShares/userShares.selector'
import { isPoolVulnerable } from '@utils/pool'
import { sortAssetsByBusinessOrder } from '@utils/token'

import { BOOSTED_POOLS_SYMBOL_LOWER_CASE } from './PoolTable.constants'
import { useSwapFeePercentage } from './PoolTable.hooks'

export const poolColumns: IColumn[] = [
  {
    value: (
      <Typography
        variant="paragraphSmall"
        color={(theme) => theme.palette.text.secondary}
      >
        Assets
      </Typography>
    ),
    name: 'assets',
    width: '16%',
    align: 'left',
    isSortable: false,
  },
  {
    value: (
      <Typography
        variant="paragraphSmall"
        color={(theme) => theme.palette.text.secondary}
      >
        Composition
      </Typography>
    ),
    name: 'composition',
    width: '16%',
    align: 'left',
    isSortable: false,
  },
  {
    value: (
      <Typography
        variant="paragraphSmall"
        color={(theme) => theme.palette.text.secondary}
      >
        Pool value
      </Typography>
    ),
    name: 'tvl',
    width: '16%',
    align: 'center',
    isSortable: true,
  },
  {
    value: (
      <Typography
        variant="paragraphSmall"
        color={(theme) => theme.palette.text.secondary}
      >
        My pool value
      </Typography>
    ),
    name: 'myTvl',
    width: '16%',
    align: 'center',
    isSortable: true,
  },
  {
    value: (
      <Typography
        variant="paragraphSmall"
        color={(theme) => theme.palette.text.secondary}
      >
        Volume (7d)
      </Typography>
    ),
    name: 'volume',
    width: '16%',
    align: 'center',
    isSortable: false,
  },
  {
    value: (
      <Typography
        variant="paragraphSmall"
        color={(theme) => theme.palette.text.secondary}
      >
        APR
      </Typography>
    ),
    name: 'apy',
    width: '16%',
    align: 'center',
    isSortable: true,
  },
]

export const generatePoolAssets = (
  pools: IPool[],
  poolModel: IPoolModel,
): JSX.Element => {
  const pool = poolModel.pool
  const allTokensGridSize = pool.tokens.length <= 2 ? 12 : 6

  const isBoostedPool =
    pool.poolType === PoolType.ComposableStable &&
    BOOSTED_POOLS_SYMBOL_LOWER_CASE.includes(pool.symbol.toLowerCase())

  return (
    <Box display="flex" alignItems="center">
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="center"
        paddingTop={1}
        width={80}
      >
        <Tooltip title={pool.name}>
          <Box display="flex" marginRight={5}>
            {isBoostedPool ? (
              <Grid
                key={pool.symbol}
                item
                xs={allTokensGridSize}
                sx={{
                  padding: '5px',
                  background: 'none',
                  width: 24,
                }}
              >
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  p="3px"
                  width={46}
                  height={46}
                  borderRadius={99}
                  bgcolor={(theme) => theme.palette.primary.main}
                >
                  <TokenIconWithChain
                    source={pool.source}
                    symbol={pool.symbol}
                    width={40}
                    height={40}
                  />
                </Box>
              </Grid>
            ) : (
              poolModel.tokens
                .sort((tokenOne: IToken, tokenTwo: IToken) =>
                  sortAssetsByBusinessOrder(tokenOne.symbol, tokenTwo.symbol),
                )
                ?.map(({ id, symbol, source }) => {
                  return (
                    <Grid
                      key={id}
                      item
                      xs={allTokensGridSize}
                      sx={{
                        padding: '5px',
                        background: 'none',
                        width: 24,
                      }}
                    >
                      <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        p="3px"
                        width={46}
                        height={46}
                        borderRadius={99}
                        bgcolor={(theme) => theme.palette.primary.main}
                      >
                        <TokenIconWithChain
                          source={source}
                          symbol={symbol}
                          width={40}
                          height={40}
                        />
                      </Box>
                    </Grid>
                  )
                })
            )}
          </Box>
        </Tooltip>
      </Box>
    </Box>
  )
}

const generatePoolCompositionTiles = (
  pools: IPool[],
  poolModel: IPoolModel,
  selectedTokens: IToken[],
) => {
  const pool = poolModel.pool

  const isAaveBoostedPool =
    pool.poolType === PoolType.ComposableStable &&
    BOOSTED_POOLS_SYMBOL_LOWER_CASE.includes(pool.symbol.toLowerCase())

  if (isAaveBoostedPool) {
    const isSelected = poolModel.depositTokens.some((token) =>
      selectedTokens.some(
        (selectedToken) => selectedToken.symbol === token.symbol,
      ),
    )

    return (
      <Box display="flex">
        <Box
          px={1}
          py={0.25}
          mr={0.5}
          bgcolor={(theme) => theme.palette.background.backgroundBorder}
          border={(theme) =>
            isSelected ? `1px solid ${theme.palette.text.secondary}` : 'none'
          }
        >
          <Typography
            variant="caption"
            component="div"
            sx={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {pool.displayName ?? pool.name}
          </Typography>
        </Box>
      </Box>
    )
  }

  return (
    <Box display="flex" alignItems="center" flexWrap="wrap">
      {poolModel?.tokens
        .sort((tokenOne: IToken, tokenTwo: IToken) =>
          sortAssetsByBusinessOrder(tokenOne.symbol, tokenTwo.symbol),
        )
        .map(({ id, address, symbol: tokenSymbol, displayName }) => {
          const isComposablePool =
            poolModel.pool.poolType === PoolType.ComposableStable

          const isWeightedBoosted =
            poolModel.pool.poolType === PoolType.WeightedBoosted

          let displaySymbol = displayName

          let isSelected = false

          if (isComposablePool) {
            const lpTokenPool = pools.find((pool) => pool.address === address)
            displaySymbol =
              lpTokenPool &&
              BOOSTED_POOLS_SYMBOL_LOWER_CASE.includes(
                lpTokenPool.symbol.toLowerCase(),
              )
                ? lpTokenPool.displayName
                : tokenSymbol

            if (
              lpTokenPool &&
              BOOSTED_POOLS_SYMBOL_LOWER_CASE.includes(
                lpTokenPool.symbol.toLowerCase(),
              )
            ) {
              isSelected = selectedTokens.some((selectedToken) =>
                poolModel?.depositTokens.some((depositToken) =>
                  depositToken.symbol.includes(selectedToken.symbol),
                ),
              )
            } else {
              isSelected = selectedTokens.some((selectedToken) =>
                lpTokenPool?.tokens.some((depositToken) =>
                  depositToken.symbol.includes(selectedToken.symbol),
                ),
              )
            }
          } else if (isWeightedBoosted) {
            const lpTokenPool = pools.find((pool) => pool.address === address)

            if (lpTokenPool) {
              isSelected = selectedTokens.some((selectedToken) =>
                lpTokenPool?.tokens.some((depositToken) =>
                  depositToken.symbol.includes(selectedToken.symbol),
                ),
              )
            } else {
              isSelected = selectedTokens.some((selectedToken) =>
                tokenSymbol.includes(selectedToken.symbol),
              )
            }
          } else {
            isSelected = selectedTokens.some((selectedToken) =>
              selectedToken.symbol.includes(tokenSymbol),
            )
          }

          return (
            <Box
              key={id}
              display="flex"
              flexDirection="row"
              alignItems="center"
              mr={0.5}
              mt={0.5}
              component="span"
              bgcolor={(theme) => theme.palette.background.backgroundBorder}
              border={(theme) =>
                isSelected
                  ? `1px solid ${theme.palette.text.secondary}`
                  : 'none'
              }
              px={1}
              py={0.25}
              gap={1}
            >
              <Typography
                variant="caption"
                sx={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {displaySymbol}
              </Typography>
            </Box>
          )
        })}
    </Box>
  )
}

export const useCreatePoolRows = (
  pools: IPool[],
  searchText: string,
  selectedTokens: IToken[],
  sortingColumn: string | null,
  sortDesc: boolean | undefined,
): IRow[] => {
  const filterSelectedTokens = selectedTokens.map((token) => token.symbol)
  const protocolSwapFeePercentage = useSwapFeePercentage()

  const applicationChainId = useSelector(networkSelectors.applicationChainId)

  const selectPoolTotalValueUSD = useSelector(
    metricsSelectors.selectPoolTotalValueUSD,
  )

  const selectPoolVolume7dUSD = useSelector(
    metricsSelectors.selectPoolVolume7dUSD,
  )

  const selectUserPoolSharesUSD = useSelector(
    userSharesSelectors.selectUserPoolSharesUSD,
  )

  const selectPoolAPR = useSelector(metricsSelectors.selectPoolAPR)

  const selectPoolModel = useSelector(poolsModelsSelector.selectById)

  const poolRows: IRow[] = useMemo(() => {
    const mappedPools: IRow[] = pools
      .filter(({ poolType, address: poolAddress }) => {
        if (poolType === PoolType.AaveLinear || poolType === PoolType.Linear)
          return false // remove after deploy new boosted pools

        return !isCustomLinearPool(applicationChainId, poolAddress)
      })
      .filter(({ id, name }) => {
        const poolModel = selectPoolModel(id)

        if (filterSelectedTokens.length > 0 && searchText.trim().length > 0) {
          const isSelectedToken = poolModel
            ? poolModel?.depositTokens.some((token) =>
                filterSelectedTokens.includes(token.symbol),
              )
            : true

          const isSearchTokenInDepositTokens =
            poolModel &&
            poolModel.depositTokens.some((token) =>
              token.symbol.toLowerCase().includes(searchText.toLowerCase()),
            )

          const isPoolName = name
            .toLowerCase()
            .includes(searchText.toLowerCase())

          return isSelectedToken && (isSearchTokenInDepositTokens || isPoolName)
        }

        if (searchText.trim().length) {
          const isSearchTokenInDepositTokens =
            poolModel &&
            poolModel.depositTokens.some((token) =>
              token.displayName
                .toLowerCase()
                .includes(searchText.toLowerCase()),
            )

          const isPoolName = name
            .toLowerCase()
            .includes(searchText.toLowerCase())

          return isSearchTokenInDepositTokens || isPoolName
        }

        if (filterSelectedTokens.length) {
          const isSelectedToken = poolModel
            ? filterSelectedTokens.every((tokenName) =>
                poolModel?.depositTokens.find((token) =>
                  token.symbol.includes(tokenName),
                ),
              )
            : true

          const isCorrectName = name
            .toLowerCase()
            .includes(searchText.toLowerCase())

          return isSelectedToken && isCorrectName
        }

        return true
      })
      .filter((pool) => {
        const poolModel = selectPoolModel(pool.id)

        if (isPoolVulnerable(pools, pool)) {
          return false
        }

        if (filterSelectedTokens.length > 0) {
          return poolModel
            ? poolModel?.depositTokens.some((token) =>
                filterSelectedTokens.includes(token.symbol),
              )
            : true
        }

        return true
      })
      .map((pool) => {
        const poolTotalValueUSD = selectPoolTotalValueUSD(pool.id)
        const volume7dUSD = selectPoolVolume7dUSD(pool.id)
        const apr = selectPoolAPR(pool.id, protocolSwapFeePercentage)
        const showAprTooltip =
          apr.swapApr !== undefined && apr.lendingApr !== undefined
        const poolModel = selectPoolModel(pool.id)
        const userPoolTotalValueUSD = selectUserPoolSharesUSD(pool.id)

        return {
          id: pool.id,
          cells: {
            assets: {
              value: poolModel ? generatePoolAssets(pools, poolModel) : <Box />,
              sortingValue: pool.name,
            },
            composition: {
              value: poolModel ? (
                generatePoolCompositionTiles(pools, poolModel, selectedTokens)
              ) : (
                <Box />
              ),
            },
            tvl: {
              sortingValue: poolTotalValueUSD.toNumber(),
              value: `$${convertNumberToStringWithCommas(
                poolTotalValueUSD.toNumber(),
              )}`,
            },
            myTvl: {
              sortingValue: userPoolTotalValueUSD.toNumber(),
              value: `$${convertNumberToStringWithCommas(
                userPoolTotalValueUSD.toNumber(),
              )}`,
            },
            volume: {
              value: `$${convertNumberToStringWithCommas(
                volume7dUSD.toNumber(),
              )}`,
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
              sortingValue: apr.totalApr.toNumber(),
            },
          },
        }
      })

    return sortingColumn && sortDesc !== undefined
      ? orderBy(
          mappedPools,
          (item) => item.cells[sortingColumn]?.sortingValue,
          sortDesc ? 'desc' : 'asc',
        )
      : mappedPools
  }, [
    pools,
    filterSelectedTokens,
    selectUserPoolSharesUSD,
    selectPoolTotalValueUSD,
    selectPoolVolume7dUSD,
    selectPoolAPR,
    protocolSwapFeePercentage,
    selectedTokens,
    selectPoolModel,
    sortingColumn,
    sortDesc,
    searchText,
    applicationChainId,
  ])

  return poolRows
}
