import { call, select, apply } from 'typed-redux-saga'

import { IApprovalToken } from './approve.types'
import { evmChainContractsSelectors } from '@store/contracts/contracts.selectors'
import { Confirmations } from '@constants/TxParams'
import { handleProviderError } from '@utils/error'
import { ContractTransactionResponse } from 'ethers-v6'

export function* approveRequestSaga(tokens: IApprovalToken[]): Generator {
  try {
    const tokenConnector = yield* select(
      evmChainContractsSelectors.crossChainTokenConnector,
    )

    let lastApprovedTransaction: ContractTransactionResponse | null = null
    for (let i = 0; i < tokens.length; ++i) {
      const token = tokens[i]

      const erc20Contract = tokenConnector
        ? yield* call(tokenConnector, token.address)
        : null

      if (!erc20Contract) throw new Error('Token contract not found')

      let approveTransaction: ContractTransactionResponse | null = null

      approveTransaction = (yield* call(
        erc20Contract.approve,
        token.spender,
        token.amount,
      )) as ContractTransactionResponse

      if (!approveTransaction) throw Error('Approve transaction result is null')

      const transactionReceipt = yield* apply(
        approveTransaction,
        approveTransaction.wait,
        [Confirmations],
      )

      if (transactionReceipt && transactionReceipt.status !== 1) {
        throw new Error(
          `Transaction has probably failed. Status is different than 1`,
        )
      }

      lastApprovedTransaction = approveTransaction
    }

    return lastApprovedTransaction
  } catch (error) {
    handleProviderError(error)
  }
}
