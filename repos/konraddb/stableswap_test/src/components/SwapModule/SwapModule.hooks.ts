import { useEffect, useState } from 'react'

import { BigNumber } from 'ethers'

import { convertIntegerDecimalToDecimal, truncateDecimals } from '@utils/string'

export const useQuotePrice = ({
  baseTokenDecimals,
  baseTokenValue,
  quoteTokenDecimals,
  quoteTokenValue,
  precision,
}: {
  baseTokenValue: BigNumber
  baseTokenDecimals: number
  quoteTokenValue: BigNumber
  quoteTokenDecimals: number
  precision: number
}): {
  quotePrice: string | null
} => {
  const [quotePrice, setQuotePrice] = useState<string | null>(null)

  useEffect(() => {
    if (
      quoteTokenValue &&
      quoteTokenValue.gt(0) &&
      baseTokenValue &&
      baseTokenValue.gt(0)
    ) {
      const calculatedQuotePrice = quoteTokenValue
        .mul(BigNumber.from(10).pow(precision))
        .mul(BigNumber.from(10).pow(baseTokenDecimals))
        .div(baseTokenValue)
        .div(BigNumber.from(10).pow(quoteTokenDecimals))

      const quotePriceFormatted = truncateDecimals(
        convertIntegerDecimalToDecimal(calculatedQuotePrice, precision),
        precision,
      )

      setQuotePrice(quotePriceFormatted)
    } else {
      setQuotePrice(null)
    }
  }, [baseTokenValue, precision, quoteTokenValue])

  return { quotePrice }
}
