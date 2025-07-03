import { Network } from '@constants/Networks'
import { ITransactionRequestGraphEntity } from '@graph/transactions/types'
import { TokenModelBalanceWithChain } from '@store/tokens/tokens.types'
import { TransactionHistory } from '@store/transactionHistory/transactionHistory.types'
import { formatTimeAgo } from '@utils/date'
import { formatTokenSymbol } from '@utils/token'
import { v4 as uuid } from 'uuid'
import { getTransactionType } from './utils'

export const mapContractTransactions = (
  transaction: ITransactionRequestGraphEntity,
  sourceChain: Network,
  destinationChain: Network,
  destinationTokens: string[] | undefined,
  selectTokenById: (id: string) => TokenModelBalanceWithChain | undefined,
): TransactionHistory => {
  return {
    id: uuid(),
    type: getTransactionType(sourceChain, destinationChain),
    hash: transaction.transactionHash,
    sourceTokens: transaction.tokens.map((address) =>
      mapTokens(sourceChain, address, selectTokenById),
    ),
    destinationToken: destinationTokens
      ? mapTokens(destinationChain, destinationTokens[0], selectTokenById, true)
      : undefined,
    amounts: transaction.amounts.map((amount) => BigInt(amount)),
    time: formatTimeAgo(transaction.blockTimestamp),
  }
}

const mapTokens = (
  sourceChain: Network,
  address: string,
  selectTokenById: (id: string) => TokenModelBalanceWithChain | undefined,
  isMirrorToken = false,
) => {
  const foundToken = selectTokenById(
    `${isMirrorToken ? Network.Khalani : sourceChain}:${address.toLowerCase()}`,
  )

  return {
    symbol: formatTokenSymbol(foundToken?.symbol) ?? '',
    network: sourceChain,
    decimals: foundToken?.decimals,
  }
}
