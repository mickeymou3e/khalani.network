import { Network } from '@constants/Networks'
import { EStatus } from '@enums/status.enum'
import { SwapIntentBook } from '@pages/Explorer/intents/types'

export const getTransactionStatus = (transaction: SwapIntentBook) => {
  let status = transaction.status
  const currentTime = new Date().getTime()
  const currentTimeInSeconds = Math.floor(currentTime / 1000)

  const timeMinus10Minutes = currentTimeInSeconds - 10 * 60

  if (timeMinus10Minutes > +transaction.blockTimestamp) {
    status = EStatus.ERROR
  }

  return status
}

export const chainIdToHexString = (chainId: number): Network =>
  `0x${chainId.toString(16)}` as Network
