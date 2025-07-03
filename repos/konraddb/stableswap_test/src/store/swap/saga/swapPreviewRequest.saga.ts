import { BigNumber } from 'ethers'
import { StrictEffect } from 'redux-saga/effects'
import { apply, call, put, select } from 'typed-redux-saga'

import { PayloadAction } from '@reduxjs/toolkit'
import { setContractError } from '@store/contracts/setError.saga'
import { servicesSelectors } from '@store/services/services.selector'
import { swapActions } from '@store/swap/swap.slice'
import { tokenSelectors } from '@store/tokens/tokens.selector'
import { walletSelectors } from '@store/wallet/wallet.selector'
import { BigDecimal } from '@utils/math'

import { SwapToken, SwapTokenType } from '../../../services/trade/types'
import { ISwap, ISwapRequest } from '../swap.types'

export function* swapPreviewRequestSaga(
  swapPreviewRequest: ISwapRequest,
): Generator<StrictEffect, ISwap> {
  const userAddress = yield* select(walletSelectors.userAddress)
  if (!userAddress) throw Error('User not found')
  const tradeService = yield* select(servicesSelectors.tradeService)
  if (!tradeService) throw Error('tradeService not found')
  const selectTokenByAddress = yield* select(tokenSelectors.selectById)

  const inToken = selectTokenByAddress(swapPreviewRequest.inToken)
  const outToken = selectTokenByAddress(swapPreviewRequest.outToken)

  if (!inToken) throw Error('inToken not found')
  if (!outToken) throw Error('outToken not found')

  const {
    amount: outTokenAmount,
    swapKind,
    swaps,
    fee,
    tokensAddresses,
    limits,
    funds,
  } = yield* apply(tradeService, tradeService.previewSwap, [
    userAddress,
    {
      token: inToken.address,
      amount: swapPreviewRequest.inTokenAmount.toBigNumber(),
      type: SwapTokenType.max,
    } as SwapToken,
    inToken.decimals,
    {
      token: outToken.address,
      amount: BigNumber.from(0),
      type: SwapTokenType.min,
    } as SwapToken,
    outToken.decimals,
    swapPreviewRequest.inTokenAmount.toBigNumber(),
  ])

  const swap: ISwap = {
    sorSwaps: swaps,
    sorTokens: tokensAddresses,
    inToken: inToken.address,
    inTokenAmount: swapPreviewRequest.inTokenAmount,
    outToken: outToken.address,
    outTokenAmount: BigDecimal.from(outTokenAmount, outToken.decimals),
    fee: BigDecimal.from(fee, 2),
    slippage: swapPreviewRequest.slippage,
    swapKind,
    limits,
    funds,
  }

  return swap
}

export function* swapPreviewRequestActionHandler(
  action: PayloadAction<ISwapRequest>,
) {
  const swapPreviewRequest = action.payload

  try {
    const swapPreview = yield* call(swapPreviewRequestSaga, swapPreviewRequest)

    yield* put(swapActions.swapPreviewRequestSuccess(swapPreview))
  } catch (error) {
    console.error(error)
    // TODO: Error handling refine
    yield* put(swapActions.swapPreviewRequestError(error))
    yield* call(setContractError, error)
  }
}
