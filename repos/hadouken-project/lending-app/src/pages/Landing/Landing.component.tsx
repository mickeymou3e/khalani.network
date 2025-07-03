import React, { useState } from 'react'
import { useSelector } from 'react-redux'

import { CardList, LandingCard } from '@components/cards'
import SearchNotFoundPanel from '@components/panels/SearchNotFoundPanel'
import SearchBoxSkeleton from '@components/skeletons/SearchBoxSkeleton'
import { SearchBox, Table, TableSkeleton } from '@hadouken-project/ui'
import { Box, Paper, Typography } from '@mui/material'
import { reservesSelectors } from '@store/reserves/reserves.selector'

import { DEFAULT_SORTING_COLUMN } from './Landing.constants'
import { useReserveList } from './Landing.hooks'
import { messages } from './Landing.messages'
import { columns } from './Landing.table'

const LandingPage: React.FC = () => {
  const isFetching = useSelector(reservesSelectors.isFetching)

  const [searchText, setSearchText] = useState<string>('')

  const [sortDesc, setSortDesc] = useState<boolean | undefined>(true)
  const [sortingColumn, setSortingColumn] = useState(DEFAULT_SORTING_COLUMN)

  const onSortColumn = (columnName: string) => {
    setSortingColumn(columnName)
  }

  const onSortDesc = (desc: boolean | undefined) => {
    if (desc === undefined) {
      setSortDesc(true)
    } else if (desc) {
      setSortDesc(undefined)
    } else {
      setSortDesc(false)
    }
  }

  const rows = useReserveList({
    sortingColumn,
    sortDesc,
  })

  const filteredRows = rows.filter((row) =>
    String(row.cells.assets.sortingValue || row.cells.assets.value)
      .toLocaleLowerCase()
      .includes(searchText.toLocaleLowerCase()),
  )
  return (
    <Box>
      <Box pb={2} pl={3}>
        <Typography variant="h1">{messages.TABLE_TITLE}</Typography>
      </Box>

      {isFetching && (
        <>
          <SearchBoxSkeleton />

          <TableSkeleton rowsCount={6} columns={columns} />
        </>
      )}

      {!isFetching && (
        <>
          <Paper
            sx={{
              display: { xs: 'none', md: 'block' },
              padding: 1,
              marginBottom: 2,
            }}
            elevation={3}
          >
            <SearchBox value={searchText} valueChangeHandler={setSearchText} />

            <Box bgcolor={(theme) => theme.palette.background.paper} p={3}>
              <Table
                columns={columns}
                rows={filteredRows}
                sortedColumnName={sortingColumn}
                sortDesc={sortDesc}
                onSortColumn={onSortColumn}
                onSortDesc={onSortDesc}
              />

              {searchText && filteredRows?.length === 0 && (
                <SearchNotFoundPanel searchText={searchText} />
              )}
            </Box>
          </Paper>
          <Paper
            elevation={2}
            sx={{
              display: { xs: 'block', md: 'none' },
            }}
          >
            <SearchBox value={searchText} valueChangeHandler={setSearchText} />

            <CardList Component={LandingCard} rows={filteredRows} />

            {searchText && filteredRows?.length === 0 && (
              <SearchNotFoundPanel searchText={searchText} />
            )}
          </Paper>
        </>
      )}
    </Box>
  )
}

export default LandingPage
