import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import { IHistoryTransaction } from '@interfaces/history'
import { historySelector } from '@store/history/history.selector'
import { getTransactionTypeName } from '@store/history/history.utils'

export const useCurrentPath = (): string => {
  const history = useHistory()

  const [pathName, setPathName] = useState(
    history?.location?.pathname === '/' ? '' : history?.location?.pathname,
  )

  useEffect(() => {
    return history?.listen((location) => {
      setPathName(location.pathname === '/' ? '' : history?.location?.pathname)
    })
  }, [history])

  return pathName
}

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
