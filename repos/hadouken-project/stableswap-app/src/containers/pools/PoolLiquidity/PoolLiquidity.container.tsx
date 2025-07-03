import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { IRow, ToggleGroup } from '@hadouken-project/ui'
import { Box, Paper, Typography } from '@mui/material'
import { networkSelectors } from '@store/network/network.selector'
import { poolsModelsSelector } from '@store/pool/selectors/models/pool-model.selector'
import { poolJoinsExitsSelectors } from '@store/poolJoinExists/poolJoinsExits.selector'
import { poolJoinsExitsActions } from '@store/poolJoinExists/poolJoinsExits.slice'
import { walletSelectors } from '@store/wallet/wallet.selector'

import { PoolCommonTable } from '../PoolCommonTable'
import { poolLiquidityTokens, poolTransactionTime } from '../utils'
import {
  FIELD_NAME,
  LIQUIDITY_PROVISION_TYPE,
  TOGGLE_OPTIONS_LIQUIDITY,
} from './PoolLiquidity.constants'
import { MESSAGES } from './PoolLiquidity.messages'
import { COLUMNS } from './PoolLiquidity.table'
import {
  IPoolLiquidityContainerProps,
  LiquidityToggle,
} from './PoolLiquidity.types'

const PoolLiquidityContainer: React.FC<IPoolLiquidityContainerProps> = ({
  poolId,
}) => {
  const [selectedToggle, setSelectedToggle] = useState<LiquidityToggle>(
    LiquidityToggle.MyLiquidity,
  )
  const dispatch = useDispatch()
  const userId = useSelector(walletSelectors.userAddress)
  const selectPoolModel = useSelector(poolsModelsSelector.selectById)
  const selectLiquidityTransactions = useSelector(
    poolJoinsExitsSelectors.selectAll,
  )
  const selectHasMore = useSelector(poolJoinsExitsSelectors.selectHasMore)
  const isFetching = useSelector(
    poolJoinsExitsSelectors.selectPoolJoinsExitsLoading,
  )
  const hasMore = selectHasMore(selectedToggle)
  const poolModel = selectPoolModel(poolId)
  const chainId = useSelector(networkSelectors.applicationChainId)

  const liquidityTransactions = selectLiquidityTransactions(selectedToggle)

  const loadMoreTransactions = () => {
    dispatch(
      poolJoinsExitsActions.fetchPoolJoinsExitsRequest({
        userId,
        poolId,
        liquidityToggle: selectedToggle,
      }),
    )
  }

  const onToggleChange = (value: LiquidityToggle) => {
    setSelectedToggle(value)
  }

  const rows: IRow[] =
    liquidityTransactions.length > 0
      ? liquidityTransactions
          .sort(
            (transaction, nextTransaction) =>
              Number(nextTransaction.timestamp) - Number(transaction.timestamp),
          )
          .map(({ id, type, amounts, timestamp, tx, symbols }) => {
            return {
              id,
              cells: {
                [FIELD_NAME.ACTION]: {
                  value: LIQUIDITY_PROVISION_TYPE[type],
                },
                [FIELD_NAME.TOKENS]: {
                  value: poolLiquidityTokens(poolModel, amounts, symbols),
                },
                [FIELD_NAME.TIME]: {
                  value: poolTransactionTime(Number(timestamp), tx, chainId),
                },
              },
            }
          })
      : []

  useEffect(() => {
    dispatch(
      poolJoinsExitsActions.fetchPoolJoinsExitsRequest({
        poolId,
        userId,
        liquidityToggle: undefined,
      }),
    )
  }, [dispatch, poolId, userId])

  return (
    <Box>
      <Box pl={3} pb={2}>
        <Typography variant="h1">{MESSAGES.POOL_ACTIVITY}</Typography>
      </Box>
      <Paper elevation={3}>
        <Box mb={3} mt={1}>
          <ToggleGroup
            toggles={TOGGLE_OPTIONS_LIQUIDITY}
            selected={selectedToggle}
            onToggleChange={onToggleChange}
            sx={{
              borderColor: (theme) => theme.palette.secondary.dark,
            }}
          />
        </Box>
        <PoolCommonTable
          isFetching={isFetching}
          columns={COLUMNS}
          rows={rows}
          hasMore={hasMore}
          transactionsAmount={liquidityTransactions.length}
          loadMoreTransactions={loadMoreTransactions}
          message={
            selectedToggle === LiquidityToggle.MyLiquidity
              ? MESSAGES.NO_RESULT_MY
              : MESSAGES.NO_RESULT_ALL
          }
        />
      </Paper>
    </Box>
  )
}

export default PoolLiquidityContainer
