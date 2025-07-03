import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'

import { cloneDeep } from 'lodash'

import { tokenIconCompositionRenderer } from '@containers/pools/PoolComposition/PoolComposition.utils'
import {
  convertNumberToStringWithCommas,
  IColumn,
  IRow,
  Table,
  TableSkeleton,
} from '@hadouken-project/ui'
import { IPool, IPoolToken, PoolType } from '@interfaces/pool'
import { Balances, IToken } from '@interfaces/token'
import { Box, Paper, Typography } from '@mui/material'
import { metricsSelectors } from '@store/metrics/metrics.selectors'
import { networkSelectors } from '@store/network/network.selector'
import { poolsModelsSelector } from '@store/pool/selectors/models/pool-model.selector'
import {
  CompositionBlock,
  CompositionType,
  IPoolModel,
} from '@store/pool/selectors/models/types'
import { pricedBalancesSelectors } from '@store/pricedBalances/selectors/priceBalances.selector'
import { BigDecimal } from '@utils/math'
import { sortAssetsByBusinessOrder } from '@utils/token'

import { isDeepLinearPool } from '../utils'
import { messages } from './PoolComposition.messages'

export interface IPoolCompositionContainerProps {
  poolId: IPool['id']
}

const ASSETS_FIELD_NAME = 'asset'
const ASSETS_COLUMN = {
  value: (
    <Typography variant="paragraphSmall" color="textSecondary">
      {messages.ASSETS_COLUMN_NAME}
    </Typography>
  ),
  name: ASSETS_FIELD_NAME,
  width: '40%',
  align: 'left',
  isSortable: false,
} as IColumn

const BALANCE_FIELD_NAME = 'balance'
const BALANCE_COLUMN = {
  value: (
    <Typography variant="paragraphSmall" color="textSecondary">
      {messages.BALANCE_COLUMN_NAME}
    </Typography>
  ),
  name: BALANCE_FIELD_NAME,
  width: '30%',
  align: 'left',
  isSortable: false,
} as IColumn

const VALUE_FIELD_NAME = 'value'
const VALUE_COLUMN = {
  value: (
    <Typography variant="paragraphSmall" color="textSecondary">
      {messages.VALUE_COLUMN_NAME}
    </Typography>
  ),
  name: VALUE_FIELD_NAME,
  width: '30%',
  align: 'left',
  isSortable: false,
} as IColumn

const isBtcToken = (symbol: string) => symbol.includes('WBTC')

const PoolCompositionContainer: React.FC<IPoolCompositionContainerProps> = ({
  poolId,
}) => {
  const isFetching = false
  const selectPoolModels = useSelector(poolsModelsSelector.selectById)

  const selectPoolBalances = useSelector(metricsSelectors.selectPoolBalances)
  const selectPoolBalancesUSD = useSelector(
    metricsSelectors.selectPoolBalancesUSD,
  )

  const selectScaleFactorForPool = useSelector(
    pricedBalancesSelectors.selectScaleFactor,
  )

  const poolModel = selectPoolModels(poolId)

  const sortCompositionBlock = (
    compositionBlockA: CompositionBlock,
    compositionBlockB: CompositionBlock,
  ) => {
    if (
      compositionBlockA.type === CompositionType.TOKEN &&
      compositionBlockB.type === CompositionType.TOKEN
    ) {
      const tokenA = compositionBlockA.value as IToken
      const tokenB = compositionBlockB.value as IToken

      return sortAssetsByBusinessOrder(
        tokenA.symbol.toLowerCase(),
        tokenB.symbol.toLowerCase(),
      )
    } else if (
      compositionBlockA.type === CompositionType.TOKEN &&
      compositionBlockB.type === CompositionType.POOL
    ) {
      return 1
    } else if (
      compositionBlockA.type === CompositionType.POOL &&
      compositionBlockB.type === CompositionType.TOKEN
    ) {
      return -1
    } else if (
      compositionBlockA.type === CompositionType.POOL &&
      compositionBlockB.type === CompositionType.POOL &&
      (compositionBlockA.value as IPoolModel).pool.poolType ===
        PoolType.ComposableStable &&
      (compositionBlockB.value as IPoolModel).pool.poolType !==
        PoolType.ComposableStable
    ) {
      return -1
    }

    return 0
  }

  const renderLinearPoolDetails = (
    nestedPoolModel: IPoolModel,
    type: 'balance' | 'value',
  ) => {
    const scaleFactor = selectScaleFactorForPool(poolId, nestedPoolModel.id)

    return (
      <Box
        height={310}
        pt={7}
        mt={6.5}
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
      >
        {nestedPoolModel.compositionBlocks.map(
          (block, compositionBlockIndex) => {
            const poolModel = block.value as IPoolModel

            const tokensTotalValueUSD =
              type === 'value'
                ? selectPoolBalancesUSD(poolModel.pool.id)
                : undefined

            const nestedScaleFactor = selectScaleFactorForPool(
              nestedPoolModel.pool.id,
              poolModel.id,
            )

            return (
              <Box
                key={compositionBlockIndex}
                height={85}
                display="flex"
                flexDirection="column"
                justifyContent="space-between"
              >
                {poolModel.compositionBlocks.map((block, index) => {
                  const token = block.value as IPoolToken

                  const value =
                    type === 'balance'
                      ? token.balance
                      : tokensTotalValueUSD?.[token.address] ??
                        BigDecimal.from(0)

                  const scaledValue = value
                    .mul(scaleFactor)
                    .mul(nestedScaleFactor)
                    .toNumber()

                  const precision =
                    isBtcToken(token.symbol) || scaledValue < 0.01 ? 4 : 2

                  const formattedValue = convertNumberToStringWithCommas(
                    scaledValue,
                    precision,
                    true,
                  )

                  const balance =
                    type === 'value' ? `$${formattedValue}` : formattedValue

                  return (
                    <Box key={index}>
                      <Typography>{balance}</Typography>
                    </Box>
                  )
                })}
              </Box>
            )
          },
        )}
      </Box>
    )
  }

  const poolCompositionBalances = (
    compositionBlock: CompositionBlock,
    balances: Balances,
  ): React.ReactNode => {
    if (compositionBlock.type === CompositionType.TOKEN) {
      const balance =
        balances?.[compositionBlock.value.address] ?? BigDecimal.from(0)

      const token = compositionBlock.value as IToken

      return (
        balance && (
          <Box>
            <Typography
              sx={{ height: 60, display: 'flex', alignItems: 'center' }}
              variant="paragraphMedium"
            >
              {convertNumberToStringWithCommas(
                balance.toNumber(),
                isBtcToken(token.symbol) || balance.toNumber() < 0.01 ? 4 : 2,
                true,
              )}
            </Typography>
          </Box>
        )
      )
    } else if (compositionBlock.type === CompositionType.POOL) {
      const nestedPoolModel = compositionBlock.value as IPoolModel

      if (
        nestedPoolModel.compositionBlocks &&
        isDeepLinearPool(nestedPoolModel)
      ) {
        return renderLinearPoolDetails(nestedPoolModel, 'balance')
      }

      return (
        <Box>
          <Box height={40} />
          {nestedPoolModel.tokens.map((token) => {
            const balance = balances?.[token.address] ?? BigDecimal.from(0)

            return (
              <Typography
                key={token.address}
                sx={{ height: 60, display: 'flex', alignItems: 'center' }}
                variant="paragraphMedium"
              >
                {balance
                  ? convertNumberToStringWithCommas(
                      balance.toNumber(),
                      isBtcToken(token.symbol) ? 4 : 2,
                      true,
                    )
                  : null}
              </Typography>
            )
          })}
        </Box>
      )
    }

    return null
  }

  const poolCompositionValue = (
    compositionBlock: CompositionBlock,
    balancesUSD: { [key: string]: BigDecimal },
  ): React.ReactNode => {
    if (compositionBlock.type === CompositionType.TOKEN) {
      const token = compositionBlock.value as IToken
      const valueUSD = balancesUSD[token.address] ?? BigDecimal.from(0)

      return (
        valueUSD && (
          <Box>
            <Typography
              sx={{ height: 60, display: 'flex', alignItems: 'center' }}
              variant="paragraphMedium"
            >
              ${convertNumberToStringWithCommas(valueUSD.toNumber())}
            </Typography>
          </Box>
        )
      )
    } else if (compositionBlock.type === CompositionType.POOL) {
      const nestedPoolModel = compositionBlock.value as IPoolModel

      if (
        nestedPoolModel.compositionBlocks &&
        isDeepLinearPool(nestedPoolModel)
      ) {
        return renderLinearPoolDetails(nestedPoolModel, 'value')
      }

      return (
        <Box>
          <Box height={40} />
          {nestedPoolModel.tokens.map((token) => {
            const poolValueUSD =
              balancesUSD[token.address] ?? BigDecimal.from(0)

            return (
              <Typography
                key={token.address}
                sx={{ height: 60, display: 'flex', alignItems: 'center' }}
                variant="paragraphMedium"
              >
                $
                {convertNumberToStringWithCommas(
                  poolValueUSD ? poolValueUSD?.toNumber() : 0,
                )}
              </Typography>
            )
          })}
        </Box>
      )
    }

    return null
  }

  const compositionBlocks = useMemo(() => {
    if (poolModel?.compositionBlocks) {
      return poolModel?.compositionBlocks.map((compositionBlock) => {
        if (compositionBlock.type === CompositionType.POOL) {
          const poolModel = cloneDeep(compositionBlock.value) as IPoolModel
          const sortedTokens = [...poolModel.tokens].sort((a, b) =>
            sortAssetsByBusinessOrder(a.symbol, b.symbol),
          )

          if (
            poolModel.compositionBlocks.some(
              (block) => block.type === CompositionType.POOL,
            )
          ) {
            return compositionBlock
          }

          const newPoolModel: IPoolModel = {
            ...poolModel,
            pool: poolModel.pool,
            address: poolModel.address,
            allTokens: poolModel.allTokens,
            compositionBlocks: poolModel.compositionBlocks,
            depositTokens: poolModel.depositTokens,
            id: poolModel.id,
            tokens: sortedTokens,
          }

          return {
            ...compositionBlock,
            value: newPoolModel,
          }
        }
        return compositionBlock
      })
    }

    return []
  }, [poolModel?.compositionBlocks])

  const balance = selectPoolBalances(poolId)
  const balanceUSD = selectPoolBalancesUSD(poolId)
  const chainId = useSelector(networkSelectors.applicationChainId)

  const rows: IRow[] = compositionBlocks
    .sort(sortCompositionBlock)
    .map((compositionBlock) => {
      return {
        id: compositionBlock.value.id,
        cells: {
          [ASSETS_FIELD_NAME]: {
            value: tokenIconCompositionRenderer(compositionBlock, chainId),
          },
          [BALANCE_FIELD_NAME]: {
            value: poolCompositionBalances(compositionBlock, balance ?? {}),
          },
          [VALUE_FIELD_NAME]: {
            value: poolCompositionValue(compositionBlock, balanceUSD ?? {}),
          },
        },
      } as IRow
    })

  const columns = [ASSETS_COLUMN, BALANCE_COLUMN, VALUE_COLUMN]

  return (
    <Box>
      <Box pl={3} pb={2} display="flex" alignItems="center">
        <Typography variant="h1">{messages.TITLE}</Typography>
      </Box>
      <Box>
        <Paper elevation={3}>
          {!isFetching && <Table columns={columns} rows={rows} />}
          {isFetching && <TableSkeleton columns={columns} rowsCount={3} />}
        </Paper>
      </Box>
    </Box>
  )
}

export default PoolCompositionContainer
