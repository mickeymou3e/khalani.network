import React from 'react'
import { useSelector } from 'react-redux'

import { Table, TableSkeleton } from '@hadouken-project/ui'
import { Box, Grid, Paper, Typography } from '@mui/material'
import { reservesSelectors } from '@store/reserves/reserves.selector'

import { useBackstopList } from './Backstop.hooks'
import { messages } from './Backstop.messages'
import { backstopColumns } from './Backstop.utils'

const BackstopPage: React.FC = () => {
  const isFetching = useSelector(reservesSelectors.isFetching)

  const rows = useBackstopList()

  const filteredRows = rows.filter((row) =>
    String(
      row.cells.assets.sortingValue || row.cells.assets.value,
    ).toLocaleLowerCase(),
  )

  return (
    <Box>
      <Box pl={3} pb={2}>
        <Typography variant="h1">{messages.TABLE_TITLE}</Typography>
      </Box>

      {isFetching && (
        <>
          <Box display={{ xs: 'none', md: 'block' }}>
            <TableSkeleton columns={backstopColumns} />
          </Box>
        </>
      )}

      {!isFetching && (
        <Paper elevation={3} sx={{ padding: 1, marginBottom: 2 }}>
          <Box>
            <Grid container alignItems="center" gap={{ xs: 2, md: 0 }}>
              <Grid item xs={12} md={8}></Grid>
              <Grid item xs={12}>
                <Box pb={2}>
                  <Typography
                    variant="paragraphMedium"
                    color={(theme) => theme.palette.text.gray}
                  >
                    The backstop pools require hTokens, such that your deposits
                    are boosted using both lending pools and backstop pools
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            <Table columns={backstopColumns} rows={filteredRows} />
          </Box>
        </Paper>
      )}
    </Box>
  )
}

export default BackstopPage
