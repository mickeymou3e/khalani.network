import { getHyperlaneSubgraphClient } from '@graph/init'
import {
  DESTINATION_TX_QUERY,
  DESTINATION_TXS_QUERY,
  MESSAGE_VIEW_QUERY,
} from './queries'
import { DestinationInfo, MessageView } from './types'

const formatTxHash = (txHash: string): string => {
  return txHash.startsWith('0x') ? '\\x' + txHash.slice(2) : '\\x' + txHash
}

export async function getHyperlaneMessage(
  txHash: string,
): Promise<MessageView> {
  const client = getHyperlaneSubgraphClient()

  const formatted = formatTxHash(txHash)

  const { data, errors } = await client.query<{
    message_view: MessageView[]
  }>({
    query: MESSAGE_VIEW_QUERY,
    variables: { txHash: formatted },
  })

  if (errors?.length) {
    console.error('GraphQL errors:', errors)
    throw new Error(errors.map((e) => e.message).join('\n'))
  }

  return data.message_view[0]
}

export async function getHyperlaneDestinationTx(
  txHash: string,
): Promise<MessageView> {
  const client = getHyperlaneSubgraphClient()

  const formatted = formatTxHash(txHash)

  const { data, errors } = await client.query<{
    message_view: MessageView[]
  }>({
    query: DESTINATION_TX_QUERY,
    variables: { txHash: formatted },
  })

  if (errors?.length) {
    console.error('GraphQL errors:', errors)
    throw new Error(errors.map((e) => e.message).join('\n'))
  }

  return data.message_view[0]
}

export async function getDestinationsByOriginHashes(
  txHashes: string[],
): Promise<DestinationInfo[]> {
  const client = getHyperlaneSubgraphClient()

  const formatted: string[] = txHashes.map((hex) => formatTxHash(hex))

  const { data, errors } = await client.query<{
    message_view: DestinationInfo[]
  }>({
    query: DESTINATION_TXS_QUERY,
    variables: { txHashes: formatted },
  })

  if (errors?.length) {
    throw new Error(errors.map((e) => e.message).join('\n'))
  }

  return data.message_view
}
