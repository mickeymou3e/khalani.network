import { useSelector } from 'react-redux'

import { IHistoryTransaction } from '@interfaces/history'
import { historySelector } from '@store/history/history.selector'
import { getTransactionTypeName } from '@store/history/history.utils'

export const useLastTransaction = (): IHistoryTransaction | null => {
  const lastTransaction = useSelector(
    historySelector.currentPendingTransactionOrLastTransaction,
  )

  return lastTransaction
    ? {
        title: getTransactionTypeName(lastTransaction.type),
        status: lastTransaction.status,
        date: new Date(),
        operations: lastTransaction.operations?.map((operation) => ({
          id: operation.id,
          status: operation.status,
          title: operation.title,
          description: operation.description,
        })),
      }
    : null
}
