import { Network } from '@constants/Networks'
import { mapContractTransactions } from './mappers'
import { TokenModelBalanceWithChain } from '@store/tokens/tokens.types'
import {
  getBridgeRequestByTransactionHash,
  getBridgeRequests,
  getWithdrawnRequests,
} from '@graph/transactions'
import {
  getDispatchedMailboxMessage,
  getProcessedMailboxMessage,
} from '@graph/mailbox'
import { ITransactionRequestGraphEntity } from '@graph/transactions/types'

export const fetchContractTransactions = async (
  sourceChain: Network,
  userAddres: string,
  first: number,
  selectTokenById: (id: string) => TokenModelBalanceWithChain | undefined,
) => {
  try {
    const mappedTransactions = []
    const transactions = await (sourceChain === Network.Khalani
      ? getWithdrawnRequests(userAddres, first)
      : getBridgeRequests(sourceChain, true, userAddres, first))

    for (const transaction of transactions) {
      const destinationChain = `0x${Number(
        transaction.destinationChainId,
      ).toString(16)}` as Network

      let intermediateChainDispatchedBridgeRequest:
        | ITransactionRequestGraphEntity
        | undefined = undefined

      if (sourceChain !== Network.Khalani) {
        const sourceChainMailboxMessage = await getDispatchedMailboxMessage(
          transaction.transactionHash,
          sourceChain,
        )

        const message = await getProcessedMailboxMessage(
          sourceChainMailboxMessage.id,
          Network.Khalani,
        )

        intermediateChainDispatchedBridgeRequest =
          await getBridgeRequestByTransactionHash(
            message.transactionHash,
            Network.Khalani,
            false,
          )
      }

      mappedTransactions.push(
        mapContractTransactions(
          transaction,
          sourceChain,
          destinationChain,
          intermediateChainDispatchedBridgeRequest?.tokens,
          selectTokenById,
        ),
      )
    }

    return mappedTransactions
  } catch (error) {
    throw new Error(`Failed to fetch contract transactions: ${error}`)
  }
}
