import { Dispatch, SetStateAction } from 'react'

import { BigNumber } from 'ethers'

import { Network } from '@constants/Networks'
import { IChain } from '@store/chains/chains.types'
import { ITokenModelBalanceWithChain } from '@store/khala/tokens/tokens.types'

export interface IUseChainsHook {
  chains: IChain[] | null
  originChain: IChain | null
  availableOriginChains: IChain[] | null
  destinationChain: IChain | null
  setDestinationChain: Dispatch<SetStateAction<IChain | null>>
  availableDesinationChains: IChain[] | null
  setDesinationOriginChains: Dispatch<SetStateAction<IChain[] | null>>
}

export interface IUseTokenWithBalanceHook {
  allTokens: ITokenModelBalanceWithChain[]
  onlyChainIdWithTokens: Network | undefined
  selectableTokens: ITokenModelBalanceWithChain[] | null
  selectedTokenValue: BigNumber | undefined
  setSelectedTokenValue: Dispatch<SetStateAction<BigNumber | undefined>>
  originToken: ITokenModelBalanceWithChain | null
  setOriginToken: Dispatch<SetStateAction<ITokenModelBalanceWithChain>>
  destinationToken: ITokenModelBalanceWithChain | undefined
  setDestinationToken: Dispatch<
    SetStateAction<ITokenModelBalanceWithChain | undefined>
  >
  destinationTokenValue: BigNumber | undefined
  setDestinationTokenValue: Dispatch<SetStateAction<BigNumber | undefined>>
}
