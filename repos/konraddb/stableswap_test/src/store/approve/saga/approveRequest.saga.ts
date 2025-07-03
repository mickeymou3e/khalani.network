import { call, put, select } from 'typed-redux-saga'

import { contractsSelectors } from '@store/contracts/contracts.selectors'
import { historyActions } from '@store/history/history.slice'
import { operationWrapper } from '@store/history/operationWrapper.saga'
import { createApprovePlan } from '@store/history/plans/pool/createApprovePlan'
import { approveToken } from '@store/tokens/approve/approve.saga'
import { walletSelectors } from '@store/wallet/wallet.selector'
import { BigDecimal } from '@utils/math'

import { approveSelectors } from '../approve.selector'
import { approveActions } from '../approve.slice'

export function* approveRequestSaga(): Generator {
  const tokens = yield* select(approveSelectors.approvalTokens)
  const { transactionId } = yield* call(createApprovePlan, tokens)

  try {
    const userAddress = yield* select(walletSelectors.userAddress)
    if (!userAddress) throw Error('userAddress not found')

    const tokenConnector = yield* select(
      contractsSelectors.crossChainTokenConnector,
    )

    for (let i = 0; i < tokens.length; ++i) {
      const token = tokens[i]

      const erc20Contract = tokenConnector
        ? yield* call(tokenConnector, token.address)
        : null

      if (!erc20Contract) throw Error('Token contract not found')

      yield* operationWrapper(
        transactionId,
        call(
          approveToken,
          erc20Contract,
          userAddress,
          BigDecimal.from(token.amount),
        ),
      )
    }

    yield* put(approveActions.approveRequestSuccess())
  } catch (error) {
    yield* put(
      historyActions.setOperationFailure({
        transactionId,
      }),
    )
    yield* put(approveActions.approveRequestError(error))
    console.error(error)
  }
}
