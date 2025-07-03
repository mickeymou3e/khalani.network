import React from 'react'
import { useSelector } from 'react-redux'

import { tokenIconCompositionRenderer } from '@containers/pools/PoolComposition/PoolComposition.utils'
import { IColumn, IRow, Table, TableSkeleton } from '@hadouken-project/ui'
import { IPool } from '@interfaces/pool'
import { IToken } from '@interfaces/token'
import { Box, Paper, Typography } from '@mui/material'
import { balancesSelectors } from '@store/balances/selectors/balances.selector'
import { poolBalancesSelectors } from '@store/balances/selectors/pool/balances.selector'
import { poolsModelsSelector } from '@store/pool/selectors/models/pool-model.selector'
import {
  CompositionBlock,
  CompositionType,
  IPoolModel,
} from '@store/pool/selectors/models/types'
import { poolBalancesValuesUSDSelectors } from '@store/pricedBalances/selectors/pool/balancesValuesUSD.selector'
import { BigDecimal } from '@utils/math'

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

const PoolCompositionContainer: React.FC<IPoolCompositionContainerProps> = ({
  poolId,
}) => {
  const isFetching = false
  const selectPoolModels = useSelector(poolsModelsSelector.selectById)
  const selectTokensBalances = useSelector(
    balancesSelectors.selectTokensBalances,
  )
  const selectPoolBalancesByAddress = useSelector(
    poolBalancesSelectors.selectPoolBalancesByAddress,
  )
  const selectPoolValuesUSD = useSelector(
    poolBalancesValuesUSDSelectors.selectPoolValuesUSD,
  )
  const selectPoolValuesUSDByAddress = useSelector(
    poolBalancesValuesUSDSelectors.selectPoolValuesUSDByAddress,
  )
  const poolModel = selectPoolModels(poolId)

  const poolValuesUSD = poolModel && selectPoolValuesUSD(poolModel.id)

  // TODO: move to selector layer
  const poolCompositionBalances = (
    compositionBlock: CompositionBlock,
  ): React.ReactNode => {
    if (compositionBlock.type === CompositionType.TOKEN) {
      const token = compositionBlock.value as IToken
      const balances =
        poolModel && selectTokensBalances
          ? selectTokensBalances(poolModel.address, [token.address])
          : null
      const balance = balances?.[token.address] ?? BigDecimal.from(0)

      return (
        balance && (
          <Box>
            <Typography
              sx={{ height: 60, display: 'flex', alignItems: 'center' }}
              variant="paragraphMedium"
            >
              {balance.toFixed(2)}
            </Typography>
          </Box>
        )
      )
    } else if (compositionBlock.type === CompositionType.POOL) {
      const nestedPoolModel = compositionBlock.value as IPoolModel

      const poolBalances =
        poolModel && selectPoolBalancesByAddress
          ? selectPoolBalancesByAddress(poolModel.address, nestedPoolModel.id)
          : null

      return poolBalances && Object.keys(poolBalances).length > 0 ? (
        <Box>
          <Box height={40} />
          {nestedPoolModel.tokens.map((token) => {
            const poolBalance = poolBalances[token.address]

            return (
              <Typography
                key={token.address}
                sx={{ height: 60, display: 'flex', alignItems: 'center' }}
                variant="paragraphMedium"
              >
                {poolBalance?.toFixed(2)}
              </Typography>
            )
          })}
        </Box>
      ) : (
        0
      )
    }

    return null
  }

  const poolCompositionValue = (
    compositionBlock: CompositionBlock,
  ): React.ReactNode => {
    if (compositionBlock.type === CompositionType.TOKEN) {
      const token = compositionBlock.value as IToken
      const valueUSD = poolValuesUSD
        ? poolValuesUSD[token.address]
        : BigDecimal.from(0)

      return (
        valueUSD && (
          <Box>
            <Typography
              sx={{ height: 60, display: 'flex', alignItems: 'center' }}
              variant="paragraphMedium"
            >
              ${valueUSD.toFixed(2)}
            </Typography>
          </Box>
        )
      )
    } else if (compositionBlock.type === CompositionType.POOL) {
      const nestedPoolModel = compositionBlock.value as IPoolModel

      const poolValuesUSD =
        poolModel && selectPoolValuesUSDByAddress
          ? selectPoolValuesUSDByAddress(poolModel.address, nestedPoolModel.id)
          : null

      return poolValuesUSD && Object.keys(poolValuesUSD).length > 0 ? (
        <Box>
          <Box height={40} />
          {nestedPoolModel.tokens.map((token) => {
            const poolValueUSD =
              poolValuesUSD?.[token.address] ?? BigDecimal.from(0)

            return (
              <Typography
                key={token.address}
                sx={{ height: 60, display: 'flex', alignItems: 'center' }}
                variant="paragraphMedium"
              >
                ${poolValueUSD.toFixed(2)}
              </Typography>
            )
          })}
        </Box>
      ) : (
        0
      )
    }

    return null
  }

  const rows: IRow[] = poolModel?.compositionBlocks
    ? poolModel?.compositionBlocks.map((compositionBlock) => {
        return {
          id: compositionBlock.value.id,
          cells: {
            [ASSETS_FIELD_NAME]: {
              value: tokenIconCompositionRenderer(compositionBlock),
            },
            [BALANCE_FIELD_NAME]: {
              value: poolCompositionBalances(compositionBlock),
            },
            [VALUE_FIELD_NAME]: {
              value: poolCompositionValue(compositionBlock),
            },
          },
        } as IRow
      })
    : []

  const columns = [ASSETS_COLUMN, BALANCE_COLUMN, VALUE_COLUMN]

  return (
    <Box>
      <Box pl={3} pb={2} display="flex" alignItems="center">
        <Typography variant="h1">{messages.TITLE}</Typography>
      </Box>
      <Paper elevation={3}>
        {!isFetching && <Table columns={columns} rows={rows} />}
        {isFetching && <TableSkeleton columns={columns} rowsCount={3} />}
      </Paper>
    </Box>
  )
}

export default PoolCompositionContainer
