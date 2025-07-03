import React, { useState } from 'react'
import { useSelector } from 'react-redux'

import { BalanceCard, CardList } from '@components/cards'
import SearchNotFoundPanel from '@components/panels/SearchNotFoundPanel'
import { SearchBoxSkeleton } from '@components/skeletons'
import BalanceListSkeleton from '@components/skeletons/BalanceListSkeleton'
import DepositBalanceContainer from '@containers/balances/DepositBalanceContainer/DepositBalanceContainer.component'
import { messages as depositMessages } from '@containers/balances/DepositBalanceContainer/DepositBalanceContainer.messages'
import {
  AssetListSkeleton,
  SearchBox,
  Table,
  TableSkeleton,
} from '@hadouken-project/ui'
import { Box, Grid, Paper, Typography } from '@mui/material'
import { reservesSelectors } from '@store/reserves/reserves.selector'
import { tokenSelectors } from '@store/tokens/tokens.selector'
import { usePushHistoryInternal } from '@utils/navigation'

import { columns } from './Deposit.constants'
import { useDepositAssetsList } from './Deposit.hooks'
import { messages } from './Deposit.messages'

const DepositPage: React.FC = () => {
  const [searchText, setSearchText] = useState('')
  const pushHistoryInternal = usePushHistoryInternal()

  const isFetching = useSelector(reservesSelectors.isFetching)
  const tokens = useSelector(tokenSelectors.selectAllStandardTokens)

  const depositAssets = useDepositAssetsList()

  const filteredRows = depositAssets.filter((row) =>
    String(row.cells.assets.sortingValue)
      .toLocaleLowerCase()
      .includes(searchText.toLocaleLowerCase()),
  )

  const onRowClick = (id: string) => {
    const token = tokens.find((x) => x.id === id)
    if (token) {
      pushHistoryInternal(`deposit/${token.address}`)
    }
  }

  return (
    <>
      <Grid container>
        <Grid item xs={12} lg={7} xl={8}>
          <Box pl={3} pb={2}>
            <Typography variant="h1">{messages.TABLE_TITLE}</Typography>
          </Box>
          <Paper
            elevation={3}
            sx={{
              paddingX: { xs: 2, md: 3 },
            }}
          >
            {isFetching ? (
              <SearchBoxSkeleton />
            ) : (
              <Box width="100%">
                <SearchBox
                  value={searchText}
                  valueChangeHandler={setSearchText}
                />
              </Box>
            )}

            <Box pt={2} display={{ xs: 'none', md: 'block' }}>
              {isFetching ? (
                <TableSkeleton columns={columns} />
              ) : (
                <Table
                  sx={{
                    '.MuiTableHead-root .MuiTableRow-root': {
                      borderTop: 'none',
                    },
                  }}
                  columns={columns}
                  rows={filteredRows}
                  onRowClick={onRowClick}
                />
              )}
            </Box>
            <Box display={{ xs: 'block', md: 'none' }}>
              {isFetching ? (
                <AssetListSkeleton />
              ) : (
                <CardList
                  rows={filteredRows}
                  onRowClick={onRowClick}
                  Component={BalanceCard}
                />
              )}
            </Box>

            {searchText && filteredRows?.length === 0 && (
              <SearchNotFoundPanel searchText={searchText} />
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} lg={5} xl={4}>
          <Box pt={2} ml={{ xs: 3, lg: 6 }}>
            <Typography variant="h4Bold">
              {depositMessages.MY_DEPOSITS}
            </Typography>
          </Box>

          <Box pt={{ xs: 2, lg: 3 }} pl={{ xs: 0, lg: 4 }}>
            {isFetching ? <BalanceListSkeleton /> : <DepositBalanceContainer />}
          </Box>
        </Grid>
      </Grid>
    </>
  )
}

export default DepositPage
