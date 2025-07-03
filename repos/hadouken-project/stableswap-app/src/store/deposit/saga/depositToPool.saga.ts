import { BigNumber } from 'ethers'
import { apply, call, select } from 'typed-redux-saga'

import { CONFIRMATIONS } from '@constants/Networks'
import { ContractTransaction } from '@ethersproject/contracts'
import { StrictEffect } from '@redux-saga/types'
import { contractsSelectors } from '@store/contracts/contracts.selectors'
import { depositSelectors } from '@store/deposit/deposit.selector'
import { networkSelectors } from '@store/network/network.selector'
import { poolSelectors } from '@store/pool/selectors/pool.selector'
import { servicesSelectors } from '@store/services/services.selector'
import { tokenSelectors } from '@store/tokens/tokens.selector'
import { walletSelectors } from '@store/wallet/wallet.selector'

export function* depositToPoolSaga(): Generator<
  StrictEffect,
  ContractTransaction
> {
  const backstop = yield* select(contractsSelectors.backstopContracts)
  const userAddress = yield* select(walletSelectors.userAddress)
  if (!userAddress) throw Error('userAddress not found')

  const {
    poolId,
    slippage,
    depositTokens,
    minBptTokensOut,
    stakeToBackstop,
  } = yield* select(depositSelectors.depositEditor)

  if (!poolId) throw Error('poolId not found')

  const allTokens = yield* select(tokenSelectors.selectAllTokens)
  const pools = yield* select(poolSelectors.selectAll)
  const selectPoolById = yield* select(poolSelectors.selectById)

  const poolServiceProvider = yield* select(
    servicesSelectors.poolServiceProvider,
  )

  const pool = selectPoolById(poolId)
  if (!pool) throw Error('pool not found')

  if (!poolServiceProvider) throw Error('pool service provider not found')

  const poolService = yield* apply(
    poolServiceProvider,
    poolServiceProvider.provide,
    [pool],
  )

  if (!poolService) throw Error('pool service not found')

  const chainId = yield* select(networkSelectors.applicationChainId)

  const depositTransaction = yield* apply(poolService, poolService.join, [
    {
      account: userAddress,
      pool: pool,
      allPools: pools,
      allTokens,
      amountsIn: depositTokens.map(
        (token) => token.amount ?? BigNumber.from(0),
      ),
      tokensIn: depositTokens.map((token) => token.address),
      slippage: slippage.toBigNumber(),
      minBptOut: minBptTokensOut.toBigNumber(),
      chainId,
      stakeToBackstop,
      backstop: backstop?.backstop?.address ?? undefined,
    },
  ])

  yield* call(depositTransaction.wait, CONFIRMATIONS)

  return depositTransaction
}
