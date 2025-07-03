import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Button, getTokenIconComponent } from '@hadouken-project/ui'
import { Box, Divider, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { pricesSelector } from '@store/prices/prices.selector'
import { StoreDispatch } from '@store/store.types'
import { tokenSelectors } from '@store/tokens/tokens.selector'
import { withdrawSelectors } from '@store/withdraw/withdraw.selector'
import { withdrawActions } from '@store/withdraw/withdraw.slice'
import { BigDecimal } from '@utils/math'

import { messages } from './WithdrawPreviewContainer.messages'

const WithdrawPreviewContainer: React.FC<{
  onClose?: () => void
}> = ({ onClose }) => {
  const dispatch = useDispatch<StoreDispatch>()

  const withdraw = useSelector(withdrawSelectors.withdraw)
  const selectTokensByIds = useSelector(tokenSelectors.selectMany)
  const selectPricesByIds = useSelector(pricesSelector.selectManyByIds)

  const withdrawTokens =
    withdraw?.outTokens && selectTokensByIds(withdraw.outTokens)
  const prices = withdraw?.outTokens && selectPricesByIds(withdraw?.outTokens)
  const withdrawTokensAmounts = withdraw?.outTokensAmounts

  const withdrawTokensAmountsUSD = withdrawTokensAmounts?.map(
    (amount, index) => {
      const price = prices[index]?.price
      const amountUSD = price
        ? amount.mul(price)
        : amount.mul(BigDecimal.from(0))

      return amountUSD
    },
  )

  const totalWithdrawValueUSD =
    withdrawTokensAmountsUSD?.reduce(
      (totalWithdrawValueUSD, amount) => totalWithdrawValueUSD.add(amount),
      BigDecimal.from(0),
    ) ?? BigDecimal.from(0)

  const onWithdraw = () => {
    dispatch(withdrawActions.withdrawRequest())
  }

  return (
    <Box>
      <Box display="flex" flexDirection="column" gap={0.25} py={3}>
        {withdrawTokens?.map((withdrawToken, index) => {
          const Icon = getTokenIconComponent(withdrawToken.symbol)

          const withdrawAmount = withdrawTokensAmounts[index]
          const withdrawAmountUSD = withdrawTokensAmountsUSD[index]
          const withdrawAmountPercentage = withdrawAmountUSD
            .div(totalWithdrawValueUSD)
            .mul(BigDecimal.from(100, 0))

          return (
            <Box
              key={withdrawToken.id}
              display="flex"
              justifyContent="space-between"
              p={2}
              bgcolor={(theme) => theme.palette.background.default}
              minWidth={(theme) => theme.spacing(40)}
              gap={2}
            >
              <Box display="flex" alignItems="center" gap={2}>
                <Icon width={40} height={40} />
                <Typography variant="paragraphBig">
                  {`${withdrawAmount.toString()} ${withdrawToken.symbol.toUpperCase()}`}
                </Typography>
              </Box>
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="flex-end"
              >
                <Typography variant="paragraphSmall" textAlign="end">
                  ${withdrawAmountUSD.toFixed(2)}
                </Typography>
                <Typography
                  variant="paragraphTiny"
                  textAlign="end"
                  color={(theme) => alpha(theme.palette.text.primary, 0.7)}
                >
                  {withdrawAmountPercentage.toFixed(2)}%
                </Typography>
              </Box>
            </Box>
          )
        })}
      </Box>
      <Box display="flex" justifyContent="space-between">
        <Box display="flex" alignItems="center">
          <Typography variant="h4Bold">{messages.SUMMARY_LABEL}</Typography>
        </Box>
        <Box display="flex" flexDirection="column" justifyContent="flex-end">
          <Typography variant="h5">{`${
            messages.TOTAL_LABEL
          } $${totalWithdrawValueUSD.toFixed(2)}`}</Typography>
        </Box>
      </Box>
      <Divider />
      <Box display="flex" gap={1} width="100%">
        <Button
          fullWidth
          variant="outlined"
          text={messages.CANCEL_BUTTON}
          onClick={() => {
            onClose?.()
          }}
        />
        <Button
          fullWidth
          variant="contained"
          text={messages.ACTION_BUTTON}
          onClick={onWithdraw}
        />
      </Box>
    </Box>
  )
}

export default WithdrawPreviewContainer
