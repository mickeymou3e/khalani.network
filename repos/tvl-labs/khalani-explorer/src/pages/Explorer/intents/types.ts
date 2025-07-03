import { BigNumber } from 'ethers'

export type SwapIntentBookResponse = {
  id: string
  blockNumber: number
  blockTimestamp: string
  callData: string
  gasLimit: string
  gasPrice: string
  intent: string
  intentId: string
  signature: string
  transactionHash: string
}

export interface SwapIntentBook extends SwapIntentBookResponse {
  author: string
  sourceAmount: BigNumber
  nonce: bigint
  sourcePermit2: string
  sourceChainId: number
  destinationChainId: number
  sourceToken: string
  destinationToken: string
  deadline: string
  status: string
}

export interface IntentsMempoolTransaction {
  sourceNetwork: string
  transactionHash: string
  destinationChain: string
}
