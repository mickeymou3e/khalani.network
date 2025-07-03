import { ITokenBalancesAcrossChains } from '@tvl-labs/khalani-ui/dist/interfaces/balances'

export interface IHeaderContainerProps {
  text?: string
}

export interface RouteDescription {
  href: string
  id: string
  text: string
}

export interface IUseTokenBalancesAcrossChainsHook {
  tokenBalancesAcrossChains: ITokenBalancesAcrossChains[] | undefined
  accountBalance: bigint | undefined
  isFetchingBalances: boolean
}
