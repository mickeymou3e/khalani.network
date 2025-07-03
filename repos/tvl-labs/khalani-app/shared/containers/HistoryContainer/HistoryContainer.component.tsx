import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'

import { Box } from '@mui/material'
import { IHistoryTransaction } from '@shared/interfaces'
import {
  getTransactionTypeName,
  useWallet,
  historySelector,
} from '@shared/store'
import { HistoryBadge, HistoryDropdown } from '@tvl-labs/khalani-ui'

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

  const badgeRef = useRef(null)
  const inProgress = useSelector(historySelector.inProgress)

  const wallet = useWallet()

  useEffect(() => {
    if (inProgress) {
      setHistoryAnchorEl(badgeRef.current)
    }
  }, [inProgress])

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
      {wallet.status !== 'notConnected' && (
        <Box ref={badgeRef} position="fixed" bottom="20px" right="20px">
          <HistoryBadge
            operationsInProgress={operationsInProgressCount}
            onClick={openHistoryDropdown}
          />
        </Box>
      )}

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
