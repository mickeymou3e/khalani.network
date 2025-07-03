import { BigNumber } from 'ethers'

import { Network } from '@constants/Networks'
import { IInitializeSaga } from '@interfaces/data'

import { ITokenModelBalanceWithChain } from '../tokens/tokens.types'

export type IKhalaBalancesSagaState = IInitializeSaga & {
  isFetching: boolean
  onlyChainIdWithTokens?: Network
}

export interface IKhalaBalances {
  id: ITokenModelBalanceWithChain['id']
  balance: BigNumber
  chainId: Network
}
