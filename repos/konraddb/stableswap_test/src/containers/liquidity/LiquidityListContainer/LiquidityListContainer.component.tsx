import React, { useMemo } from 'react'
import { useHistory } from 'react-router-dom'

import { Table } from '@hadouken-project/ui'
import { Avatar, Box, Paper, TableContainer } from '@mui/material'
import InternalTabsSelector from '@ui/InternalTabsSelector'
import TokenWithChainTile from '@ui/TokenWithChainTile'

import { useLiquidity } from './LiquidityListContainer.hooks'
import { columns, tabs } from './LiquidityListContainer.utils'

const LiquidityListContainer: React.FC = () => {
  const { liquidityList, userTVLList } = useLiquidity()
  const history = useHistory()

  const rows = useMemo(
    () =>
      liquidityList.map((liquidity) => ({
        id: liquidity.id.toString(),
        cells: {
          tokenSymbol: {
            value: (
              <Box display="flex" gap={2}>
                <Avatar
                  src={liquidity.chain.logo}
                  sx={{ width: 30, height: 30 }}
                />
                <Box
                  bgcolor={(theme) => theme.palette.background.backgroundBorder}
                  px={1}
                  py={0.25}
                >
                  {liquidity.token.symbol}
                </Box>
              </Box>
            ),
          },
          chainName: {
            value: `${liquidity.chain.chainName}`,
          },
          tvl: {
            value: `$${liquidity.tvl.toFixed(2)}`,
          },
          volume: {
            value: `$${liquidity.volume.toFixed(2)}`,
          },
        },
      })),
    [liquidityList],
  )

  const handleRowClick = (id: string) => {
    history.push(`/liquidity/add/${id}`)
  }

  return (
    <>
      <Box mb={4}>
        <InternalTabsSelector tabs={tabs} selectedTab={0} />
      </Box>
      <Box display="flex" gap={4} mb={4}>
        {userTVLList.map((tvl) => (
          <TokenWithChainTile
            key={tvl.id}
            chainLogo={tvl.chain.logo}
            tokenName={tvl.token.name}
            amount={tvl.amount}
          />
        ))}
      </Box>

      <Paper
        elevation={3}
        sx={{
          paddingX: { xs: 2, md: 3 },
        }}
      >
        <TableContainer>
          <Table columns={columns} rows={rows} onRowClick={handleRowClick} />
        </TableContainer>
      </Paper>
    </>
  )
}

export default LiquidityListContainer
