import React from 'react'

import { Box, Tab, Tabs } from '@mui/material'
import MUITable from '@mui/material/Table'

import { CustomizedTable } from './Table.styled'
import { ITableProps } from './Table.types'
import TableBody from './TableBody.component'
import TableHead from './TableHead.component'

const Table: React.FC<ITableProps> = (props) => {
  const {
    columns,
    rows,
    isLoading,
    redirectPath,
    RouterLink,
    displayHeader = true,
    tabs,
    selectedTab,
    handleTabChange,
    handleRowClick,
    ...rest
  } = props

  return (
    <CustomizedTable>
      {tabs && tabs.length > 0 && (
        <Box className="tabs-container">
          <Tabs value={selectedTab} onChange={handleTabChange}>
            {tabs.map((tab) => (
              <Tab key={tab.value} label={tab.label} value={tab.value} />
            ))}
          </Tabs>
        </Box>
      )}

      <MUITable {...rest}>
        <TableHead columns={columns} displayHeader={displayHeader} />
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
  )
}

export default Table
