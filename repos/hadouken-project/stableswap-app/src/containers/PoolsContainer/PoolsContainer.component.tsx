import React from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import PoolTable from '@components/PoolTable/PoolTable.component'
import { poolColumns } from '@components/PoolTable/PoolTable.table'
import { setPoolIdToSlug } from '@containers/pools/utils'
import { TableSkeleton } from '@hadouken-project/ui'
import { Box, Paper, Typography } from '@mui/material'
import { networkSelectors } from '@store/network/network.selector'
import { poolSelectors } from '@store/pool/selectors/pool.selector'
import { tokenSelectors } from '@store/tokens/tokens.selector'
import { formatNetworkName } from '@utils/network'

import { Page, PAGES_PATH } from '../../App'
import { messages } from './PoolsContainer.messages'

const PoolContainer: React.FC = () => {
  const history = useHistory()

  const pools = useSelector(poolSelectors.selectAll)
  const isFetchingPools = useSelector(poolSelectors.isFetching)

  const tokens = useSelector(tokenSelectors.selectAllTokens)
  const isFetchingTokens = useSelector(tokenSelectors.isFetching)

  const applicationNetworkName = useSelector(
    networkSelectors.applicationNetworkName,
  )

  const isFetching = isFetchingPools || isFetchingTokens

  const handleClick = (poolId: string) => {
    history.push(
      setPoolIdToSlug(
        `/${formatNetworkName(applicationNetworkName)}` + PAGES_PATH[Page.Pool],
        poolId,
      ),
    )
  }
  return (
    <>
      <Box pl={3} pb={2}>
        <Typography variant="h1">{messages.LABEL}</Typography>
      </Box>

      <Paper
        elevation={3}
        sx={{
          paddingX: { xs: 2, md: 3 },
        }}
      >
        {pools.length > 0 && !isFetching ? (
          <PoolTable pools={pools} tokens={tokens} onPoolClick={handleClick} />
        ) : (
          <TableSkeleton columns={poolColumns} rowsCount={2} />
        )}
      </Paper>
    </>
  )
}

export default PoolContainer
