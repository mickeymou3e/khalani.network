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

import { LiquidityListContainerProps } from './MTokensListContainer.types'
import { mTokenColumns } from './MTokensListContainer.utils'

const LiquidityListContainer: React.FC<LiquidityListContainerProps> = (
  props,
) => {
  const {
    rowClickFn,
    addBalanceFn,
    mTokenBalancesRows,
    isMTokenBalancesInitialized,
    isNoBalanceView,
  } = props
  const wallet = useWallet()

  return (
    <Grid container display="flex" alignItems="center" justifyContent="center">
      <Grid item md={12} lg={9} xl={7}>
        <Box display="flex" justifyContent="flex-end" mb={4}>
          <SecondaryButton text={'Deposit Tokens'} onClick={addBalanceFn} />
        </Box>
        <Paper sx={{ p: 4 }}>
          <Stack mb={2} direction="row" justifyContent="space-between">
            <Stack direction="row" alignItems="center" gap={1}>
              <TransferIcon />
              <Typography
                variant="h6"
                color="text.secondary"
                text={'My MTokens'}
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
                text={'No MTokens'}
                color="text.secondary"
                variant="body1"
              ></Typography>
              <PrimaryButton
                size="large"
                variant="contained"
                color="primary"
                onClick={addBalanceFn}
                text={'Deposit Tokens'}
              />
            </Box>
          )}
          {!isNoBalanceView &&
            (wallet.status === 'connected' ? (
              <Table
                displayHeader
                columns={mTokenColumns}
                rows={mTokenBalancesRows as IRow[]}
                handleRowClick={rowClickFn}
                isLoading={!isMTokenBalancesInitialized}
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
