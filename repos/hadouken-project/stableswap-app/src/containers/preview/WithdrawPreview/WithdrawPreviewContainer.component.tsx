import React, { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import TokensPreview from '@components/TokensPreview'
import { Button } from '@hadouken-project/ui'
import { Box, Divider, Typography } from '@mui/material'
import { pricesSelector } from '@store/prices/prices.selector'
import { StoreDispatch } from '@store/store.types'
import { tokenSelectors } from '@store/tokens/tokens.selector'
import { withdrawSelectors } from '@store/withdraw/withdraw.selector'
import { withdrawActions } from '@store/withdraw/withdraw.slice'
import { BigDecimal } from '@utils/math'
import { sortAssetsByBusinessOrder } from '@utils/token'

import { messages } from './WithdrawPreviewContainer.messages'

const WithdrawPreviewContainer: React.FC<{
  onClose?: () => void
}> = ({ onClose }) => {
  const dispatch = useDispatch<StoreDispatch>()

  const withdraw = useSelector(withdrawSelectors.withdraw)
  const isFetching = useSelector(withdrawSelectors.withdrawLoading)
  const selectTokensByIds = useSelector(tokenSelectors.selectMany)
  const selectPricesByIds = useSelector(pricesSelector.selectManyByIds)
  const isWithdrawInProgress = useSelector(withdrawSelectors.withdrawInProgress)

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

  const previewTokens = useMemo(() => {
    if (isFetching) return []

    return withdrawTokens

      ?.map((token, index) => {
        const withdrawAmount = withdrawTokensAmounts[index]
        const withdrawAmountUSD = withdrawTokensAmountsUSD[index]
        const withdrawAmountPercentage = withdrawAmountUSD
          .div(totalWithdrawValueUSD)
          .mul(BigDecimal.from(100, 0))

        return {
          id: token.id,
          symbol: token.symbol,
          amount: withdrawAmount,
          displayName: token.displayName,
          amountUSD: withdrawAmountUSD,
          percentage: withdrawAmountPercentage,
          source: token.source,
        }
      })
      .sort((tokenA, tokenB) =>
        sortAssetsByBusinessOrder(tokenA.symbol, tokenB.symbol),
      )
      .filter((token) => token.amount.gt(BigDecimal.from(0)))
  }, [
    withdrawTokens,
    withdrawTokensAmounts,
    withdrawTokensAmountsUSD,
    totalWithdrawValueUSD,
    isFetching,
  ])

  return (
    <Box>
      <Box display="flex" flexDirection="column" gap={0.25} py={3}>
        {!isFetching && withdrawTokens && (
          <TokensPreview tokens={previewTokens} />
        )}
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
          isFetching={isWithdrawInProgress}
        />
      </Box>
    </Box>
  )
}

export default WithdrawPreviewContainer
