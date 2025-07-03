import React, { ReactElement } from 'react'

import numbro from 'numbro'

import { Button } from '@components/buttons/Button'
import TokenWithNetwork from '@components/icons/TokenWithNetwork'
import { TokensRow } from '@components/icons/TokensRow'
import { ENetwork } from '@interfaces/core'
import { Grid, Typography } from '@mui/material'
import { formatFullTokenSymbol } from '@utils/tokens'

export const createIconCell = (
  tokenSymbols: string[],
  chainId?: ENetwork,
): ReactElement => (
  <Grid
    container
    direction="row"
    wrap="nowrap"
    key="icon"
    alignItems="center"
    gap={1}
  >
    {tokenSymbols.length === 1 && chainId ? (
      <TokenWithNetwork chainId={chainId} tokenSymbol={tokenSymbols[0]} />
    ) : (
      <TokensRow tokenSymbols={tokenSymbols} />
    )}
    <Grid item>
      <Typography variant="body2">
        {formatFullTokenSymbol(tokenSymbols)}
      </Typography>
    </Grid>
  </Grid>
)

export const CreateBalance = (amount: number, value: number): ReactElement => (
  <Grid container direction="column" wrap="nowrap">
    <Grid item>{numbro(amount).format('0.00a')}</Grid>
    <Grid item>
      <Typography fontSize="12px" color="text.secondary">
        {numbro(value).format('$ 0,0.00')}
      </Typography>
    </Grid>
  </Grid>
)

export const CreateButtons = (
  firstBtnArgs: { text: string; onClick: () => void },
  secondBtnArgs: { text: string; onClick: () => void },
): ReactElement => (
  <Grid
    container
    direction="row"
    wrap="nowrap"
    justifyContent="space-between"
    gap={2}
  >
    <Grid item xs={6}>
      <Button {...firstBtnArgs} fullWidth variant="contained" />
    </Grid>
    <Grid item xs={6}>
      <Button {...secondBtnArgs} fullWidth variant="contained" />
    </Grid>
  </Grid>
)
