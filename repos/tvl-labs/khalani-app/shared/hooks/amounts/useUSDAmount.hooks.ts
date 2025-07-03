import { useMemo } from 'react'
import { useSelector } from 'react-redux'

import { IUSDAmount } from '@tvl-labs/khalani-ui'
import { pricesSelector } from '@tvl-labs/sdk'

import { getTokenUSDAmount } from '../../utils'

interface IUseUSDAmountHook {
  baseUSDAmount: IUSDAmount | undefined
  additionalUSDAmount: IUSDAmount | undefined
  thirdUSDAmount: IUSDAmount | undefined
}

export const useUSDAmount = (
  tokenId: string | undefined,
  tokenValue: bigint | undefined,
  tokenDecimals: number | undefined,
  additionalTokenId?: string,
  additionalTokenValue?: bigint,
  additionalTokenDecimals?: number,
  thirdTokenId?: string,
  thirdTokenValue?: bigint,
  thirdTokenDecimals?: number,
): IUseUSDAmountHook => {
  const selectPriceById = useSelector(pricesSelector.selectById)

  const { baseUSDAmount, additionalUSDAmount, thirdUSDAmount } = useMemo(() => {
    const baseUsdPrice = selectPriceById(tokenId?.toLowerCase() ?? '')
    const additionalUsdPrice = selectPriceById(
      additionalTokenId?.toLowerCase() ?? '',
    )
    const thirdUsdPrice = selectPriceById(thirdTokenId?.toLowerCase() ?? '')

    const baseUSDAmount = getTokenUSDAmount(
      tokenValue,
      tokenDecimals,
      baseUsdPrice,
    )

    const additionalUSDAmount = getTokenUSDAmount(
      additionalTokenValue,
      additionalTokenDecimals,
      additionalUsdPrice,
    )

    const thirdUSDAmount = getTokenUSDAmount(
      thirdTokenValue,
      thirdTokenDecimals,
      thirdUsdPrice,
    )

    return { baseUSDAmount, additionalUSDAmount, thirdUSDAmount }
  }, [
    additionalTokenId,
    additionalTokenDecimals,
    additionalTokenValue,
    selectPriceById,
    tokenId,
    tokenDecimals,
    tokenValue,
    thirdTokenId,
    thirdTokenDecimals,
    thirdTokenValue,
  ])

  return { baseUSDAmount, additionalUSDAmount, thirdUSDAmount }
}
