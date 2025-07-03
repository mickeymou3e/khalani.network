import { useEffect, useMemo, useRef, useState } from 'react'

import { ETransactionStatus } from '@tvl-labs/khalani-ui'
import { getDestinationsByOriginHashes } from '@tvl-labs/sdk'
import { DestinationInfo } from '@tvl-labs/sdk/dist/app/src/graph/hyperlane/types'
import {
  FillStructure,
  mapFillStructure,
} from '@tvl-labs/sdk/dist/app/src/interfaces/outcome'

import { HistoryListItem } from './HistoryModule.types'
import { convertPostgresHex } from './HistoryModule.utils'

export function useCombinedHistory(
  mappedDeposits: HistoryListItem[],
  mappedBridgeIntents: HistoryListItem[],
  destinationMap: Record<string, DestinationInfo>,
): HistoryListItem[] {
  return useMemo(() => {
    const deposits = mappedDeposits.filter(
      (d) => d.intentType !== mapFillStructure(FillStructure.PercentageFilled),
    )

    const depositById = new Map<string, HistoryListItem>(
      deposits.map((d) => [d.id, d]),
    )
    const intentById = new Map<string, HistoryListItem>(
      mappedBridgeIntents.map((i) => [i.id, i]),
    )

    const allIds = new Set<string>([
      ...depositById.keys(),
      ...intentById.keys(),
    ])

    const combined: HistoryListItem[] = []
    allIds.forEach((id) => {
      const deposit = depositById.get(id)
      const intent = intentById.get(id)
      const destInfo = intent?.withdrawTxHash
        ? destinationMap[intent.withdrawTxHash]
        : undefined

      let item: HistoryListItem
      if (destInfo?.is_delivered) {
        const base = intent ?? deposit!
        item = {
          ...base,
          depositTx: deposit?.depositTx,
          status: ETransactionStatus.Success,
          statusText: 'Delivered',
          progress: 100n,
          destinationTxHash: destInfo?.destination_tx_hash ?? undefined,
        }
      } else if (intent) {
        item = {
          ...intent,
          depositTx: deposit?.depositTx,
        }
      } else if (deposit) {
        item = deposit
      } else {
        return
      }

      combined.push(item)
    })

    combined.sort((a, b) => b.timestamp - a.timestamp)
    return combined
  }, [mappedDeposits, mappedBridgeIntents, destinationMap])
}

export function useDestinationInfo(
  originTxs: string[],
  { intervalMs = 5_000 } = {},
) {
  const [map, setMap] = useState<Record<string, DestinationInfo>>({})
  const pending = useRef<Set<string>>(new Set())

  const originKey = originTxs.join('|')

  useEffect(() => {
    pending.current = new Set(originTxs)
    setMap({})
  }, [originKey])

  useEffect(() => {
    let cancelled = false

    const fetchOnce = async () => {
      if (pending.current.size === 0) return
      try {
        const infos = await getDestinationsByOriginHashes(
          Array.from(pending.current),
        )
        if (cancelled) return
        setMap((prev) => {
          const next = { ...prev }
          infos.forEach((i) => {
            const originTxHash = convertPostgresHex(i.origin_tx_hash)
            next[originTxHash] = i
            if (i.is_delivered) {
              pending.current.delete(originTxHash)
            }
          })
          return next
        })
      } catch (err) {
        console.error('Error fetching delivery info', err)
      }
    }

    fetchOnce()
    const timer = setInterval(fetchOnce, intervalMs)
    return () => {
      cancelled = true
      clearInterval(timer)
    }
  }, [originKey, intervalMs])

  return map
}
