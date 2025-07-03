import { fetchContractTransactions } from '@dataSource/transactionHistory'
import { providerSelector } from '@store/provider/provider.selector'
import { tokenSelectors } from '@store/tokens/tokens.selector'
import { call, select, put } from 'typed-redux-saga'
import { transactionHistoryActions } from '../transactionHistory.slice'

export function* updateTransactionHistorySaga(): Generator {
  yield* put(transactionHistoryActions.updateTransactionHistoryRequest())
  try {
    const userAddress = yield* select(providerSelector.userAddress)
    const network = yield* select(providerSelector.network)

    const selectTokenById = yield* select(tokenSelectors.selectById)

    if (!userAddress) return

    if (!network) {
      throw new Error('Invalid input: network must be provided.')
    }

    const contractTransactions = yield* call(
      fetchContractTransactions,
      network,
      userAddress,
      5,
      selectTokenById,
    )

    yield* put(
      transactionHistoryActions.updateTransactionHistory(contractTransactions),
    )
    yield* put(transactionHistoryActions.updateTransactionHistorySuccess())

    return contractTransactions
  } catch (error) {
    yield* put(transactionHistoryActions.updateTransactionHistoryFailure())
    console.error(error)
  }
}
