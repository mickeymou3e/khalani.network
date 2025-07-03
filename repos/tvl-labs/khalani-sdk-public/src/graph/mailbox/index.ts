import { Network } from '@constants/Networks'
import { getKhalaniSubgraphClient } from '@graph/init'
import { DISPATCHED_MESSAGE_QUERY, PROCESSED_MESSAGE_QUERY } from './queries'

export async function getProcessedMailboxMessage(
  id: string,
  network: Network,
): Promise<BridgeProcessedMessage> {
  const client = getKhalaniSubgraphClient(network)
  const queryResult = await client.query({
    query: PROCESSED_MESSAGE_QUERY,
    variables: {
      id,
    },
  })

  return queryResult.data.messagesQuery[0]
}

export async function getDispatchedMailboxMessage(
  transactionHash: string,
  network: Network,
): Promise<BridgeProcessedMessage> {
  const client = getKhalaniSubgraphClient(network)
  const queryResult = await client.query({
    query: DISPATCHED_MESSAGE_QUERY,
    variables: {
      transactionHash,
    },
  })

  return queryResult.data.messagesQuery[0]
}
