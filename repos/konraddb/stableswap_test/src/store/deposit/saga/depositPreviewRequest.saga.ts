import { StrictEffect } from 'redux-saga/effects'
import { apply, call, put, select } from 'typed-redux-saga'

import { PayloadAction } from '@reduxjs/toolkit'
import { setContractError } from '@store/contracts/setError.saga'
import { depositActions } from '@store/deposit/deposit.slice'
import { poolSelectors } from '@store/pool/selectors/pool.selector'
import { servicesSelectors } from '@store/services/services.selector'
import { tokenSelectors } from '@store/tokens/tokens.selector'
import { walletSelectors } from '@store/wallet/wallet.selector'
import { BigDecimal } from '@utils/math'

import { IDeposit, IDepositRequest } from '../deposit.types'

export function* depositPreviewRequestSaga(
  depositPreviewRequest: IDepositRequest,
): Generator<StrictEffect, IDeposit | null> {
  const userAddress = yield* select(walletSelectors.userAddress)
  if (!userAddress) throw Error('User address not found')

  const poolServiceProvider = yield* select(
    servicesSelectors.poolServiceProvider,
  )

  const selectPoolById = yield* select(poolSelectors.selectById)
  const selectTokensByAddresses = yield* select(tokenSelectors.selectMany)
  const selectTokenByAddress = yield* select(tokenSelectors.selectById)

  const inTokens = selectTokensByAddresses(depositPreviewRequest.inTokens)
  const inTokensAmounts = depositPreviewRequest.inTokensAmounts

  const pool = selectPoolById(depositPreviewRequest.poolId)
  if (!pool) throw Error('Pool not found')
  const poolToken = selectTokenByAddress?.(pool.address)

  if (!poolServiceProvider) throw Error('poolServiceProvider not found')

  const poolService = yield* apply(
    poolServiceProvider,
    poolServiceProvider.provide,
    [pool],
  )

  if (poolService && poolToken) {
    const { amountOut } = yield* apply(poolService, poolService.queryJoin, [
      {
        account: userAddress,
        pool: pool,
        amountsIn: inTokensAmounts.map((amount) => amount.toBigNumber()),
        tokensIn: inTokens,
      },
    ])

    return {
      poolId: depositPreviewRequest.poolId,
      inTokensAmounts,
      inTokens: inTokens.map(({ address }) => address),
      outTokenAmounts: BigDecimal.from(amountOut, poolToken.decimals),
      outToken: poolToken.address,
      slippage: depositPreviewRequest.slippage,
    }
  }

  return null
}

export function* depositPreviewRequestActionHandler(
  action: PayloadAction<IDepositRequest>,
) {
  const swapPreviewRequest = action.payload

  try {
    const depositPreview = yield* call(
      depositPreviewRequestSaga,
      swapPreviewRequest,
    )

    if (!depositPreview) throw Error('deposit preview is null')
    yield* put(depositActions.depositPreviewRequestSuccess(depositPreview))
  } catch (error) {
    console.error(error)
    // TODO: Error handling refine
    yield* put(depositActions.depositPreviewRequestError(error))
    yield* call(setContractError, error)
  }
}
