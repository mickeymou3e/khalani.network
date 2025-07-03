import React, { useState } from 'react'

import { orderBy } from 'lodash-es'

import Table from '@components/Table/Table.component'
import { ITableProps } from '@components/Table/Table.types'
import { SearchBox } from '@components/search/SearchBox'
import { Grid, Paper, Typography, alpha } from '@mui/material'

const SortableTable: React.FC<ITableProps> = ({
  columns,
  rows: rowsProps,
  onRowClick,
  sortedColumnName: sortedColumnNameProps,
  sortDesc: sortDescProps,
}) => {
  const [searchPhrase, setSearchPhrase] = useState<string>('')
  const [sortedColumnName, setSortedColumnName] = useState<string | undefined>(
    sortedColumnNameProps,
  )
  const [sortDesc, setSortDesc] = useState<boolean | undefined>(sortDescProps)
  const rows =
    sortedColumnName && sortDesc !== null
      ? orderBy(
          rowsProps,
          (item) =>
            item.cells[sortedColumnName]?.sortingValue ||
            item.cells[sortedColumnName]?.value,
          sortDesc ? 'desc' : 'asc',
        )
      : rowsProps

  const filteredRows = rows?.filter((row) =>
    String(row.cells.assets.sortingValue)
      .toLocaleLowerCase()
      .includes(searchPhrase.toLocaleLowerCase()),
  )
  return (
    <>
      <Paper
        sx={{
          backgroundColor: (theme) => alpha(theme.palette.common.black, 0.5),
        }}
      >
        <Grid container alignItems="center">
          <Grid item md={6}>
            <Typography variant="h5">Available to deposit</Typography>
          </Grid>
          <Grid item md={6}>
            <SearchBox
              value={searchPhrase}
              valueChangeHandler={setSearchPhrase}
            />
          </Grid>
        </Grid>
      </Paper>
      <Table
        columns={columns}
        rows={filteredRows}
        sortedColumnName={sortedColumnName}
        sortDesc={sortDesc}
        onSortColumn={setSortedColumnName}
        onSortDesc={setSortDesc}
        onRowClick={onRowClick}
      />
    </>
  )
}

export default SortableTable
