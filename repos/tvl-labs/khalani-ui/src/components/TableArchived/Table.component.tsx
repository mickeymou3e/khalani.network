import React, { useCallback, useEffect, useState } from 'react'

import { orderBy, filter, every, keys } from 'lodash'

import { Paper } from '@mui/material'
import MUITable from '@mui/material/Table'

import { CustomizedTable } from './Table.styled'
import { ESortOrder, FilteringParams, IRow, ITableProps } from './Table.types'
import TableBody from './TableBody.component'
import TableHead from './TableHead.component'

const Table: React.FC<ITableProps> = (props) => {
  const {
    columns,
    rows: rowsProps,
    isLoading,
    redirectPath,
    RouterLink,
    filteringParams,
    displayHeader = true,
    handleRowClick,
    ...rest
  } = props

  const [rows, setRows] = useState<IRow[] | undefined>(rowsProps)

  const filterRows = (data: IRow[], filteringParams: FilteringParams) =>
    filter(data, (item) =>
      every(keys(filteringParams), (key) =>
        filteringParams[key as keyof FilteringParams]
          ? item.cells[key].filteringValue?.includes(
              filteringParams[key as keyof FilteringParams] ?? '',
            )
          : true,
      ),
    )

  const orderRows = (
    value: string,
    rowsProps: IRow[],
    sortOrder?: ESortOrder,
  ) => orderBy(rowsProps, (item) => item.cells[value].sortingValue, sortOrder)

  const onSortColumn = useCallback(
    (value: string, sortOrder?: ESortOrder) => {
      if (!rowsProps) return
      let filteredRows: IRow[] | undefined
      const orderedRows = orderRows(value, rowsProps, sortOrder)
      if (filteringParams) {
        filteredRows = filterRows(orderedRows, filteringParams)
      }
      setRows(filteredRows || orderedRows)
    },
    [filteringParams, rowsProps],
  )

  useEffect(() => {
    if (!rowsProps || !filteringParams) return
    const filteredRows = filterRows(rowsProps, filteringParams)
    setRows(filteredRows)
  }, [filteringParams, rowsProps])

  useEffect(() => {
    const foundColumn = columns.find((column) => column.sortDefault)
    if (!foundColumn || !rowsProps) return
    const orderedRows = orderRows(
      foundColumn.name,
      rowsProps,
      foundColumn.sortOrder,
    )
    setRows(orderedRows)
  }, [columns, rowsProps])

  return (
    <Paper elevation={2} sx={{ padding: 0 }}>
      <CustomizedTable>
        <MUITable {...rest}>
          <TableHead
            columns={columns}
            onSortColumn={onSortColumn}
            displayHeader={displayHeader}
          />
          <TableBody
            rows={rows}
            columns={columns}
            isLoading={isLoading}
            redirectPath={redirectPath}
            RouterLink={RouterLink}
            handleRowClick={handleRowClick}
          />
        </MUITable>
      </CustomizedTable>
    </Paper>
  )
}

export default Table
