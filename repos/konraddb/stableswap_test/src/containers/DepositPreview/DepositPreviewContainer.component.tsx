import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Button, getTokenIconComponent } from '@hadouken-project/ui'
import { Box, Divider, Skeleton, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { crossChainDepositSelectors } from '@store/crossChainDeposit/crossChainDeposit.selector'
import { crossChainDepositActions } from '@store/crossChainDeposit/crossChainDeposit.slice'
import { depositSelectors } from '@store/deposit/deposit.selector'
import { depositActions } from '@store/deposit/deposit.slice'
import { khalaTokenSelectors } from '@store/khala/tokens/tokens.selector'
import { pricesSelector } from '@store/prices/prices.selector'
import { StoreDispatch } from '@store/store.types'
import { tokenSelectors } from '@store/tokens/tokens.selector'
import { BigDecimal } from '@utils/math'

import { messages } from './DepositPreviewContainer.messages'

const DepositPreviewContainer: React.FC<{
  crossChain: boolean
  onClose?: () => void
}> = ({ crossChain, onClose }) => {
  const dispatch = useDispatch<StoreDispatch>()

  const deposit = useSelector(depositSelectors.deposit)
  const isFetching = useSelector(depositSelectors.depositLoading)

  const crossChainDeposit = useSelector(crossChainDepositSelectors.deposit)
  const crossChainIsFetching = useSelector(
    crossChainDepositSelectors.depositLoading,
  )
  const selectTokensByIds = useSelector(tokenSelectors.selectMany)
  const selectPricesByIds = useSelector(pricesSelector.selectManyByIds)
  const getFullTokensDetails = useSelector(
    khalaTokenSelectors.getFullTokensDetails,
  )

  const depositTokens = crossChain
    ? getFullTokensDetails(crossChainDeposit?.inTokens)
    : deposit?.inTokens && selectTokensByIds(deposit.inTokens)

  const isFetchingCombined = isFetching || crossChainIsFetching
  const prices =
    crossChain && depositTokens
      ? selectPricesByIds(depositTokens.map((i) => i.address))
      : deposit?.inTokens && selectPricesByIds(deposit?.inTokens)
  const depositTokensAmounts = crossChain
    ? crossChainDeposit?.inTokensAmounts
    : deposit?.inTokensAmounts
  const depositTokensAmountsUSD = depositTokensAmounts?.map((amount, index) => {
    const price = prices[index]?.price ?? BigDecimal.from(0)
    const amountUSD = amount.mul(price)

    return amountUSD
  })

  const totalDepositValueUSD =
    depositTokensAmountsUSD?.reduce(
      (totalDepositValueUSD, amount) => totalDepositValueUSD.add(amount),
      BigDecimal.from(0),
    ) ?? BigDecimal.from(0)

  const onDeposit = () => {
    if (crossChain) {
      dispatch(crossChainDepositActions.depositRequest())
    } else {
      dispatch(depositActions.depositRequest())
    }
  }

  return (
    <Box>
      <Box display="flex" flexDirection="column" gap={0.25} py={3}>
        {isFetchingCombined && (
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
        {!isFetchingCombined &&
          depositTokens?.map((depositToken, index) => {
            const Icon = getTokenIconComponent(depositToken.symbol)

            const depositAmount = depositTokensAmounts[index]
            const depositAmountUSD = depositTokensAmountsUSD[index]
            const depositAmountPercentage = depositAmountUSD
              ?.div(totalDepositValueUSD)
              .mul(BigDecimal.from(100, 0))

            return (
              <Box
                key={depositToken.id}
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
                    {`${depositAmount?.toString()} ${depositToken.symbol.toUpperCase()}`}
                  </Typography>
                </Box>
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="flex-end"
                >
                  <Typography variant="paragraphSmall" textAlign="end">
                    ${depositAmountUSD?.toFixed(2)}
                  </Typography>
                  <Typography
                    variant="paragraphTiny"
                    textAlign="end"
                    color={(theme) => alpha(theme.palette.text.primary, 0.7)}
                  >
                    {depositAmountPercentage?.toFixed(2)}%
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
          } $${totalDepositValueUSD.toFixed(2)}`}</Typography>
        </Box>
      </Box>
      {crossChain && (
        <Box display="flex" justifyContent="space-between">
          <Box display="flex" alignItems="center">
            <Typography variant="paragraphSmall">
              You receive: {crossChainDeposit?.outTokenAmounts?.toString()} LPT
            </Typography>
          </Box>
        </Box>
      )}
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
        />
      </Box>
    </Box>
  )
}

export default DepositPreviewContainer
