import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { BigNumberWithTooltip, IRow } from '@hadouken-project/ui'
import { Box, Paper, Typography } from '@mui/material'
import { networkSelectors } from '@store/network/network.selector'
import { poolSwapsSelectors } from '@store/poolSwaps/poolSwaps.selector'
import { poolSwapsActions } from '@store/poolSwaps/poolSwaps.slice'
import { BigDecimal } from '@utils/math'

import { PoolCommonTable } from '../PoolCommonTable'
import { poolSwapTokens, poolTransactionTime } from '../utils'
import { FIELD_NAME } from './PoolSwaps.constants'
import { MESSAGES } from './PoolSwaps.messages'
import { COLUMNS } from './PoolSwaps.table'
import { IPoolSwapsContainerProps } from './PoolSwaps.types'

export const PoolSwapsContainer: React.FC<IPoolSwapsContainerProps> = ({
  poolId,
}) => {
  const dispatch = useDispatch()

  const swaps = useSelector(poolSwapsSelectors.selectAll)
  const isFetching = useSelector(poolSwapsSelectors.selectPoolSwapsLoading)
  const hasMore = useSelector(poolSwapsSelectors.selectHasMore)
  const chainId = useSelector(networkSelectors.applicationChainId)

  const loadMoreTransactions = () => {
    dispatch(
      poolSwapsActions.fetchPoolSwapsRequest({
        poolId,
        isInitializeFetch: false,
      }),
    )
  }

  const rows: IRow[] =
    swaps.length > 0
      ? swaps.map((swap) => ({
          id: swap.id,
          cells: {
            [FIELD_NAME.VALUE]: {
              value: (
                <BigNumberWithTooltip
                  value={BigDecimal.fromString(
                    swap.valueUSD ?? '0',
                    27,
                  ).toBigNumber()}
                  decimals={27}
                  roundingDecimals={2}
                  showDollars
                />
              ),
            },
            [FIELD_NAME.TOKENS]: {
              value: poolSwapTokens(swap),
            },
            [FIELD_NAME.TIME]: {
              value: poolTransactionTime(
                Number(swap.timestamp),
                swap.tx,
                chainId,
              ),
            },
          },
        }))
      : []

  useEffect(() => {
    dispatch(
      poolSwapsActions.fetchPoolSwapsRequest({
        poolId,
        isInitializeFetch: true,
      }),
    )
  }, [dispatch, poolId])

  return (
    <Box>
      <Box pl={3} pb={2}>
        <Typography variant="h1">{MESSAGES.TITLE}</Typography>
      </Box>
      <Paper elevation={3}>
        <PoolCommonTable
          columns={COLUMNS}
          rows={rows}
          isFetching={isFetching}
          transactionsAmount={swaps.length}
          hasMore={hasMore}
          loadMoreTransactions={loadMoreTransactions}
          message={MESSAGES.NO_TRADES}
        />
      </Paper>
    </Box>
  )
}
