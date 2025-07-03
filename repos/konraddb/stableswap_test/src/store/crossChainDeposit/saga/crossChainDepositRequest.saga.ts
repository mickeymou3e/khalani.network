import { apply, call, select } from 'typed-redux-saga'

import { CONFIRMATIONS } from '@constants/Networks'
import { ContractTransaction } from '@ethersproject/contracts'
import { StrictEffect } from '@redux-saga/types'
import { contractsSelectors } from '@store/contracts/contracts.selectors'
import { khalaTokenSelectors } from '@store/khala/tokens/tokens.selector'
import { poolSelectors } from '@store/pool/selectors/pool.selector'
import { servicesSelectors } from '@store/services/services.selector'
import { walletSelectors } from '@store/wallet/wallet.selector'

import { crossChainDepositSelectors } from '../crossChainDeposit.selector'
import { ICrossChainDeposit } from '../crossChainDeposit.types'

export function* crossChainDepositRequestSaga(
  deposit: ICrossChainDeposit,
): Generator<StrictEffect, ContractTransaction> {
  const userAddress = yield* select(walletSelectors.userAddress)
  if (!userAddress) throw Error('userAddress not found')
  const selectPoolById = yield* select(poolSelectors.selectById)
  const getRespectiveKhalaTokensWithChainId = yield* select(
    khalaTokenSelectors.getFullTokensDetails,
  )
  const poolServiceProvider = yield* select(
    servicesSelectors.crossChainComposableStablePoolServiceProvider,
  )

  const inTokens = getRespectiveKhalaTokensWithChainId(deposit.inTokens)
  const inTokensAmounts = deposit.inTokensAmounts

  const pool = selectPoolById(deposit.poolId)
  if (!pool) throw Error('pool not found')

  if (!poolServiceProvider) throw Error('pool service provider not found')

  const poolService = yield* apply(
    poolServiceProvider,
    poolServiceProvider.provide,
    [pool],
  )

  if (!poolService) throw Error('pool service not found')

  const depositTransaction = yield* apply(
    poolService,
    poolService.crossChainJoin,
    [
      {
        account: userAddress,
        pool: pool,
        amountsIn: inTokensAmounts.map((amount) => amount.toBigNumber()),
        tokensIn: inTokens,
      },
    ],
  )

  yield* call(depositTransaction.wait, CONFIRMATIONS)

  return depositTransaction
}

export function* crossChainDepositRequestActionHandler(): Generator {
  try {
    const deposit = yield* select(crossChainDepositSelectors.deposit)
    const connectTokenContractToAddress = yield* select(
      contractsSelectors.tokenConnector,
    )

    if (!connectTokenContractToAddress) throw Error('token selector not found')

    yield* call(crossChainDepositRequestSaga, deposit)
  } catch (error) {
    console.error(error)
  }
}
