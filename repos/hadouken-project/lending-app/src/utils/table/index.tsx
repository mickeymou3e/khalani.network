import React, { ReactElement } from 'react'

import { BigNumber } from 'ethers'
import numbro from 'numbro'

import {
  BigNumberWithTooltip,
  Button,
  convertBigNumberToDecimal,
  IRow,
  convertNumberToStringWithCommas,
  truncateToSpecificDecimals,
} from '@hadouken-project/ui'
import { BigNumberWithTooltipProps } from '@interfaces/utils'
import { Box, ButtonProps, Grid, Typography, useTheme } from '@mui/material'

const PERCENTAGE_DECIMAL = 25 // 27 - 2 (Percentage is in Ray - % decimals is 2)

export interface RowsWithTotalBalance {
  rows: IRow[]
  totalBalanceInDollars: BigNumber
}

interface BalanceProps {
  balance: BigNumber
  decimals: number
  tokenPriceInDollars: BigNumber
  textAlign?: BigNumberWithTooltipProps['textAlign']
}

export const Balance: React.FC<BalanceProps> = ({
  balance,
  decimals,
  tokenPriceInDollars,
  textAlign,
}) => {
  const theme = useTheme()
  return (
    <Grid display={{ xs: 'flex', md: 'block' }} container>
      <Grid item xs={6}>
        {convertNumberToStringWithCommas(
          Number(convertBigNumberToDecimal(balance, decimals)),
          4,
          true,
        )}
      </Grid>
      <Grid item xs={6}>
        <BigNumberWithTooltip
          value={tokenPriceInDollars}
          decimals={decimals}
          color={theme.palette.text.secondary}
          dolarTooltip
          textAlign={textAlign}
          roundingDecimals={2}
          showDollars
        />
      </Grid>
    </Grid>
  )
}

export const createIconCell = (
  icon: ReactElement,
  title?: string,
): ReactElement => (
  <Grid
    container
    direction="row"
    wrap="nowrap"
    key="icon"
    alignItems="center"
    gap={2}
  >
    <Grid item display="inline-flex">
      {icon}
    </Grid>
    <Grid item>
      <Typography variant="paragraphMedium" sx={{ fontWeight: 700 }}>
        {title}
      </Typography>
    </Grid>
  </Grid>
)

export const createIconCellSubtitle = (
  icon: ReactElement,
  title?: string,
  subTitle?: string,
): ReactElement => (
  <Grid
    container
    direction="row"
    wrap="nowrap"
    key="icon"
    alignItems="center"
    gap={2}
  >
    <Grid item display="inline-flex">
      {icon}
    </Grid>
    <Grid item>
      <Box display="flex" flexDirection="column" justifyContent="space-between">
        <Typography variant="paragraphBig">{title}</Typography>
        <Typography
          variant="caption"
          color={(theme) => theme.palette.text.secondary}
        >
          {subTitle}
        </Typography>
      </Box>
    </Grid>
  </Grid>
)

export const CreateBalance = (
  balance: string,
  balanceInDollars: string,
): ReactElement => (
  <Grid container direction="column" wrap="nowrap">
    <Grid item>
      <Typography variant="paragraphBig" whiteSpace="nowrap">
        {numbro(balance).format('$0.00a').slice(1)}
      </Typography>
    </Grid>
    <Grid item>
      <Typography
        variant="caption"
        color={(theme) => theme.palette.text.secondary}
        whiteSpace="nowrap"
      >
        {numbro(balanceInDollars).format('$ 0,0.00')}
      </Typography>
    </Grid>
  </Grid>
)

export const CreateButtons = (
  firstBtnArgs: ButtonProps & {
    text: string
    testID?: string
  },
  secondBtnArgs: ButtonProps & {
    text: string
    testID?: string
  },
): ReactElement => {
  const { testID: firstBtnID, ...restOfFirstBtn } = firstBtnArgs
  const { testID: secondtBtnID, ...restOfSecondBtn } = secondBtnArgs
  return (
    <Grid
      container
      direction="row"
      wrap="nowrap"
      justifyContent="space-between"
      gap={2}
    >
      <Grid item xs={6}>
        <Button
          {...restOfFirstBtn}
          data-testid={firstBtnID}
          fullWidth
          variant="contained"
        />
      </Grid>
      {secondBtnArgs && (
        <Grid item xs={6}>
          <Button
            {...restOfSecondBtn}
            data-testid={secondtBtnID}
            fullWidth
            variant="contained"
          />
        </Grid>
      )}
    </Grid>
  )
}

export const bigNumberPercentage = (
  value: BigNumber,
  decimals: number = PERCENTAGE_DECIMAL,
): string => {
  const result = convertBigNumberToDecimal(value, decimals)

  return `${truncateToSpecificDecimals(result, 2)}%`
}
