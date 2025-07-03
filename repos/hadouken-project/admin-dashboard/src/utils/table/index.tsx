import React, { ReactElement, useRef } from 'react'

import { BigNumber } from 'ethers'
import numbro from 'numbro'

import { Button, IRow } from '@hadouken-project/ui'
import { BigNumberWithTooltipProps } from '@interfaces/utils'
import { Box, ButtonProps, Grid, Tooltip, Typography } from '@mui/material'
import { Instance } from '@popperjs/core'
import {
  bigNumberToString,
  convertBigNumberToDecimal,
  truncateDecimals,
} from '@utils/stringOperations'

import { PRICE_DECIMALS } from '../../constants/Lending'

const TOOLTIP_DISPLAY_DECIMALS = 13
const PERCENTAGE_DECIMAL = 25 // 27 - 2 (Percentage is in Ray - % decimals is 2)
const COLOR_GREEN = '#57ff86'

export interface RowsWithTotalBalance {
  rows: IRow[]
  totalBalanceInDollars: BigNumber
}

interface BalanceProps {
  balance: BigNumber
  decimals: number
  symbol?: string
  tokenPriceInDollars: BigNumber
  textAlign?: BigNumberWithTooltipProps['textAlign']
}

export const Balance: React.FC<BalanceProps> = ({
  balance,
  decimals,
  symbol,
  tokenPriceInDollars,
  textAlign,
}) => (
  <Grid display={{ xs: 'flex', md: 'block' }} container>
    <Grid item xs={6} display="flex">
      <BigNumberWithTooltip
        value={balance}
        decimals={decimals}
        textAlign={textAlign}
      />
      <Typography fontWeight="bold">&nbsp;{symbol}</Typography>
    </Grid>
    <Grid item xs={6}>
      <BigNumberWithTooltip
        value={tokenPriceInDollars}
        decimals={PRICE_DECIMALS}
        color={COLOR_GREEN}
        textAlign={textAlign}
        showDollars
      />
    </Grid>
  </Grid>
)

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
        <Typography variant="paragraphMedium">{title}</Typography>
        <Typography variant="caption">{subTitle}</Typography>
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
      <Typography variant="paragraphMedium" whiteSpace="nowrap">
        {numbro(balance).format('$0.00a').slice(1)}
      </Typography>
    </Grid>
    <Grid item>
      <Typography variant="caption" whiteSpace="nowrap">
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

export const BigNumberWithTooltip: React.FC<BigNumberWithTooltipProps> = ({
  value,
  decimals,
  showDollars,
  color,
  textAlign = 'left',
}) => {
  const decimalValue = convertBigNumberToDecimal(value, decimals)
  const positionRef = useRef<{ x: number; y: number }>({
    x: 0,
    y: 0,
  })
  const popperRef = useRef<Instance>(null)
  const areaRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (event: React.MouseEvent) => {
    positionRef.current = { x: event.clientX, y: event.clientY }

    if (popperRef.current != null) {
      popperRef.current.update()
    }
  }

  return (
    <Tooltip
      title={bigNumberToString(
        value,
        decimals,
        decimals < TOOLTIP_DISPLAY_DECIMALS
          ? decimals
          : TOOLTIP_DISPLAY_DECIMALS,
      )}
      placement="top"
      arrow
      PopperProps={{
        popperRef,
        anchorEl: {
          getBoundingClientRect: () => {
            return new DOMRect(
              positionRef.current.x,
              areaRef.current!.getBoundingClientRect().y,
              0,
              0,
            )
          },
        },
      }}
    >
      <Typography
        variant="paragraphMedium"
        ref={areaRef}
        onMouseMove={handleMouseMove}
        color={color}
        textAlign={textAlign}
      >
        {numbro(decimalValue || '0').format(showDollars ? '$0.00a' : '0.00a')}
      </Typography>
    </Tooltip>
  )
}

export const bigNumberPercentage = (
  value: BigNumber,
  decimals: number = PERCENTAGE_DECIMAL,
): string => {
  const result = convertBigNumberToDecimal(value, decimals)

  return `${truncateDecimals(result, 2)}%`
}
