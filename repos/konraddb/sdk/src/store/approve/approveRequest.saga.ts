import { call, select } from 'typed-redux-saga'

import { IApprovalToken } from './approve.types'
import { providerSelector } from '../provider/provider.selector'
import { contractsSelectors } from '../contracts/contracts.selectors'
import { Confirmations, TxParams } from '../../constants/TxParams'

export function* approveRequestSaga(tokens: IApprovalToken[]): Generator {
  try {
    const userAddress = yield* select(providerSelector.userAddress)
    if (!userAddress) throw new Error('userAddress not found')

    const tokenConnector = yield* select(
      contractsSelectors.crossChainTokenConnector,
    )

    for (let i = 0; i < tokens.length; ++i) {
      const token = tokens[i]

      const erc20Contract = tokenConnector
        ? yield* call(tokenConnector, token.address)
        : null

      if (!erc20Contract) throw Error('Token contract not found')

      const approveTransaction = yield* call(
        erc20Contract.approve,
        token.spender,
        token.amount,
        TxParams,
      )

      const transactionReceipt = yield* call(
        approveTransaction.wait,
        Confirmations,
      )

      if (transactionReceipt.status !== 1) {
        throw new Error(
          `Transaction has probably failed. Status is different than 1`,
        )
      }

      return approveTransaction
    }
  } catch (error) {
    console.error(error)
    throw new Error('Approve transaction has failed')
  }
}
