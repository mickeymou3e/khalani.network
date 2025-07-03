import React, { useMemo, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { HistoryBadge, HistoryDropdown } from '@hadouken-project/ui'
import { IHistoryTransaction } from '@interfaces/data'
import { Box } from '@mui/material'
import { historySelector } from '@store/history/history.selector'
import { historyActions } from '@store/history/history.slice'
import { getTransactionTypeName } from '@store/history/history.utils'

export const HistoryContainer: React.FC = () => {
  const dispatch = useDispatch()
  const historyRef = useRef<HTMLDivElement>(null)

  const showBadge = useSelector(historySelector.showBadge)
  const showHistoryDropdown = useSelector(historySelector.historyDropdown)

  const lastTransaction = useSelector(
    historySelector.currentPendingTransactionOrLastTransaction,
  )

  const operationsInProgressCount = useSelector(
    historySelector.operationsInProgressCount,
  )

  const historyAction: IHistoryTransaction | null = useMemo(
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
        : null,
    [lastTransaction],
  )

  const historyOpen = Boolean(historyAction && showHistoryDropdown)

  return (
    <Box visibility={showBadge ? 'visible' : 'hidden'}>
      <Box position="fixed" bottom="20px" right="20px">
        <div ref={historyRef}>
          <HistoryBadge
            operationsInProgress={operationsInProgressCount}
            onClick={() =>
              dispatch(
                historyActions.toggleHistoryDropdown(!showHistoryDropdown),
              )
            }
          />
        </div>
      </Box>

      {historyAction && (
        <HistoryDropdown
          width={{ xs: '100%', sm: 410 }}
          title={historyAction.title}
          status={historyAction.status}
          anchorElement={historyRef.current}
          operations={historyAction.operations}
          date={historyAction.date}
          open={historyOpen}
          onClose={() => dispatch(historyActions.toggleHistoryDropdown(false))}
        />
      )}
    </Box>
  )
}
