import React, { useCallback } from 'react'

import MaxAmountSelector from '@components/MaxAmountSelector'
import TokenButton from '@components/buttons/TokenButton'
import BigNumberInput from '@components/inputs/BigNumberInput'
import { Divider, Paper } from '@mui/material'
import Box from '@mui/material/Box'
import { formatTokenSymbol } from '@utils/tokens'

import { ITokenInputProps } from './TokenInput.types'

const TokenInput: React.FC<ITokenInputProps> = (props) => {
  const {
    token,
    tokens,
    disabled,
    amount,
    maxAmount,
    isFetchingMaxAmount,
    error,
    onAmountChange,
    onMaxRequest,
    bottomText,
    onButtonClick,
    usdAmount,
    customTokenSymbol,
    onSliderChange,
    topLabel,
    isSlider = false,
    isStkToken = false,
    fromSelector = false,
    hideTokenButton = false,
    hideMaxButton = false,
  } = props

  const onMaxClick = useCallback(() => {
    if (token) {
      onMaxRequest?.(token.address)
    }
  }, [onMaxRequest, token])

  return (
    <>
      <Paper
        elevation={3}
        sx={
          maxAmount || maxAmount === 0n
            ? { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }
            : undefined
        }
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexDirection={{ md: 'row', xs: 'column' }}
          padding={2}
        >
          <BigNumberInput
            loading={!token}
            error={error}
            decimals={token?.decimals}
            disabled={disabled}
            onChange={onAmountChange}
            value={amount}
            usdAmount={usdAmount}
            topLabel={topLabel}
          />
          {!hideTokenButton && (
            <TokenButton
              select={tokens && tokens.length > 1}
              disabled={!token || (tokens && tokens.length <= 1)}
              symbol={customTokenSymbol || formatTokenSymbol(token?.symbol)}
              onClick={onButtonClick}
              isStkToken={isStkToken}
              sx={{ pr: fromSelector ? 0.5 : 2 }}
            />
          )}
        </Box>
      </Paper>

      {(maxAmount || maxAmount === 0n) && !disabled && (
        <Paper
          elevation={3}
          sx={{ mt: '1px', borderTopRightRadius: 0, borderTopLeftRadius: 0 }}
        >
          <Box p={2} pt={0}>
            <Divider sx={{ borderStyle: 'dashed' }} />
            <MaxAmountSelector
              onMaxClick={onMaxClick}
              maxAmount={maxAmount}
              decimals={token?.decimals}
              isFetchingMaxAmount={isFetchingMaxAmount}
              bottomText={bottomText}
              symbol={customTokenSymbol || formatTokenSymbol(token?.symbol)}
              onSliderChange={onSliderChange}
              isSlider={isSlider}
              hideMaxButton={hideMaxButton}
            />
          </Box>
        </Paper>
      )}
    </>
  )
}

export default TokenInput
