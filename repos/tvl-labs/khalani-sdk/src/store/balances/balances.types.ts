import { Network } from '@constants/Networks'
import { RequestStatus } from '@constants/Request'
import { TokenModelBalanceWithChain } from '@store/tokens/tokens.types'

export interface IBalancesSagaState {
  isFetching: boolean
  status: RequestStatus
}

export interface IBalances {
  id: TokenModelBalanceWithChain['id']
  tokenSymbol: TokenModelBalanceWithChain['symbol']
  balance: bigint
  chainId: Network
  decimals: number
}
