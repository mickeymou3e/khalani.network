import React from 'react'

import { Box, Grid, Paper, Stack } from '@mui/material'
import ConnectWallet from '@shared/components/buttons/ConnectWallet'
import { useWallet } from '@shared/store'
import {
  IRow,
  PrimaryButton,
  SecondaryButton,
  Table,
  TransferIcon,
  Typography,
} from '@tvl-labs/khalani-ui'

import { LiquidityListContainerProps } from './LiquidityListContainer.types'
import { liquidityColumns } from './LiquidityListContainer.utils'

const LiquidityListContainer: React.FC<LiquidityListContainerProps> = (
  props,
) => {
  const {
    rowClickFn,
    addBalanceFn,
    intentBalancesRows,
    isIntentBalancesInitialized,
    isNoBalanceView,
  } = props
  const wallet = useWallet()

  return (
    <Grid container display="flex" alignItems="center" justifyContent="center">
      <Grid item md={12} lg={9} xl={7}>
        <Box display="flex" justifyContent="flex-end" mb={4}>
          <SecondaryButton
            text={'Add a Liquidity Position'}
            onClick={addBalanceFn}
          />
        </Box>
        <Paper sx={{ p: 4 }}>
          <Stack mb={2} direction="row" justifyContent="space-between">
            <Stack direction="row" alignItems="center" gap={1}>
              <TransferIcon />
              <Typography
                variant="h6"
                color="text.secondary"
                text={'My Liquidity Positions'}
              />
            </Stack>
          </Stack>

          {isNoBalanceView && (
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              py={5}
              gap={2}
            >
              <Typography
                text={'No Liquidity Positions'}
                color="text.secondary"
                variant="body1"
              ></Typography>
              <PrimaryButton
                size="large"
                variant="contained"
                color="primary"
                onClick={addBalanceFn}
                text={'Add A Liquidity Position'}
              />
            </Box>
          )}

          {!isNoBalanceView &&
            (wallet.status === 'connected' ? (
              <Table
                displayHeader
                columns={liquidityColumns}
                rows={intentBalancesRows as IRow[]}
                handleRowClick={rowClickFn}
                isLoading={!isIntentBalancesInitialized}
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
                  text={'Connect wallet to see balances'}
                  color="text.secondary"
                  variant="body1"
                ></Typography>
                <ConnectWallet />
              </Box>
            ))}
        </Paper>
      </Grid>
    </Grid>
  )
}

export default LiquidityListContainer
