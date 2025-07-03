import React from 'react'

import { Box } from '@mui/material'
import SecondaryButton from '@ui/SecondaryButton'
import { BigDecimal } from '@utils/math'

import { messages } from './ProportionalSuggestion.messages'
import { IProportionalSuggestionProps } from './ProportionalSuggestion.types'

const ProportionalSuggestion: React.FC<IProportionalSuggestionProps> = (
  props,
) => {
  const {
    baseToken,
    baseTokenValue,
    depositTokens,
    setAdditionalTokenValue,
  } = props

  const handleCalculateProportional = () => {
    const foundDepositBaseToken = depositTokens?.find(
      (token) => token.symbol === baseToken?.symbol,
    )
    const foundDepositAdditionalToken = depositTokens?.find(
      (token) => token.symbol !== baseToken?.symbol,
    )

    if (foundDepositBaseToken && foundDepositAdditionalToken) {
      const proportionalValue = calculateProportional(
        BigDecimal.from(baseTokenValue),
        foundDepositBaseToken.balance,
        foundDepositAdditionalToken.balance,
      )
      setAdditionalTokenValue(proportionalValue.toBigNumber())
    }
  }

  const calculateProportional = (
    inputTokenValue: BigDecimal,
    inputTokenTotalBalance: BigDecimal,
    tokenForProportionalCalculationTotalBalance: BigDecimal,
  ): BigDecimal => {
    return inputTokenValue
      .mul(tokenForProportionalCalculationTotalBalance)
      .div(
        inputTokenTotalBalance,
        tokenForProportionalCalculationTotalBalance.decimals,
      )
  }

  return (
    <Box display="flex" pt={1} alignItems="center" textAlign="end">
      <SecondaryButton
        label={messages.LABEL}
        onClickFn={handleCalculateProportional}
      />
    </Box>
  )
}

export default ProportionalSuggestion
