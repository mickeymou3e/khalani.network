import React, { useEffect, useState } from 'react'

import { Button, ErrorBanner } from '@hadouken-project/ui'
import { convertIntegerDecimalToDecimal } from '@utils/string'

import { messages } from './SwapUnderperformanceBanner.messages'
import { ISSwapUnderperformedBannerProps } from './SwapUnderperformanceBanner.types'

const SwapUnderperformanceBanner: React.FC<ISSwapUnderperformedBannerProps> = ({
  quoteToken,
  quoteTokenValue,
  baseToken,
  baseTokenValue,
  onSwapAccept,
}) => {
  const [swapAccepted, setSwapAccepted] = useState(false)

  const handleSwapAccepted = () => {
    setSwapAccepted(true)
    onSwapAccept()
  }

  useEffect(() => {
    setSwapAccepted(false)
  }, [quoteToken, baseToken])

  return (
    <ErrorBanner
      backgroundImageUrl=""
      noFill
      text={
        messages.ERROR_MESSAGE_1 +
        messages.ERROR_MESSAGE_2 +
        `${convertIntegerDecimalToDecimal(
          baseTokenValue,
          baseToken.decimals,
        )} ${baseToken.symbol}` +
        messages.ERROR_MESSAGE_3 +
        `${convertIntegerDecimalToDecimal(
          quoteTokenValue,
          quoteToken.decimals,
        )} ${quoteToken.symbol}` +
        messages.ERROR_MESSAGE_4
      }
    >
      <Button
        variant="text"
        onClick={handleSwapAccepted}
        disabled={swapAccepted}
        text={messages.SWAP_PROCEED_BUTTON}
        sx={{ height: 'auto' }}
      />
    </ErrorBanner>
  )
}

export default SwapUnderperformanceBanner
