import React, { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'

import {
  getTokenIconComponent,
  SearchBox,
  Table,
  TokenList,
} from '@hadouken-project/ui'
import { GENERIC_POOL_SYMBOL } from '@interfaces/pool'
import { IToken } from '@interfaces/token'
import { Grid, Tooltip, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import TableContainer from '@mui/material/TableContainer'
import { metricsSelectors } from '@store/metrics/metrics.selectors'
import { isPopularToken } from '@utils/token'

import { useSwapFeePercentage } from './PoolTable.hooks'
import { IPoolTable } from './PoolTable.types'
import { columns } from './PoolTable.utils'

const PoolTable: React.FC<IPoolTable> = ({
  pools,
  tokens,
  tokensByPoolId,
  onPoolClick,
}) => {
  const [searchText, setSearchText] = useState('')
  const [popularTokens, setPopularTokens] = useState<IToken[]>(
    tokens?.filter(({ address }) => isPopularToken(address)),
  )
  const [selectedTokens, setSelectedTokens] = useState<IToken[]>([])

  const protocolSwapFeePercentage = useSwapFeePercentage()

  const handlePopularTokenList = (id: string) => {
    const removedItem = popularTokens.find((token) => token.id === id)
    setSelectedTokens(
      removedItem ? [...selectedTokens, removedItem] : [...selectedTokens],
    )
    const filteredTokens = popularTokens?.filter((token) => token.id !== id)
    setPopularTokens(filteredTokens)
  }

  const handleSelectedTokenList = (id: string) => {
    const removedItem = selectedTokens?.find((token) => token.id === id)
    setPopularTokens(
      removedItem ? [...popularTokens, removedItem] : [...popularTokens],
    )
    const filteredToken = selectedTokens?.filter((token) => token.id !== id)
    setSelectedTokens(filteredToken)
  }

  const filterSelectedTokens = selectedTokens.map((token) => token.symbol)

  const selectPoolTotalValueUSD = useSelector(
    metricsSelectors.selectPoolTotalValueUSD,
  )

  const selectPoolVolume24hUSD = useSelector(
    metricsSelectors.selectPoolVolume24hUSD,
  )

  const selectPoolAPR = useSelector(metricsSelectors.selectPoolAPR)

  const rows = useMemo(() => {
    const poolRow = pools
      .filter(({ tokens }) =>
        filterSelectedTokens.length > 0
          ? tokens.some((token) => filterSelectedTokens.includes(token.symbol))
          : true,
      )
      .map((pool) => {
        const poolTokens = tokensByPoolId?.[pool.id]
        const allTokensGridSize = pool.tokens.length <= 2 ? 12 : 6
        const poolTotalValueUSD = selectPoolTotalValueUSD(pool.id)
        const volume24hUSD = selectPoolVolume24hUSD(pool.id)
        const apr = selectPoolAPR(pool.id, protocolSwapFeePercentage)

        return {
          id: pool.id,
          cells: {
            assets: {
              value: (
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
                        {poolTokens?.map(({ id, address, symbol }) => {
                          const Icon = getTokenIconComponent(
                            pools
                              .map(({ address }) => address)
                              .includes(address)
                              ? GENERIC_POOL_SYMBOL
                              : symbol,
                          )
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
                                <Icon width={40} height={40} />
                              </Box>
                            </Grid>
                          )
                        })}
                      </Box>
                    </Tooltip>
                  </Box>
                </Box>
              ),
              sortingValue: pool.name,
            },
            composition: {
              value: (
                <Box display="flex" alignItems="center">
                  {poolTokens?.map(({ id, symbol: tokenSymbol }) => {
                    const selectedToken = selectedTokens.find(
                      (selectedToken) => selectedToken.symbol === tokenSymbol,
                    )
                    return (
                      <Box
                        key={id}
                        display="flex"
                        flexDirection="row"
                        alignItems="center"
                        mr={0.5}
                        component="span"
                        bgcolor={(theme) =>
                          theme.palette.background.backgroundBorder
                        }
                        border={(theme) =>
                          selectedToken
                            ? `1px solid ${theme.palette.text.secondary}`
                            : 'none'
                        }
                        px={1}
                        py={0.25}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {tokenSymbol}
                        </Typography>
                      </Box>
                    )
                  })}
                </Box>
              ),
            },
            apy: {
              value: `${apr.toFixed(2)}%`,
            },
            volume: {
              value: `$${volume24hUSD.toFixed(2)}`,
            },
            tvl: {
              value: `$${poolTotalValueUSD.toFixed(2)}`,
            },
          },
        }
      })
    return poolRow
  }, [
    pools,
    filterSelectedTokens,
    tokensByPoolId,
    selectPoolTotalValueUSD,
    selectPoolVolume24hUSD,
    selectPoolAPR,
    protocolSwapFeePercentage,
    selectedTokens,
  ])

  const filteredRows = rows.filter((row) =>
    String(row.cells.assets.sortingValue)
      .toLocaleLowerCase()
      .includes(searchText.toLocaleLowerCase()),
  )

  return (
    <>
      <SearchBox value={searchText} valueChangeHandler={setSearchText} />
      <TokenList
        popularTokensList={popularTokens}
        selectedTokenList={selectedTokens}
        handlePopularTokenList={handlePopularTokenList}
        handleSelectedTokenList={handleSelectedTokenList}
      />
      <TableContainer>
        <Table columns={columns} rows={filteredRows} onRowClick={onPoolClick} />
      </TableContainer>
    </>
  )
}

export default PoolTable
