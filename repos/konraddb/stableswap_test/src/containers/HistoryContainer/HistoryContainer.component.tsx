import React from 'react'
import { useSelector } from 'react-redux'

import { HistoryBadge, HistoryDropdown } from '@hadouken-project/ui'
import { IHistoryTransaction } from '@interfaces/data'
import { Box } from '@mui/material'
import { historySelector } from '@store/history/history.selector'
import { getTransactionTypeName } from '@store/history/history.utils'

export const HistoryContainer: React.FC = () => {
  const [
    historyAnchorEl,
    setHistoryAnchorEl,
  ] = React.useState<HTMLButtonElement | null>(null)

  const lastTransaction = useSelector(
    historySelector.currentPendingTransactionOrLastTransaction,
  )

  const operationsInProgressCount = useSelector(
    historySelector.operationsInProgressCount,
  )

  const historyAction: IHistoryTransaction | null = lastTransaction
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

  const openHistoryDropdown = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!historyOpen) {
      setHistoryAnchorEl(event.currentTarget)
    } else {
      setHistoryAnchorEl(null)
    }
  }

  const historyOpen = Boolean(historyAnchorEl && historyAction)

  return (
    <>
      <Box position="fixed" bottom="20px" right="20px">
        <HistoryBadge
          operationsInProgress={operationsInProgressCount}
          onClick={openHistoryDropdown}
        />
      </Box>

      {historyAction && (
        <HistoryDropdown
          width={{ xs: '100%', sm: 410 }}
          title={historyAction?.title ?? ''}
          status={historyAction?.status}
          anchorElement={historyAnchorEl}
          operations={historyAction?.operations ?? []}
          date={historyAction?.date ?? new Date()}
          open={historyOpen}
          onClose={() => setHistoryAnchorEl(null)}
        />
      )}
    </>
  )
}
