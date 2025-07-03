import { all, call, put, select } from 'typed-redux-saga'

import { getChainConfig } from '@config'
import { waitForSubgraphToBeUpToDate } from '@dataSource/graph/subgraph'
import { address } from '@dataSource/graph/utils/formatters'
import { ActionInProgress } from '@interfaces/action'
import { contractsSelectors } from '@store/contracts/contracts.selectors'
import { contractsActions } from '@store/contracts/contracts.slice'
import { setContractError } from '@store/contracts/setError.saga'
import { operationWrapper } from '@store/history/operationWrapper.saga'
import { createDepositLockdropPlan } from '@store/history/plans/lockdrop/createDepositPlan'
import { lockdropSelectors } from '@store/lockDrop/lockDrop.selector'
import { lockDropActions } from '@store/lockDrop/lockDrop.slice'
import { networkSelectors } from '@store/network/network.selector'
import { approveToken } from '@store/tokens/approve/approve.saga'
import { walletSelectors } from '@store/wallet/wallet.selector'
import { BigDecimal } from '@utils/math'
import { config } from '@utils/network'

import { phaseTwoDeposit } from './phaseTwoDeposit.saga'

export function* phaseTwoDepositRequest(): Generator {
  try {
    const lockdropContract = yield* select(contractsSelectors.lockDropConnector)
    const userAddress = yield* select(walletSelectors.userAddress)
    const depositTokens = yield* select(lockdropSelectors.phaseTwoDepositTokens)
    const depositTokensAmounts = yield* select(
      lockdropSelectors.phaseTwoDepositTokensAmounts,
    )
    const connectTokenContractToAddress = yield* select(
      contractsSelectors.tokenConnector,
    )
    const chainId = yield* select(networkSelectors.applicationChainId)

    const chainConfig = getChainConfig(chainId)
    const lockdropConfigTokens = config.lockDropTokens[chainId]

    if (!lockdropContract) throw new Error('Lockdrop not defined')
    if (!userAddress) throw new Error('User not defined')

    const {
      transactionId,
      amountsToApprove,
      tokensToApprove,
      operationIds,
    } = yield* call(
      createDepositLockdropPlan,
      lockdropContract.address,
      userAddress,
      depositTokens,
      depositTokensAmounts,
    )

    const transactionsToApprove = []

    yield* put(contractsActions.setActionInProgress(ActionInProgress.Deposit))

    for (let index = 0; index < tokensToApprove.length; ++index) {
      const tokenAddressToApprove = tokensToApprove[index]
      const amountToApprove = amountsToApprove[index]
      const tokenContract = yield* call(
        connectTokenContractToAddress,
        tokenAddressToApprove,
      )
      const transactionToApprove = operationWrapper(
        transactionId,
        operationIds[index],
        call(
          approveToken,
          tokenContract,

          lockdropContract.address,
          amountToApprove,
          index,
        ),
      )
      transactionsToApprove.push(transactionToApprove)
    }
    yield* all(transactionsToApprove)

    const hdkAmount =
      depositTokensAmounts?.[address(lockdropConfigTokens.Hdk)] ??
      BigDecimal.from(0)
    const priceTokenAmount =
      depositTokensAmounts?.[address(lockdropConfigTokens.PriceToken)] ??
      BigDecimal.from(0)

    const isNativeToken = chainConfig.nativeCurrency.wrapAddress
      ? address(chainConfig.nativeCurrency.wrapAddress) ===
        address(lockdropConfigTokens.PriceToken)
      : false

    const transactionResult = yield* operationWrapper(
      transactionId,
      operationIds[operationIds.length - 1],
      call(phaseTwoDeposit, hdkAmount, priceTokenAmount, isNativeToken),
    )

    yield* put(lockDropActions.phaseTwoDepositSuccess())

    yield* put(lockDropActions.phaseTwoDepositClear())
    if (transactionResult) {
      yield* call(waitForSubgraphToBeUpToDate, transactionResult.blockNumber)

      yield* put(lockDropActions.updateLockdropDepositTokensBalancesRequest())
    }
  } catch (error) {
    yield* call(setContractError, error)

    yield* put(lockDropActions.phaseTwoDepositFailure())
  } finally {
    yield* put(contractsActions.finishActionInProgress())
  }
}
