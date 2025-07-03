import { IChain, TokenModelBalance } from '@interfaces/core'

export enum FilteringType {
  Network,
  Token,
}

export interface IFilteringProps {
  chains: IChain[]
  tokens: TokenModelBalance[]
  onChainChange: (chain: IChain | undefined) => void
  onTokenChange: (chain: TokenModelBalance | undefined) => void
  chain?: IChain
  token?: TokenModelBalance
}
