import React from 'react'

import MUITable from '@mui/material/Table'
import TableContainer from '@mui/material/TableContainer'

import { ITableProps } from './Table.types'
import TableBody from './TableBody.component'
import TableHead from './TableHead.component'

const Table: React.FC<ITableProps> = ({
  columns,
  rows,
  sortedColumnName,
  sortDesc,
  onSortColumn,
  onSortDesc,
  onRowClick,
  displayHeader = true,
  ...rest
}) => {
  return (
    <TableContainer
      sx={{
        overflowY: 'inherit',
      }}
      component={'div'}
    >
      <MUITable {...rest}>
        <TableHead
          columns={columns}
          sortedColumnName={sortedColumnName}
          sortDesc={sortDesc}
          onSortColumn={onSortColumn}
          onSortDesc={onSortDesc}
          displayHeader={displayHeader}
        />
        <TableBody onRowClick={onRowClick} rows={rows} columns={columns} />
      </MUITable>
    </TableContainer>
  )
}

export default Table
