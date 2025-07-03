import React, { useEffect, useCallback } from 'react'
import { useSelector } from 'react-redux'

import { historySelector } from '@store/history/history.selector'

const HistoryProgressContainer: React.FC = () => {
  const transactionInProgress = useSelector(historySelector.inProgress)

  const onPageUnload = useCallback(
    (event: BeforeUnloadEvent) => {
      if (transactionInProgress) {
        event.preventDefault()
        event.returnValue = ''
      }
    },
    [transactionInProgress],
  )

  useEffect(() => {
    window.addEventListener('beforeunload', onPageUnload)

    return () => {
      window.removeEventListener('beforeunload', onPageUnload)
    }
  }, [onPageUnload, transactionInProgress])

  return null
}

export default HistoryProgressContainer
