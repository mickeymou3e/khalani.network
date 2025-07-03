import React, { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import TokensPreview from '@components/TokensPreview'
import { Button } from '@hadouken-project/ui'
import { Box, Divider, Skeleton, Typography } from '@mui/material'
import { depositSelectors } from '@store/deposit/deposit.selector'
import { depositActions } from '@store/deposit/deposit.slice'
import { pricesSelector } from '@store/prices/prices.selector'
import { StoreDispatch } from '@store/store.types'
import { BigDecimal } from '@utils/math'
import { sortAssetsByBusinessOrder } from '@utils/token'

import { messages } from './DepositPreviewContainer.messages'

const DepositPreviewContainer: React.FC<{
  onClose?: () => void
}> = ({ onClose }) => {
  const dispatch = useDispatch<StoreDispatch>()
  const selectPricesByIds = useSelector(pricesSelector.selectManyByIds)
  const depositEditor = useSelector(depositSelectors.depositEditor)
  const depositTokens = useSelector(depositSelectors.depositTokens)
  const isFetching = useSelector(depositSelectors.depositLoading)
  const isDepositInProgress = useSelector(depositSelectors.depositInProgress)

  const prices = selectPricesByIds(depositTokens.map((token) => token.address))
  const totalDepositValueUSD = depositEditor.totalDepositValueUSD

  const onDeposit = () => {
    dispatch(depositActions.depositRequest())
  }

  const previewTokens = useMemo(() => {
    if (isFetching) return []

    return depositTokens
      ?.map((token) => {
        const depositAmount = token.amount
          ? BigDecimal.from(token.amount, token.decimals)
          : BigDecimal.from(0, token.decimals)

        const price = prices.find((price) => price?.id === token.address) ?? {
          id: token.address,
          price: BigDecimal.from(0),
        }
        const depositAmountUSD = depositAmount.mul(price.price)

        const depositAmountPercentage = depositAmountUSD
          .div(totalDepositValueUSD)
          .mul(BigDecimal.from(100, 0))

        return {
          id: token.id,
          symbol: token.symbol,
          amount: depositAmount,
          displayName: token.displayName,
          amountUSD: depositAmountUSD,
          percentage: depositAmountPercentage,
          source: token.source,
        }
      })
      ?.filter((token) => token.amount.gt(BigDecimal.from(0)))
      .sort((tokenA, tokenB) =>
        sortAssetsByBusinessOrder(tokenA.symbol, tokenB.symbol),
      )
  }, [isFetching, depositTokens, totalDepositValueUSD, prices])

  return (
    <Box>
      <Box display="flex" flexDirection="column" gap={0.25} py={3}>
        {isFetching && (
          <Box>
            <Skeleton
              variant="rectangular"
              sx={{ p: 0, minWidth: 320 }}
              height={72}
            />
            <Skeleton
              variant="rectangular"
              sx={{ mt: 0.25, minWidth: 320 }}
              height={72}
            />
          </Box>
        )}
        {!isFetching && previewTokens && (
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
          } $${totalDepositValueUSD.toFixed(2)}`}</Typography>
        </Box>
      </Box>
      <Divider />
      <Box display="flex" gap={1} width="100%">
        <Button
          fullWidth
          variant="outlined"
          text={messages.CANCEL_BUTTON}
          onClick={() => onClose?.()}
        />
        <Button
          fullWidth
          variant="contained"
          text={messages.DEPOSIT_BUTTON}
          onClick={onDeposit}
          isFetching={isDepositInProgress}
        />
      </Box>
    </Box>
  )
}

export default DepositPreviewContainer
