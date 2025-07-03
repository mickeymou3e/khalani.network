import { BigNumber } from 'ethers'
import { StrictEffect } from 'redux-saga/effects'
import { apply, select } from 'typed-redux-saga'

import { networkSelectors } from '@store/network/network.selector'
import { poolSelectors } from '@store/pool/selectors/pool.selector'
import { servicesSelectors } from '@store/services/services.selector'
import { tokenSelectors } from '@store/tokens/tokens.selector'
import { walletSelectors } from '@store/wallet/wallet.selector'

import { depositSelectors } from '../deposit.selector'

export function* getMinimumLPTokensForDepositSaga(): Generator<
  StrictEffect,
  BigNumber | null
> {
  const userAddress = yield* select(walletSelectors.userAddress)
  if (!userAddress) throw Error('User address not found')

  const poolServiceProvider = yield* select(
    servicesSelectors.poolServiceProvider,
  )
  const depositEditorState = yield* select(depositSelectors.depositEditor)
  const { poolId, slippage, depositTokens } = depositEditorState

  if (!poolId) {
    throw Error('pool not found')
  }

  const allTokens = yield* select(tokenSelectors.selectAllTokens)
  const allPools = yield* select(poolSelectors.selectAll)
  const selectPoolById = yield* select(poolSelectors.selectById)

  const selectTokenByAddress = yield* select(tokenSelectors.selectById)

  const pool = selectPoolById(poolId)
  if (!pool) throw Error('Pool not found')

  const poolToken = selectTokenByAddress?.(pool.address)

  if (!poolServiceProvider) throw Error('poolServiceProvider not found')

  const poolService = yield* apply(
    poolServiceProvider,
    poolServiceProvider.provide,
    [pool],
  )

  const amountsIn = depositTokens.map(
    (token) => token.amount ?? BigNumber.from(0),
  )

  const tokensIn = depositTokens.map((token) => token.address)

  const chainId = yield* select(networkSelectors.applicationChainId)

  if (poolService && poolToken) {
    const { amountOut, error } = yield* apply(
      poolService,
      poolService.queryJoin,
      [
        {
          account: userAddress,
          pool,
          allPools,
          allTokens,
          amountsIn: amountsIn,
          tokensIn: tokensIn,
          slippage: slippage.toBigNumber(),
          chainId,
        },
      ],
    )

    if (error) {
      throw new Error(error)
    }

    return amountOut
  }

  return null
}
