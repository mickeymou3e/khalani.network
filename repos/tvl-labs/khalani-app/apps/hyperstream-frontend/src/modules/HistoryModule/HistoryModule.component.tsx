import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'

import { Box } from '@mui/material'
import { IRow, TransferDetailsModal } from '@tvl-labs/khalani-ui'
import { TransferDetailsModalProps } from '@tvl-labs/khalani-ui/dist/components/modals/TransferDetailsModal/TransferDetailsModal.types'
import {
  chainsSelectors,
  depositHistorySelectors,
  intentsSelectors,
  pricesSelector,
} from '@tvl-labs/sdk'

import { HistoryListContainer } from '../../containers'
import { useCombinedHistory, useDestinationInfo } from './HistoryModule.hooks'
import {
  buildRowItems,
  mapDepositEntity,
  mapIntentEntity,
  mapTransferDetailsProps,
} from './HistoryModule.utils'

const HistoryModule: React.FC = () => {
  const [transferDetailsProps, setTransferDetailsProps] = useState<
    | (Omit<TransferDetailsModalProps, 'open' | 'onClose'> & {
        itemId: string
      })
    | undefined
  >(undefined)
  const [transferModalOpen, setTransferModalOpen] = useState<boolean>(false)

  const bridgeIntents = useSelector(intentsSelectors.bridgeIntents)
  const isIntentsInitialized = useSelector(intentsSelectors.isInitialized)
  const chains = useSelector(chainsSelectors.chains)
  const deposits = useSelector(depositHistorySelectors.deposits)
  const selectPriceById = useSelector(pricesSelector.selectById)

  const mappedDeposits = useMemo(() => {
    return (
      deposits?.flatMap((entity) => {
        const mapped = mapDepositEntity(entity)
        return mapped ? [mapped] : []
      }) ?? []
    )
  }, [deposits])

  const mappedBridgeIntents = useMemo(() => {
    return (
      bridgeIntents?.flatMap((entity) => {
        const mapped = mapIntentEntity(entity)
        return mapped ? [mapped] : []
      }) ?? []
    )
  }, [bridgeIntents])

  const originTxs = useMemo(
    () =>
      Array.from(
        new Set(
          mappedBridgeIntents
            .map((d) => d.withdrawTxHash)
            .filter((tx): tx is string => !!tx),
        ),
      ),
    [mappedBridgeIntents],
  )

  const destinationMap = useDestinationInfo(originTxs)
  const combinedHistory = useCombinedHistory(
    mappedDeposits,
    mappedBridgeIntents,
    destinationMap,
  )
  const rows = useMemo(() => buildRowItems(combinedHistory), [combinedHistory])

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const withdrawMTokens = () => {}

  const handleRowClick = (id: string) => {
    if (!combinedHistory) {
      throw new Error('Mapped history array is null')
    }
    const foundItem = combinedHistory.find((data) => data.id === id)
    if (!foundItem) return
    setTransferModalOpen(true)
    setTransferDetailsProps(
      mapTransferDetailsProps(
        foundItem,
        chains,
        selectPriceById,
        withdrawMTokens,
      ),
    )
  }

  useEffect(() => {
    if (transferModalOpen && transferDetailsProps) {
      const currentId = transferDetailsProps.itemId
      const updatedItem = combinedHistory.find((data) => data.id === currentId)
      if (updatedItem) {
        if (
          updatedItem.statusText !== transferDetailsProps.statusText ||
          updatedItem.progress !== transferDetailsProps.progress ||
          updatedItem.status !== transferDetailsProps.status
        ) {
          setTransferDetailsProps(
            mapTransferDetailsProps(updatedItem, chains, selectPriceById),
          )
        }
      }
    }
  }, [combinedHistory, transferModalOpen, chains, selectPriceById])

  return (
    <Box
      height="100%"
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection={'column'}
    >
      <HistoryListContainer
        rows={isIntentsInitialized ? (rows as IRow[]) : []}
        rowClickFn={handleRowClick}
        isLoading={!isIntentsInitialized}
      />
      {transferDetailsProps && transferModalOpen && (
        <TransferDetailsModal
          open={transferModalOpen}
          onClose={() => setTransferModalOpen(false)}
          {...transferDetailsProps}
        />
      )}
    </Box>
  )
}

export default HistoryModule
