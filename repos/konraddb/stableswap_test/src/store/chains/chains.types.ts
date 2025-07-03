import { Network } from '@constants/Networks'
import { IInitializeSaga } from '@interfaces/data'

export interface IChainsSliceState extends IInitializeSaga {
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
  isDefault?: boolean
  poolTokenSymbol?: string
}
