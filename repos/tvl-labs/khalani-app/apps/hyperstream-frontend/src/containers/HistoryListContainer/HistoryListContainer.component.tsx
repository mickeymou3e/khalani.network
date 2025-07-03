import React from 'react'

import { Box, Grid, Paper, Stack } from '@mui/material'
import ConnectWallet from '@shared/components/buttons/ConnectWallet'
import { useWallet } from '@shared/store'
import { Table, TransferIcon, Typography } from '@tvl-labs/khalani-ui'

import { HistoryListContainerProps } from './HistoryListContainer.types'
import { columns } from './HistoryListContainer.utils'

const HistoryListContainer: React.FC<HistoryListContainerProps> = (props) => {
  const { rowClickFn, rows, isLoading } = props
  const wallet = useWallet()

  return (
    <Grid container display="flex" alignItems="center" justifyContent="center">
      <Grid item md={12} lg={9} xl={7}>
        <Paper sx={{ p: 4 }}>
          <Stack mb={2} direction="row" alignItems="center" gap={1}>
            <TransferIcon />
            <Typography variant="h6" color="text.secondary" text={'History'} />
          </Stack>

          {wallet.status === 'connected' ? (
            <Table
              displayHeader={false}
              columns={columns}
              rows={rows}
              handleRowClick={rowClickFn}
              isLoading={isLoading}
            />
          ) : (
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              py={5}
              gap={2}
            >
              <Typography
                text={'Connect wallet to see history'}
                color="text.secondary"
                variant="body1"
              ></Typography>
              <ConnectWallet />
            </Box>
          )}
        </Paper>
      </Grid>
    </Grid>
  )
}

export default HistoryListContainer
