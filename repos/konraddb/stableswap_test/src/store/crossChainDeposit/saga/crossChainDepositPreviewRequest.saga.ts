import { StrictEffect } from 'redux-saga/effects'
import { apply, call, put, select } from 'typed-redux-saga'

import { PayloadAction } from '@reduxjs/toolkit'
import { setContractError } from '@store/contracts/setError.saga'
import { depositActions } from '@store/deposit/deposit.slice'
import { khalaTokenSelectors } from '@store/khala/tokens/tokens.selector'
import { poolSelectors } from '@store/pool/selectors/pool.selector'
import { servicesSelectors } from '@store/services/services.selector'
import { tokenSelectors } from '@store/tokens/tokens.selector'
import { walletSelectors } from '@store/wallet/wallet.selector'
import { BigDecimal } from '@utils/math'

import { crossChainDepositActions } from '../crossChainDeposit.slice'
import {
  ICrossChainDeposit,
  ICrossChainDepositRequest,
} from '../crossChainDeposit.types'

export function* crossChainDepositPreviewRequestSaga(
  depositPreviewRequest: ICrossChainDepositRequest,
): Generator<StrictEffect, ICrossChainDeposit | null> {
  const userAddress = yield* select(walletSelectors.userAddress)
  if (!userAddress) throw Error('User address not found')

  const getRespectiveKhalaTokensWithChainId = yield* select(
    khalaTokenSelectors.getFullTokensDetails,
  )

  const poolServiceProvider = yield* select(
    servicesSelectors.crossChainComposableStablePoolServiceProvider,
  )

  const selectPoolById = yield* select(poolSelectors.selectById)
  const selectTokenByAddress = yield* select(tokenSelectors.selectById)

  const inTokens = getRespectiveKhalaTokensWithChainId(
    depositPreviewRequest.inTokens,
  )
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
    const { amountOut } = yield* apply(
      poolService,
      poolService.crossChainQueryJoin,
      [
        {
          account: userAddress,
          pool: pool,
          amountsIn: inTokensAmounts.map((amount) => amount.toBigNumber()),
          tokensIn: inTokens,
        },
      ],
    )

    return {
      poolId: depositPreviewRequest.poolId,
      inTokensAmounts,
      inTokens: depositPreviewRequest.inTokens,
      outTokenAmounts: BigDecimal.from(amountOut, poolToken.decimals),
      outToken: poolToken.address,
      slippage: depositPreviewRequest.slippage,
    }
  }

  return null
}

export function* crossChainDepositPreviewRequestActionHandler(
  action: PayloadAction<ICrossChainDepositRequest>,
) {
  const swapPreviewRequest = action.payload

  try {
    const depositPreview = yield* call(
      crossChainDepositPreviewRequestSaga,
      swapPreviewRequest,
    )

    if (!depositPreview) throw Error('deposit preview is null')

    yield* put(
      crossChainDepositActions.depositPreviewRequestSuccess(depositPreview),
    )
  } catch (error) {
    console.error(error)
    // TODO: Error handling refine
    yield* put(depositActions.depositPreviewRequestError(error))
    yield* call(setContractError, error)
  }
}
