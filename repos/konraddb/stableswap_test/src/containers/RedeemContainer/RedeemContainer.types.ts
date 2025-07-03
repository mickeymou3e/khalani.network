import { Dispatch, SetStateAction } from 'react'

import { BigNumber } from 'ethers'

import { Address } from '@hadouken-project/ui'
import { IChain } from '@store/chains/chains.types'
import { ITokenModelBalanceWithChain } from '@store/khala/tokens/tokens.types'

export interface IUseChainsHook {
  ethChain: IChain | undefined
}
export interface IUseTokenWithBalanceHook {
  selectedTokenValue: BigNumber | undefined
  setSelectedTokenValue: Dispatch<SetStateAction<BigNumber | undefined>>
  selectedToken: ITokenModelBalanceWithChain | undefined
  destinationToken: ITokenModelBalanceWithChain | undefined
  destinationTokenValue: BigNumber | undefined
  setDestinationTokenValue: Dispatch<SetStateAction<BigNumber | undefined>>
}

export interface IRedeemRequest {
  token: Address
  user: Address
  amount: BigNumber
}
