import { StrictEffect } from 'redux-saga/effects'
import { apply, call, put, select } from 'typed-redux-saga'

import { PayloadAction } from '@reduxjs/toolkit'
import { setContractError } from '@store/contracts/setError.saga'
import { poolSelectors } from '@store/pool/selectors/pool.selector'
import { servicesSelectors } from '@store/services/services.selector'
import { tokenSelectors } from '@store/tokens/tokens.selector'
import { walletSelectors } from '@store/wallet/wallet.selector'
import { withdrawActions } from '@store/withdraw/withdraw.slice'
import { IWithdraw, IWithdrawRequest } from '@store/withdraw/withdraw.types'
import { BigDecimal } from '@utils/math'

export function* withdrawPreviewRequestSaga(
  withdrawPreviewRequest: IWithdrawRequest,
): Generator<StrictEffect, IWithdraw> {
  const userAddress = yield* select(walletSelectors.userAddress)

  if (!userAddress) throw Error('User not found')

  const poolServiceProvider = yield* select(
    servicesSelectors.poolServiceProvider,
  )

  const selectPoolById = yield* select(poolSelectors.selectById)
  const selectTokensByAddresses = yield* select(tokenSelectors.selectMany)
  const selectTokenByAddress = yield* select(tokenSelectors.selectById)

  const inToken = selectTokenByAddress(withdrawPreviewRequest.inToken)
  const inTokenAmount = withdrawPreviewRequest.inTokenAmount

  const pool = selectPoolById(withdrawPreviewRequest.poolId)

  if (!pool) throw Error('Pool not found')
  if (!inToken) throw Error('In token not found')
  if (!poolServiceProvider) throw Error('Pool Service Provider not found')

  const poolService = yield* apply(
    poolServiceProvider,
    poolServiceProvider.provide,
    [pool],
  )

  if (!poolService) throw Error('Pool service not found')

  const { amountsOut, assets } = yield* apply(
    poolService,
    poolService.queryExitTokenIn,
    [
      {
        pool,
        account: userAddress,
        amountIn: inTokenAmount.toBigNumber(),
        tokenInAddress: inToken.address,
        tokensOutAddresses: withdrawPreviewRequest.outTokens,
      },
    ],
  )

  const outTokens = selectTokensByAddresses(withdrawPreviewRequest.outTokens)
  const outTokensAmounts = amountsOut

  return {
    poolId: withdrawPreviewRequest.poolId,
    inTokenAmount,
    inToken: inToken.address,
    outTokensAmounts: outTokens.map((token) => {
      const assetIndex = assets.findIndex(
        (assetAddress) => assetAddress === token.address,
      )
      const outTokenAmount = outTokensAmounts[assetIndex]

      return BigDecimal.from(outTokenAmount, token.decimals)
    }),
    outTokens: outTokens.map(({ address }) => address),
    type: withdrawPreviewRequest.type,
    slippage: withdrawPreviewRequest.slippage,
  }
}

export function* withdrawPreviewRequestActionHandler(
  action: PayloadAction<IWithdrawRequest>,
) {
  const withdrawPreviewRequest = action.payload

  try {
    const withdrawPreview = yield* call(
      withdrawPreviewRequestSaga,
      withdrawPreviewRequest,
    )

    yield* put(withdrawActions.withdrawPreviewRequestSuccess(withdrawPreview))
  } catch (error) {
    console.error(error)

    yield* put(withdrawActions.withdrawPreviewRequestError(error))
    yield* call(setContractError, error)
  }
}
