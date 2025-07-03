import React from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import PoolTable from '@components/PoolTable/PoolTable.component'
import { columns } from '@components/PoolTable/PoolTable.utils'
import { TableSkeleton } from '@components/skeletons'
import { Page } from '@constants/Page'
import { setPoolIdToSlug } from '@containers/pools/utils'
import { PoolType } from '@interfaces/pool'
import { IToken } from '@interfaces/token'
import { Box, Paper, Typography } from '@mui/material'
import { ByPoolId } from '@store/pool/pool.types'
import { poolsModelsSelector } from '@store/pool/selectors/models/pool-model.selector'
import { poolSelectors } from '@store/pool/selectors/pool.selector'
import { balancesValuesUSDSelectors } from '@store/pricedBalances/selectors/balancesValuesUSD.selector'
import { tokenSelectors } from '@store/tokens/tokens.selector'

import { PAGES_PATH } from '../../App'
import { messages } from './PoolsContainer.messages'

const PoolContainer: React.FC = () => {
  const history = useHistory()

  const pools = useSelector(poolSelectors.selectAll)
  const selectPoolModelById = useSelector(poolsModelsSelector.selectById)

  const poolTokensByPoolId = pools.reduce((poolTokensByPoolId, { id }) => {
    const poolModel = selectPoolModelById(id)
    return {
      ...poolTokensByPoolId,
      [id]: poolModel?.depositTokens,
    }
  }, {} as ByPoolId<IToken[]>)

  const tokens = useSelector(tokenSelectors.selectAllTokens)

  const selectTokensValuesUSD = useSelector(
    balancesValuesUSDSelectors.selectTokensValuesUSD,
  )

  const handleClick = (poolId: string) => {
    history.push(setPoolIdToSlug(PAGES_PATH[Page.Pool], poolId))
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
        {pools.length > 0 ? (
          <PoolTable
            pools={pools.filter(
              ({ poolType }) =>
                poolType !== (PoolType.AaveLinear || PoolType.Linear),
            )}
            tokensByPoolId={poolTokensByPoolId}
            tokens={tokens}
            onPoolClick={handleClick}
          />
        ) : (
          <TableSkeleton columns={columns} rowsCount={2} />
        )}
      </Paper>
    </>
  )
}

export default PoolContainer
