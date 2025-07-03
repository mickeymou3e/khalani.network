import React, { useState } from 'react'
import { useSelector } from 'react-redux'

import { BorrowCard, CardList } from '@components/cards'
import SearchNotFoundPanel from '@components/panels/SearchNotFoundPanel'
import { SearchBoxSkeleton } from '@components/skeletons'
import BalanceListSkeleton from '@components/skeletons/BalanceListSkeleton'
import BorrowBalanceContainer from '@containers/balances/BorrowBalanceContainer'
import {
  AssetListSkeleton,
  IRow,
  SearchBox,
  Table,
  TableSkeleton,
} from '@hadouken-project/ui'
import { Box, Grid, Paper, Typography } from '@mui/material'
import { reservesSelectors } from '@store/reserves/reserves.selector'
import { tokenSelectors } from '@store/tokens/tokens.selector'
import { usePushHistoryInternal } from '@utils/navigation'

import { columns } from './Borrow.constants'
import { useBorrowAssetsList } from './Borrow.hooks'
import { messages } from './Borrow.messages'

const BorrowPage: React.FC = () => {
  const [searchText, setSearchText] = useState('')
  const pushHistoryInternal = usePushHistoryInternal()
  const isFetching = useSelector(reservesSelectors.isFetching)
  const tokens = useSelector(tokenSelectors.selectAllStandardTokens)

  const borrowAssets: IRow[] = useBorrowAssetsList()

  const filteredRows = borrowAssets.filter((row) =>
    String(row.cells.assets.sortingValue)
      .toLocaleLowerCase()
      .includes(searchText.toLocaleLowerCase()),
  )

  const onRowClick = (id: string) => {
    const token = tokens.find((token) => token.id === id)

    if (token) {
      pushHistoryInternal(`borrow/${token.address}`)
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
              <Box width="100%" pb={5}>
                <SearchBox
                  value={searchText}
                  valueChangeHandler={setSearchText}
                />
              </Box>
            )}

            <Box display={{ xs: 'none', md: 'block' }}>
              {isFetching ? (
                <TableSkeleton columns={columns} />
              ) : (
                <Table
                  columns={columns}
                  rows={filteredRows}
                  onRowClick={onRowClick}
                  sx={{
                    borderRadius: '0 0 3px 3px',
                  }}
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
                  Component={BorrowCard}
                />
              )}
            </Box>

            {searchText && filteredRows?.length === 0 && (
              <SearchNotFoundPanel searchText={searchText} />
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} lg={5} xl={4}>
          <Box pt={2} ml={6}>
            <Typography variant="h4Bold">{messages.MY_BORROWS}</Typography>
          </Box>

          <Box pt={{ xs: 2, lg: 3 }} pl={{ xs: 0, lg: 4 }}>
            {isFetching ? <BalanceListSkeleton /> : <BorrowBalanceContainer />}
          </Box>
        </Grid>
      </Grid>
    </>
  )
}

export default BorrowPage
