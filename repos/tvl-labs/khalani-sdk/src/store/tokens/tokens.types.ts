import { Network } from '@constants/Networks'

export enum TokenType {
  STK = 'STK',
  KLN = 'KLN',
}

export type Address = string

export interface TokenModel {
  id: Address
  address: Address
  name: string
  symbol: string
  decimals: number
  type?: TokenType
}

export interface TokenModelBalance extends TokenModel {
  balance: bigint
}

export interface TokenModelBalanceWithChain extends TokenModelBalance {
  chainId: Network
  sourceChainId?: Network
}

export type TokenWithChainId = TokenModel & {
  chainId: Network
  sourceChainId?: string
}

export type TokenOnlyAddressAndChain = Pick<
  TokenWithChainId,
  'address' | 'chainId'
>
