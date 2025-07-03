import React, { useState } from 'react'

import { BigNumber } from 'ethers'

import TokenButton from '@components/buttons/TokenButton'
import { TokenSelectorModal } from '@components/modals/TokenSelectorModal'
import { Grid } from '@mui/material'

import TokenInput from '../TokenInput'
import { ITokenSelectorInputProps } from './TokenSelectorInput.types'

const TokenSelectorInput: React.FC<ITokenSelectorInputProps> = ({
  amount,
  onTokenChange,
  onAmountChange,
  disabled,
  tokens,
  selectedToken,
  error,
  isFetching,
}) => {
  const [open, setOpen] = useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }
  const handleTokenChange: ITokenSelectorInputProps['onTokenChange'] = (
    token,
  ) => {
    onTokenChange?.(token)
    onAmountChange?.(undefined)
  }

  const handleChange = (value: BigNumber) => {
    onAmountChange?.(value)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <>
      {tokens.length > 1 && (
        <TokenSelectorModal
          open={open}
          onClose={handleClose}
          tokens={tokens}
          onTokenSelect={handleTokenChange}
          selectedToken={selectedToken}
          isFetching={isFetching}
        />
      )}
      <Grid container spacing={1}>
        <Grid item xs={12} md={4}>
          <TokenButton
            select={tokens.length > 1}
            disabled={!selectedToken || tokens.length <= 1}
            symbol={selectedToken?.symbol}
            name={selectedToken?.name}
            customIcon={selectedToken?.icon}
            onClick={handleClickOpen}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <TokenInput
            disabled={disabled}
            token={selectedToken}
            amount={amount}
            onAmountChange={onAmountChange}
            maxAmount={selectedToken?.balance}
            error={error}
            onMaxRequest={() =>
              selectedToken?.balance && handleChange(selectedToken.balance)
            }
            hideStartAdornment
          />
        </Grid>
      </Grid>
    </>
  )
}

export default TokenSelectorInput
