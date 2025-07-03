import { Network } from '@constants/Networks'
import { TransactionType } from '@store/transactionHistory/transactionHistory.types'

export const getTransactionType = (
  sourceChain: Network,
  destinationChain: Network,
) => {
  if (sourceChain === Network.Khalani) {
    return TransactionType.WITHDRAW_LIQUIDITY
  }

  if (destinationChain === Network.Khalani) {
    return TransactionType.PROVIDE_LIQUIDITY
  }

  return TransactionType.BRIDGE
}
