import React from 'react'

import { SwapRight } from '@components/icons'
import { Box, Paper, Typography } from '@mui/material'
import { formatPercentValue, formatWithCommas } from '@utils/text'

import { IBorrowSummaryBoxProps } from './BorrowSummaryBox.types'

const BorrowSummaryBox: React.FC<IBorrowSummaryBoxProps> = (props) => {
  const {
    loan,
    newLoan,
    totalDebt,
    newTotalDebt,
    liquidationPrice,
    newLiquidationPrice,
    fee,
    decimals,
  } = props

  return (
    <Paper sx={{ p: 2 }}>
      <Box display="flex" justifyContent="space-between">
        <Typography variant="body2">Loan to value</Typography>
        <Box display="flex" alignItems="center">
          <Typography variant="body2">
            {loan ? `${formatPercentValue(loan, decimals)}%` : '-'}
          </Typography>
          {newLoan && (
            <>
              <SwapRight style={{ width: 16, height: 16 }} />
              <Typography variant="body2">
                {formatPercentValue(newLoan, decimals)}%
              </Typography>
            </>
          )}
        </Box>
      </Box>
      <Box display="flex" justifyContent="space-between">
        <Typography variant="body2">Total debt</Typography>
        <Box display="flex" alignItems="center">
          <Typography variant="body2">
            {totalDebt ? `${formatWithCommas(totalDebt, decimals)} KAI` : '-'}
          </Typography>
          {newTotalDebt && (
            <>
              <SwapRight style={{ width: 16, height: 16 }} />
              <Typography variant="body2">
                {formatWithCommas(newTotalDebt, decimals)} KAI
              </Typography>
            </>
          )}
        </Box>
      </Box>
      <Box display="flex" justifyContent="space-between">
        <Typography variant="body2">Liquidation price</Typography>
        <Box display="flex" alignItems="center">
          <Typography variant="body2">
            {liquidationPrice
              ? `$${formatWithCommas(liquidationPrice, decimals)}`
              : '-'}
          </Typography>
          {newLiquidationPrice && (
            <>
              <SwapRight style={{ width: 16, height: 16 }} />
              <Typography variant="body2">
                ${formatWithCommas(newLiquidationPrice, decimals)}
              </Typography>
            </>
          )}
        </Box>
      </Box>
      <Box display="flex" justifyContent="space-between">
        <Typography variant="body2">Fee</Typography>
        <Typography variant="body2">
          {fee ? `$${formatWithCommas(fee, decimals)}` : '-'}
        </Typography>
      </Box>
    </Paper>
  )
}

export default BorrowSummaryBox
