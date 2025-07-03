import React from 'react'

import TokenSelectorPopover from '@components/selectors/TokenSelectorPopover'

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
  usdAmount,
  maxAmount,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)
  const open = Boolean(anchorEl)

  const handleClickOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleTokenChange: ITokenSelectorInputProps['onTokenChange'] = (
    token,
  ) => {
    onTokenChange?.(token)
    onAmountChange?.(undefined)
  }

  const handleChange = (value: bigint) => {
    onAmountChange?.(value)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <>
      {tokens.length > 1 && (
        <TokenSelectorPopover
          open={open}
          handleClose={handleClose}
          tokens={tokens}
          handleTokenSelect={handleTokenChange}
          selectedTokenId={selectedToken?.id}
          anchorEl={anchorEl}
        />
      )}

      <TokenInput
        disabled={disabled}
        token={selectedToken}
        tokens={tokens}
        amount={amount}
        onAmountChange={onAmountChange}
        maxAmount={maxAmount}
        error={error}
        onMaxRequest={() => maxAmount && handleChange(maxAmount)}
        onButtonClick={handleClickOpen}
        usdAmount={usdAmount}
        fromSelector
      />
    </>
  )
}

export default TokenSelectorInput
