import { Network } from '@constants/Networks'

export interface IChainsSliceState {
  chains: IChain[]
}

export interface IChain {
  id: number
  chainName: string
  nativeCurrency: {
    name: string
    symbol: string
    decimals: number
  }
  chainId: Network
  blockExplorerUrls: string[]
  rpcUrls: string[]
  logo: string
  borderColor: string
  poolTokenSymbols?: string[]
}
