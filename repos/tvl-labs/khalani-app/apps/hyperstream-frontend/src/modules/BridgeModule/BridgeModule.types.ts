import { Dispatch, SetStateAction } from 'react'

import { TokenModelBalanceWithChain, IChain } from '@tvl-labs/sdk'

export interface IUseChainsHook {
  chains: IChain[]
  destinationChain: IChain
  swapChains: () => void
  handleOriginChainChange: (chain: IChain) => void
  handleDestinationChainChange: (chain: IChain) => void
  originChain: IChain
}

export interface IUseTokenWithBalanceHook {
  selectableTokens: TokenModelBalanceWithChain[] | null
  selectedTokenValue: bigint | undefined
  setSelectedTokenValue: Dispatch<SetStateAction<bigint | undefined>>
  originToken: TokenModelBalanceWithChain | undefined
  setOriginToken: Dispatch<
    SetStateAction<TokenModelBalanceWithChain | undefined>
  >
  originTokenBalance: bigint | undefined

  selectableDestinationTokens: TokenModelBalanceWithChain[]
  destinationToken: TokenModelBalanceWithChain | undefined
  destinationTokenBalance: bigint | undefined
  setDestinationToken: Dispatch<
    SetStateAction<TokenModelBalanceWithChain | undefined>
  >
  destinationTokenValue: bigint | undefined
  setDestinationTokenValue: Dispatch<SetStateAction<bigint | undefined>>
}

export interface IUseTransactionSummary {
  details: any[]
}
