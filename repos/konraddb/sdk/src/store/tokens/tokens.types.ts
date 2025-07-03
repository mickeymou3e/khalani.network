import { Network } from '../../constants/Networks'
import { BigNumber } from 'ethers'

export type Address = string

export interface TokenModel {
  id: Address
  address: Address
  name: string
  symbol: string
  decimals: number
}

export interface TokenModelBalance extends TokenModel {
  balance: BigNumber
}

export interface TokenModelBalanceWithChain extends TokenModelBalance {
  chainId: Network
}

export type TokenWithChainId = TokenModel & {
  chainId: Network
  sourceChainId?: string
}

export type TokenOnlyAddressAndChain = Pick<
  TokenWithChainId,
  'address' | 'chainId'
>
