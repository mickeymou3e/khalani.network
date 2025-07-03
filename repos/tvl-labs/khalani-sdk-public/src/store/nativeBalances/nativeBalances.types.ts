import { RequestStatus } from '@constants/Request'
import { IChain } from '@store/chains/chains.types'

export type INativeBalancesSagaState = {
  status: RequestStatus
  isFetching: boolean
}

export interface INativeBalances {
  id: string
  tokenSymbol: IChain['nativeCurrency']['symbol']
  balance: bigint
  chainId: IChain['chainId']
  decimals: IChain['nativeCurrency']['decimals']
}
