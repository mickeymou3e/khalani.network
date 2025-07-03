import React from 'react'
import { useSelector } from 'react-redux'

import PoolDetails from '@components/PoolPreview/PoolDetails'
import { poolDetailsColumn } from '@components/PoolPreview/PoolDetails/PoolDetails.table'
import { TableSkeleton } from '@hadouken-project/ui'
import { Box, Paper, Typography } from '@mui/material'
import { poolsModelsSelector } from '@store/pool/selectors/models/pool-model.selector'
import { BigDecimal } from '@utils/math'
import { getPoolFullName } from '@utils/pool'

import { messages } from './PoolDetailsContainer.messages'
import { IPoolDetailsContainerProps } from './PoolDetailsContainer.types'

const PoolDetailsContainer: React.FC<IPoolDetailsContainerProps> = ({
  poolId,
}) => {
  const selectPoolModels = useSelector(poolsModelsSelector.selectById)
  const poolModel = selectPoolModels(poolId)
  const isFetching = !poolModel

  const poolName = poolModel ? getPoolFullName(poolModel?.pool) : ''

  return (
    <Box>
      <Box pl={3} pb={2} display="flex" alignItems="center">
        <Typography variant="h1">{messages.TITLE}</Typography>
      </Box>
      <Paper elevation={3}>
        {!isFetching && (
          <PoolDetails
            id={poolId}
            address={poolModel.address}
            symbol={poolModel.pool.symbol}
            name={poolName}
            type={poolModel.pool.poolType}
            fee={poolModel.pool.swapFee.mul(BigDecimal.from(100, 0))}
            owner={poolModel.pool.owner}
            creationDate={poolModel.pool.createTime}
            amp={poolModel.pool.amp}
          />
        )}
        {isFetching && (
          <TableSkeleton columns={poolDetailsColumn} rowsCount={8} />
        )}
      </Paper>
    </Box>
  )
}

export default PoolDetailsContainer
