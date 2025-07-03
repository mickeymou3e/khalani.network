import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux'

import {
  HistoryBadge,
  HistoryDropdown,
  TransactionStatus,
} from '@hadouken-project/ui'
import Box from '@mui/material/Box'
import { historySelector } from '@store/history/history.selector'
import { getTransactionTypeName } from '@store/history/history.utils'

import { IHistoryTransaction } from './HistoryContainer.types'

const HIDE_AFTER_ACTION_FAILED = 15 * 1000

export const HistoryContainer: React.FC = () => {
  const [historyAnchorEl, setHistoryAnchorEl] = useState<
    HTMLButtonElement | HTMLDivElement | null
  >(null)

  const historyRef = useRef<HTMLDivElement>(null)
  const [showBadge, setShowBadge] = useState(false)
  const timeoutID = useRef<NodeJS.Timeout>()
  const isInProgress = useSelector(historySelector.inProgress)

  const lastTransaction = useSelector(
    historySelector.currentPendingTransactionOrLastTransaction,
  )

  const operationsInProgressCount = useSelector(
    historySelector.operationsInProgressCount,
  )

  const historyAction: IHistoryTransaction = useMemo(
    () =>
      lastTransaction
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
        : {
            title: '',
            date: new Date(),
            operations: [],
            status: TransactionStatus.Fail,
          },
    [lastTransaction],
  )

  const openHistoryDropdown = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!historyOpen) {
      setHistoryAnchorEl(event.currentTarget)
    } else {
      setHistoryAnchorEl(null)
    }
  }

  useEffect(() => {
    if (!isInProgress && showBadge) {
      const newTimeoutID = setTimeout(() => {
        setShowBadge(false)
        setHistoryAnchorEl(null)
      }, HIDE_AFTER_ACTION_FAILED)
      timeoutID.current = newTimeoutID
    } else if (isInProgress) {
      setShowBadge(true)

      if (timeoutID.current) clearTimeout(timeoutID.current)
    }
  }, [isInProgress])

  useEffect(() => {
    if (!historyAnchorEl && historyRef.current !== null) {
      setHistoryAnchorEl(historyRef.current)
    }
  }, [showBadge])

  const historyOpen = Boolean(historyAnchorEl && lastTransaction)

  return (
    <>
      {showBadge ? (
        <>
          <Box position="fixed" bottom="20px" right="20px">
            <div ref={historyRef}>
              <HistoryBadge
                operationsInProgress={operationsInProgressCount}
                onClick={openHistoryDropdown}
              />
            </div>
          </Box>

          <HistoryDropdown
            width={{ xs: '100%', sm: 410 }}
            title={historyAction.title}
            status={historyAction.status}
            anchorElement={historyAnchorEl}
            operations={historyAction.operations}
            date={historyAction.date}
            open={historyOpen}
            onClose={() => setHistoryAnchorEl(null)}
          />
        </>
      ) : null}
    </>
  )
}

export default HistoryContainer
